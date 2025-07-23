import { METHODS as httpMethods } from 'node:http'
import { connect as connectDef } from './connect.js'
import { finalHandler as finalHandlerDef } from './middleware/index.js'
import { FindRoute } from './FindRoute.js'
import { HttpError } from './HttpError.js'
import { REQ_METHOD_HEAD } from './constants.js'
import { setPath } from './request/setPath.js'

/**
 * @typedef {import('./types.js').Method} Method
 * @typedef {import('./types.js').Handler} Handler
 * @typedef {import('./types.js').HandlerCb} HandlerCb
 * @typedef {import('./types.js').FinalHandler} FinalHandler
 * @typedef {import('./types.js').Request} Request
 * @typedef {import('./types.js').Response} Response
 * @typedef {import('./types.js').Log} Logger
 * @typedef {import('#connect.js').connect} Connect
 */
/**
 * @typedef {object} RouterOptions
 * @property {Connect} [connect]
 * @property {FinalHandler} [finalHandler]
 * @property {FindRoute} [findRoute]
 * @property {number} [cacheSize]
 */

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
   * @param {RouterOptions} [options]
   */
  constructor(options) {
    const { cacheSize, connect, finalHandler, findRoute } = options || {}
    this.#tree = findRoute || new FindRoute(cacheSize)
    this.#finalHandler = finalHandler || finalHandlerDef()
    this.#connect = connect || connectDef
    this.#preHooks = []
    this.#postHooks = []
    this.handle = this.handle.bind(this)
    /** @type {string} */
    this.mountPath = '/'
  }

  /**
   * print the routing-tree from FindRoute
   */
  /* c8 ignore next 3 */
  print() {
    return this.#tree.print()
  }

  /**
   * add a pre-hook handler
   * @param {...(Handler|Handler[]|undefined)} handlers
   * @returns {this}
   */
  preHook(...handlers) {
    this.#preHooks = [...this.#preHooks, ...handlers]
    return this
  }

  /**
   * add a post-hook handler
   * @param {...(Handler|Handler[]|undefined)} handlers
   * @returns {this}
   */
  postHook(...handlers) {
    this.#postHooks = [...this.#postHooks, ...handlers]
    return this
  }

  /**
   * route by method(s) and path(s)
   * @param {Method|Method[]} methods
   * @param {string|string[]} paths
   * @param {...(Handler|Handler[]|undefined)} handlers
   * @returns {this}
   */
  method(methods, paths, ...handlers) {
    if (!handlers.length) {
      return this
    }
    const connect = this.#connect(
      ...this.#preHooks,
      ...handlers,
      ...this.#postHooks
    )

    // @ts-expect-error
    for (const method of [].concat(methods)) {
      // @ts-expect-error
      for (const path of [].concat(paths)) {
        this.#tree.add(method, path, connect)
      }
    }
    return this
  }

  /**
   * route all methods
   * @param {string} path
   * @param {...(Handler|Handler[]|undefined)} handlers
   * @returns {this}
   */
  all(path, ...handlers) {
    return this.method('ALL', path, ...handlers)
  }

  /**
   * mount router or add pre-hook handler
   *
   * `app.use(handler)` adds `handler` as pre-hook handler which is added to all following routes
   *
   * `app.use('/path', handler)` mounts `handler` on `/path/*` for ALL methods
   *
   * @param {string|string[]|Handler|Router} path
   * @param  {...(Handler|Handler[]|undefined)} handlers
   */
  use(path, ...handlers) {
    // mount a router under it's mountPath
    if (path instanceof Router) {
      const router = path
      path = router.mountPath
      handlers.unshift(router.handle)
    }
    // apply as pre-hook handler
    else if (
      typeof path === 'function' ||
      (Array.isArray(path) && typeof path[0] === 'function')
    ) {
      // @ts-expect-error
      return this.preHook(path, ...handlers)
    }

    // @ts-expect-error
    const paths = [].concat(path)

    for (const p of paths) {
      const path = p.replace(/([/]{1,5})$/, '')

      const { length } = path
      function rewrite(req, res, next) {
        req.url = req.url.slice(length) || '/'
        next()
      }

      const pathnames = [path || '/', `${path}/*`]
      const connected = this.#connect(
        ...this.#preHooks,
        rewrite,
        ...handlers,
        ...this.#postHooks
      )
      this.#tree.add('ALL', pathnames, connected)
    }

    return this
  }

  /**
   * request handler
   * @param {Request} req
   * @param {Response} res
   * @param {Function} [next]
   */
  handle(req, res, next) {
    const final =
      next ||
      ((err) =>
        this.#finalHandler(err || new HttpError(404), req, res, () => {}))

    if (!req.originalUrl) {
      // originalUrl is set as url gets shortened on every router mount
      req.originalUrl = req.url
      // finalHandler will be invoked if response emits an error
      // @ts-expect-error
      res.once('error', final)

      if (req.method === 'HEAD') {
        res[REQ_METHOD_HEAD] = true
        req.method = 'GET'
      }
    }

    /** @type {{handler: HandlerCb, params: object, path: string}|undefined} */
    // @ts-expect-error
    const found = this.#tree.find(req)
    if (!found?.handler) {
      final(new HttpError(404))
      return
    }
    req.params = found.params || {}
    setPath(req, found.path || '/')
    found.handler(req, res, final)
  }

  // --- define common methods for types ---
  /**
   * @param {string} path
   * @param {...(Handler|Handler[]|undefined)} handlers
   */
  connect(path, ...handlers) {} // eslint-disable-line no-unused-vars
  /**
   * @param {string} path
   * @param {...(Handler|Handler[]|undefined)} handlers
   */
  delete(path, ...handlers) {} // eslint-disable-line no-unused-vars
  /**
   * @param {string} path
   * @param {...(Handler|Handler[]|undefined)} handlers
   */
  get(path, ...handlers) {} // eslint-disable-line no-unused-vars
  /**
   * @param {string} path
   * @param {...(Handler|Handler[]|undefined)} handlers
   */
  options(path, ...handlers) {} // eslint-disable-line no-unused-vars
  /**
   * @param {string} path
   * @param {...(Handler|Handler[]|undefined)} handlers
   */
  post(path, ...handlers) {} // eslint-disable-line no-unused-vars
  /**
   * @param {string} path
   * @param {...(Handler|Handler[]|undefined)} handlers
   */
  put(path, ...handlers) {} // eslint-disable-line no-unused-vars
  /**
   * @param {string} path
   * @param {...(Handler|Handler[]|undefined)} handlers
   */
  patch(path, ...handlers) {} // eslint-disable-line no-unused-vars
  /**
   * @param {string} path
   * @param {...(Handler|Handler[]|undefined)} handlers
   */
  search(path, ...handlers) {} // eslint-disable-line no-unused-vars
  /**
   * @param {string} path
   * @param {...(Handler|Handler[]|undefined)} handlers
   */
  trace(path, ...handlers) {} // eslint-disable-line no-unused-vars
}

httpMethods
  .filter((method) => method !== 'HEAD')
  .forEach((method) => {
    const methodLc = method.toLowerCase()
    /**
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     */
    const { [methodLc]: fn } = {
      [methodLc]: function (path, ...handlers) {
        // @ts-expect-error
        return this.method(method, path, ...handlers)
      }
    }
    Router.prototype[methodLc] = fn
  })
