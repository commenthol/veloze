import * as http from 'node:http'
import { connect as connectDef } from './connect.js'
import { finalHandler as finalHandlerDef } from './middleware/index.js'
import { FindRoute } from './FindRoute.js'
import { HttpError } from './HttpError.js'
import { REQ_METHOD_HEAD } from './constants.js'

/**
 * @typedef {import('../src/types').Method} Method
 * @typedef {import('../src/types').Handler} Handler
 * @typedef {import('../src/types').HandlerCb} HandlerCb
 * @typedef {import('../src/types').FinalHandler} FinalHandler
 * @typedef {import('../src/types').Request} Request
 * @typedef {import('../src/types').Response} Response
 * @typedef {import('../src/types').Connect} Connect
 * @typedef {import('../src/types').Log} Logger
 */

const unique = arr => [...new Set(arr)]

/**
 * Router
 */
export class Router {
  #tree
  #finalHandler
  #connect
  #preHooks
  #postHooks

  /**
   * @param {{
   *  connect?: Connect
   *  finalHandler?: FinalHandler
   *  findRoute?: FindRoute
   * }} [opts]
   */
  constructor (opts) {
    const {
      connect,
      finalHandler,
      findRoute
    } = opts || {}
    this.#tree = findRoute || new FindRoute()
    this.#finalHandler = finalHandler || finalHandlerDef()
    this.#connect = connect || connectDef
    this.#preHooks = []
    this.#postHooks = []
    this.handle = this.handle.bind(this)
  }

  /**
   * print the routing-tree from FindRoute
   */
  /* c8 ignore next 3 */
  print () {
    return this.#tree.print()
  }

  /**
   * add a pre-hook handler
   * @param  {...Handler} handlers
   * @returns {this}
   */
  preHook (...handlers) {
    this.#preHooks = [...this.#preHooks, ...handlers]
    return this
  }

  /**
   * add a post-hook handler
   * @param  {...Handler} handlers
   * @returns {this}
   */
  postHook (...handlers) {
    this.#postHooks = [...this.#postHooks, ...handlers]
    return this
  }

  /**
   * route by method(s) and path(s)
   * @param {Method|Method[]} methods
   * @param {string|string[]} paths
   * @param  {...Handler} handlers
   * @returns {this}
   */
  method (methods, paths, ...handlers) {
    // @ts-expect-error
    for (const method of [].concat(methods)) {
      // @ts-expect-error
      for (const path of [].concat(paths)) {
        this.#tree.add(method, path, this.#connect(...this.#preHooks, ...handlers, ...this.#postHooks))
      }
    }
    return this
  }

  /**
   * route all methods
   * @param {string} path
   * @param  {...Handler} handlers
   * @returns {this}
   */
  all (path, ...handlers) {
    return this.method('ALL', path, ...handlers)
  }

  /**
   * mount router or add pre-hook handler
   *
   * `app.use(handler)` adds `handler` as pre-hook handler which is added to all following routes
   * `app.use('/path', handler)` mounts `handler` on `/path/*` for ALL methods
   *
   * @param {string|string[]|Handler} path
   * @param  {...Handler} handlers
   */
  use (path, ...handlers) {
    // apply as pre-hook handler
    if (typeof path === 'function') {
      return this.preHook(path, ...handlers)
    }

    const { length } = path
    function rewrite (req, res, next) {
      req.url = req.url.slice(length) || '/'
      next()
    }

    const connected = this.#connect(...this.#preHooks, rewrite, ...handlers, ...this.#postHooks)
    // @ts-expect-error
    const pathnames = unique([].concat(path).map(p => [p, `${p}/*`]).flat())
    this.#tree.add('ALL', pathnames, connected)
    return this
  }

  /**
   * request handler
   * @param {Request} req
   * @param {Response} res
   * @param {Function} [next]
   */
  handle (req, res, next) {
    const final = (err) => {
      if (next) {
        next(err)
        return
      }
      const _err = err || new HttpError(404)
      this.#finalHandler(_err, req, res, () => { })
    }

    if (!req.originalUrl) {
      // originalUrl is set as url gets shortened on every router mount
      req.originalUrl = req.url
      // finalHandler will be invoked if response emits an error
      res.once('error', final)

      if (req.method === 'HEAD') {
        res[REQ_METHOD_HEAD] = true
        req.method = 'GET'
      }
    }

    /** @type {{handler: HandlerCb, params: object}|undefined} */
    // @ts-expect-error
    const found = this.#tree.find(req)
    if (!found?.handler) {
      final(new HttpError(404))
      return
    }
    req.params = found.params || {}
    found.handler(req, res, final)
  }

  /**
   * start a server at `port`
   *
   * shortcut to `http.createServer(router.handle).listen(port)`
   *
   * @see https://nodejs.org/dist/latest/docs/api/http.html#serverlisten
   * @param  {number} port
   * @param  {...any} args
   * @returns {http.Server}
   */
  /* c8 ignore next 6 */
  listen (port, ...args) {
    return http
      // @ts-expect-error
      .createServer((req, res) => this.handle(req, res))
      .listen(port, ...args)
  }
}
// TODO: .listen() should default to http2 server
// TODO: .listen() move to a separate module!

http.METHODS.filter(method => method !== 'HEAD').forEach(method => {
  const methodLc = method.toLowerCase()
  /**
   * @param {string} path
   * @param  {...Handler} handlers
   */
  const { [methodLc]: fn } = {
    [methodLc]: function (path, ...handlers) {
      // @ts-expect-error
      return this.method(method, path, ...handlers)
    }
  }
  Router.prototype[methodLc] = fn
})
