import * as fsp from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { send } from '../response/send.js'
import { logger } from '../utils/logger.js'
import { isProdEnv } from '../utils/index.js'
import { CONTENT_TYPE, MIME_HTML_UTF8, RES_NEXT } from '../constants.js'
import { HttpError } from '../HttpError.js'

/**
 * @typedef {import('#types.js').HandlerCb} HandlerCb
 * @typedef {import('#types.js').Response} Response
 */
/**
 * @typedef {string} EngineExtension the engine extension e.g. `html`, `hbs`, `ejs`
 */
/**
 * @typedef {object} Engine engine compliant with [consolidate](https://www.npmjs.com/package/consolidate)
 */
/**
 * @typedef {object} ViewOptions
 * @property {EngineExtension} ext The default engine extension to use when omitted.
 * @property {Engine} engine Record of engines for rendering
 * @property {string|string[]} [views] Root path(s) for views; defaults to `process.cwd() + '/views`
 * @property {Record<string, any>|{}} locals default locals for the later template
 * @property {boolean} [cache] if `true` use template cache provided by template `engine`. Defaults to `true` for `process.env_NODE_ENV='production'`
 * @property {Map|null} [pathCache] cache implementation for storing pathnames (must implement Map interface); If `null` no cache is used. Defaults to `null` for development and `Map()` for production environments
 */

let log

/**
 * Middleware to support render engines like ejs, hbs, ...;
 *
 * Works with all render engines from [consolidate](https://www.npmjs.com/package/consolidate)
 *
 * @param {ViewOptions} options
 * @returns {HandlerCb}
 *
 * @example <caption>with handlebars</caption>
 * import { Router, renderEngine } from 'veloze'
 * import hbs from 'express-hbs'
 * const hbsRouter = new Router()
 * // add the middleware as preHook for all routes defined in the latter
 * hbsRouter.preHook(renderEngine({
 *   ext: 'hbs',
 *   engine: hbs.express4(),
 *   view: new URL('./views', import.meta.url), // specify view directory
 *   locals: { app: 'this app' } // application defaults for rendering
 * }))
 * hbsRouter.get('/', (req, res) => {
 *   res.locals = { headline: 'It work\'s' } // locals set in response
 *   res.render('home', { title: 'home' }) // render `home.hbs` template
 * })
 *
 * @example <caption>with ejs</caption>
 * import { Router, renderEngine } from 'veloze'
 * import consolidate from 'consolidate'
 * const ejsRouter = new Router()
 * // add the middleware as preHook for all routes defined in the latter
 * ejsRouter.preHook(renderEngine({
 *   ext: 'ejs',
 *   engine: consolidate.ejs,
 *   locals: { app: 'this app' }
 * }))
 * ejsRouter.get('/', (req, res) => {
 *   res.locals = { headline: 'It work\'s' }
 *   res.render('home', { title: 'home' })
 * })
 */
export function renderEngine(options) {
  const view = new View(options)
  return function _renderEngine(req, res, next) {
    res.locals = {}
    res.render = view.render.bind(view, res)
    res[RES_NEXT] = next
    next()
  }
}

export class View {
  #options

  /**
   * @param {ViewOptions} options
   */
  constructor(options) {
    let {
      ext,
      engine,
      views: _views = path.resolve(process.cwd(), '/views'),
      cache = isProdEnv,
      pathCache = isProdEnv ? new Map() : null,
      locals = {}
    } = options || {}

    log = log || logger(':renderEngine')

    const views = []
      // @ts-expect-error
      .concat(_views)
      // @ts-expect-error
      .map((view) => (view instanceof URL ? fileURLToPath(view) : view))

    if (ext[0] === '.') {
      ext = ext.slice(1)
    }

    // @ts-expect-error
    locals.settings = { views, ...locals.settings }
    this.#options = { ext, engine, views, cache, pathCache, locals }
  }

  async lookup(name) {
    const { views: viewDirs, ext } = this.#options

    log.debug('lookup "%s"', name)

    for (let i = 0; i < viewDirs.length; i++) {
      const root = viewDirs[i]

      // resolve the path
      const loc = path.resolve(root, name)
      const dir = path.dirname(loc)
      const file = path.basename(loc, `.${ext}`)
      const filename = await resolveFilename(dir, file, ext)
      if (filename) {
        return filename
      }
    }

    throw new Error(`template "${name}" not found under [${viewDirs}]`)
  }

  /**
   * @param {Response} res
   * @param {string} name view name
   * @param {object} [options] render options
   */
  async render(res, name, options) {
    try {
      const { pathCache, cache, locals, engine } = this.#options

      let filename
      if (pathCache) {
        filename = pathCache.get(name)
        if (!filename && !pathCache.has(name)) {
          filename = await this.lookup(name)
          // prime cache
          pathCache.set(name, filename)
        }
      } else {
        filename = await this.lookup(name)
      }

      const opts = Object.assign({}, locals, res.locals, options, {
        cache,
        filename
      })

      const body = await asyncEngineRender(engine, filename, opts)
      send(res, body)
    } catch (/** @type {Error|any} */ e) {
      const err = new HttpError(500, 'Template Error', e)
      res.setHeader(CONTENT_TYPE, MIME_HTML_UTF8)
      res.emit('error', err)
    }
  }
}

function asyncEngineRender(engine, filename, options) {
  return new Promise((resolve, reject) => {
    engine(filename, options, (err, rendered) =>
      err ? reject(err) : resolve(rendered)
    )
  })
}

/**
 * @param {string} dir
 * @param {string} file
 * @param {string} ext
 * @returns {Promise<string|undefined>}
 */
async function resolveFilename(dir, file, ext) {
  // <pathname>.<ext>
  let filename = path.join(dir, `${file}.${ext}`)
  let stat = await fsp.stat(filename).catch(() => {})

  if (stat && stat.isFile()) {
    return filename
  }

  // <path>/index.<ext>
  filename = path.join(dir, path.basename(file, ext), `index.${ext}`)
  stat = await fsp.stat(filename).catch(() => {})

  if (stat && stat.isFile()) {
    return filename
  }
}
