import * as http from 'node:http'
import { logger } from './logger.js'

/**
 * @typedef {import('../types').Log} Log
 * @typedef {import('http').Server} HttpServer
 * @typedef {import('https').Server} HttpSecureServer
 * @typedef {import('http2').Http2Server} Http2Server
 * @typedef {import('http2').Http2SecureServer} Http2SecureServer
 * @typedef {{closeAsync: () => Promise<void>}} CloseAsync
 * @typedef {(HttpServer|HttpSecureServer|Http2Server|Http2SecureServer) & CloseAsync} Server
 */

const EXIT_EVENTS = [
  'uncaughtException',
  'beforeExit',
  'SIGINT',
  'SIGTERM',
  'SIGHUP',
  'SIGBREAK'
]

/**
 * gracefully shutdown http/ https server
 * alternative to [stoppable](https://github.com/hunterloftis/stoppable).
 *
 * @param {Server} server the server instance
 * @param {object} [options]
 * @param {number} [options.gracefulTimeout=1000] (ms) graceful timeout for existing connections
 * @param {Log} [options.log] logger
 */
export function safeServerShutdown (server, options) {
  const {
    gracefulTimeout = 1000,
    log = logger(':safeShutdown')
  } = options || {}

  let isShutdown = false

  const serverClose = server.close.bind(server)

  const sockets = new Set()

  function connect (socket) {
    if (isShutdown) {
      destroy([socket])
      return
    }
    sockets.add(socket)
    socket.once('close', function () {
      sockets.delete(socket)
    })
  }

  function setHeaderConnectionClose (res) {
    if (!res.headersSent) {
      res.setHeader('connection', 'close')
    }
  }

  server.on('connection', connect)

  server.on('secureConnection', connect)

  // @ts-expect-error
  server.close = function close (callback) {
    isShutdown = true
    log.info('server is shutting down')

    server.on('request', (req, res) => {
      /* c8 ignore next */
      setHeaderConnectionClose(res)
    })

    for (const socket of sockets) {
      if (!(socket.server instanceof http.Server)) {
        // HTTP CONNECT request socket
        continue
      }

      const res = socket._httpMessage
      if (res) {
        setHeaderConnectionClose(res)
        continue
      }
    }

    ;(async () => {
      if (sockets.size) {
        await sleep(gracefulTimeout)
        destroy(sockets)
      }

      serverClose(err => {
        err
          ? log.error(`server shutdown with failures ${err.message}`)
          : log.info('server shutdown successful')
        if (typeof callback === 'function') {
          callback(err)
        }
      })
    })()

    return server
  }

  server.closeAsync = () => new Promise((resolve, reject) => {
    server.close((err) => {
      err ? reject(err) : resolve()
    })
  })

  EXIT_EVENTS.forEach(ev => process.on(ev, () => {
    if (isShutdown) return
    /* c8 ignore next */
    server.close()
  }))
}

const sleep = (ms) => new Promise(resolve => setTimeout(() => { resolve(ms) }, ms))

function destroy (sockets) {
  for (const socket of sockets) {
    socket.end()
  }
  setImmediate(() => {
    for (const socket of sockets) {
      socket.destroy()
    }
  })
}
