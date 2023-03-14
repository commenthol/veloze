import * as http2 from 'node:http2'
import { Router } from './Router.js'
import { safeServerShutdown } from './utils/safeServerShutdown.js'
import { logger } from './utils/logger.js'

/**
 * @typedef {import('http2').SecureServerOptions} Http2SecureServerOptions
 * @typedef {import('./Router').RouterOptions} RouterOptions
 * @typedef {http2.Http2Server|http2.Http2SecureServer} Http2Server
 * @typedef {Http2SecureServerOptions & RouterOptions & {gracefulTimeout: number}} ServerOptions
 */

const log = logger(':server')

/**
 * @class
 * HTTP2 server
 *
 * If providing a key and cert then server starts as secureServer.
 */
export class Server extends Router {
  #server
  #serverOptions
  #shutdownOptions

  /**
   * @param {ServerOptions} options
   */
  constructor (options) {
    const {
      connect,
      finalHandler,
      findRoute,
      gracefulTimeout,
      ...serverOptions
    } = options || {}

    super({ connect, finalHandler, findRoute })
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
  listen (port, hostname, backlog, listeningListener) {
    const { key, cert, pfx } = this.#serverOptions
    const createServer = ((key && cert) || pfx)
      ? http2.createSecureServer
      : http2.createServer
    // @ts-expect-error
    this.#server = createServer(this.handle, this.#serverOptions)
    safeServerShutdown(this.#server, this.#shutdownOptions)
    this.#server.listen(port, hostname, backlog, listeningListener)
    log.info('server started %s', this.#server.address())
    return this.#server
  }

  /**
   * Closes all connections and shuts down the server after `gracefulTimeout`
   *
   * @param {{(err?: Error): void}} callback
   * @returns {Http2Server}
   */
  close (callback) {
    return this.#server.close(callback)
  }
}
