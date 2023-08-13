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
export function renderEngine(options: ViewOptions): HandlerCb;
export class View {
    /**
     * @param {ViewOptions} options
     */
    constructor(options: ViewOptions);
    lookup(name: any): Promise<string>;
    /**
     * @param {Response} res
     * @param {string} name view name
     * @param {object} [options] render options
     */
    render(res: Response, name: string, options?: object): Promise<void>;
    #private;
}
export type HandlerCb = typeof import("../types").HandlerCb;
export type Response = import('../types').Response;
/**
 * the engine extension e.g. `html`, `hbs`, `ejs`
 */
export type EngineExtension = string;
/**
 * engine compliant with [consolidate](https://www.npmjs.com/package/consolidate)
 */
export type Engine = object;
export type ViewOptions = {
    /**
     * The default engine extension to use when omitted.
     */
    ext: EngineExtension;
    /**
     * Record of engines for rendering
     */
    engine: Engine;
    /**
     * Root path(s) for views; defaults to `process.cwd() + '/views`
     */
    views?: string | string[] | undefined;
    /**
     * default locals for the later template
     */
    locals: Record<string, any> | {};
    /**
     * if `true` use template cache provided by template `engine`. Defaults to `true` for `process.env_NODE_ENV='production'`
     */
    cache?: boolean | undefined;
    /**
     * cache implementation for storing pathnames (must implement Map interface); If `null` no cache is used. Defaults to `null` for development and `Map()` for production environments
     */
    pathCache?: Map<any, any> | null | undefined;
};
