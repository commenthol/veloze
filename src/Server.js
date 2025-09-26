import * as http from 'node:http'
import * as https from 'node:https'
import * as http2 from 'node:http2'
import { readFileSync } from 'node:fs'
import { Router } from './Router.js'
import { safeServerShutdown } from './utils/safeServerShutdown.js'
import { logger } from './utils/logger.js'

/** @typedef {http2.Http2Server|http2.Http2SecureServer} Http2Server */
/** @typedef {import('./types.js').ServerOptions} ServerOptions */
/** @typedef {import('node:net').AddressInfo} AddressInfo */

const log = logger(':server')

/**
 * @class
 * HTTP2 or HTTP1/HTTPS server
 *
 * If providing a `key` and `cert` in options, then server starts as secure
 * server.
 *
 * Server starts as HTTP2 server by default allowing fallback to HTTP1
 * connections.
 */
export class Server extends Router {
  #server
  #serverOptions
  #shutdownOptions
  #onlyHTTP1

  /**
   * @param {ServerOptions} options
   */
  constructor(options) {
    const {
      onlyHTTP1 = false,
      connect,
      finalHandler,
      findRoute,
      gracefulTimeout,
      ...serverOptions
    } = options || {}

    super({ connect, finalHandler, findRoute })
    loadCerts(serverOptions)

    this.#onlyHTTP1 = onlyHTTP1
    this.#serverOptions = {
      allowHTTP1: true,
      ...serverOptions
    }
    this.#shutdownOptions = { gracefulTimeout }
  }

  /**
   * Starts the server with listening on port, hostname, ...
   *
   * Signatures:
   * ```ts
   * (port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): Http2Server
   * (port?: number, hostname?: string, listeningListener?: () => void): Http2Server
   * (port?: number, backlog?: number, listeningListener?: () => void): Http2Server
   * (port?: number, listeningListener?: () => void): Http2Server
   * ```
   * @param {number} [port]
   * @param {string|number|{(): void}} [hostname]
   * @param {number|{(): void}} [backlog]
   * @param {{(): void}} [listeningListener]
   * @returns {Http2Server}
   */
  listen(port, hostname, backlog, listeningListener) {
    const { key, cert, pfx } = this.#serverOptions
    const refCreateSecureServer = this.#onlyHTTP1
      ? https.createServer
      : http2.createSecureServer
    const refCreateServer = this.#onlyHTTP1
      ? http.createServer
      : http2.createServer
    const createServer =
      (key && cert) || pfx
        ? // @ts-expect-error
          (handle, options) => refCreateSecureServer(options, handle)
        : // @ts-expect-error
          (handle) => refCreateServer(handle)
    this.#server = createServer(this.handle, this.#serverOptions)
    safeServerShutdown(this.#server, this.#shutdownOptions)
    this.#server.listen(port, hostname, backlog, listeningListener)
    log.info('server started %j', this.#server.address())
    return this.#server
  }

  /**
   * @returns {string | AddressInfo | null}
   */
  address() {
    return this.#server?.address()
  }

  /**
   * Closes all connections and shuts down the server after `gracefulTimeout`
   *
   * @param {{(err?: Error): void}} callback
   * @returns {Http2Server}
   */
  close(callback) {
    return this.#server?.close(callback)
  }
}

const LOAD_CERTS_KEYS = ['key', 'cert', 'pfx', 'passphrase']

/**
 * load certificates and passphrase from file if option is an instance of URL
 * @param {ServerOptions|{}} serverOptions
 * @returns {ServerOptions|{}}
 */
const loadCerts = (serverOptions = {}) => {
  for (const key of LOAD_CERTS_KEYS) {
    if (serverOptions[key] instanceof URL) {
      const data = readFileSync(serverOptions[key])
      serverOptions[key] = data
      if (key === 'passphrase') {
        serverOptions[key] = data.toString().trimEnd()
      }
    }
  }
  return serverOptions
}
