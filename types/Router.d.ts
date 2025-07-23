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
    /**
     * @param {RouterOptions} [options]
     */
    constructor(options?: RouterOptions);
    /**
     * request handler
     * @param {Request} req
     * @param {Response} res
     * @param {Function} [next]
     */
    handle(req: Request, res: Response, next?: Function): void;
    /** @type {string} */
    mountPath: string;
    /**
     * print the routing-tree from FindRoute
     */
    print(): void;
    /**
     * add a pre-hook handler
     * @param {...(Handler|Handler[]|undefined)} handlers
     * @returns {this}
     */
    preHook(...handlers: (Handler | Handler[] | undefined)[]): this;
    /**
     * add a post-hook handler
     * @param {...(Handler|Handler[]|undefined)} handlers
     * @returns {this}
     */
    postHook(...handlers: (Handler | Handler[] | undefined)[]): this;
    /**
     * route by method(s) and path(s)
     * @param {Method|Method[]} methods
     * @param {string|string[]} paths
     * @param {...(Handler|Handler[]|undefined)} handlers
     * @returns {this}
     */
    method(methods: Method | Method[], paths: string | string[], ...handlers: (Handler | Handler[] | undefined)[]): this;
    /**
     * route all methods
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     * @returns {this}
     */
    all(path: string, ...handlers: (Handler | Handler[] | undefined)[]): this;
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
    use(path: string | string[] | Handler | Router, ...handlers: (Handler | Handler[] | undefined)[]): this;
    /**
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     */
    connect(path: string, ...handlers: (Handler | Handler[] | undefined)[]): void;
    /**
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     */
    delete(path: string, ...handlers: (Handler | Handler[] | undefined)[]): void;
    /**
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     */
    get(path: string, ...handlers: (Handler | Handler[] | undefined)[]): void;
    /**
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     */
    options(path: string, ...handlers: (Handler | Handler[] | undefined)[]): void;
    /**
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     */
    post(path: string, ...handlers: (Handler | Handler[] | undefined)[]): void;
    /**
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     */
    put(path: string, ...handlers: (Handler | Handler[] | undefined)[]): void;
    /**
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     */
    patch(path: string, ...handlers: (Handler | Handler[] | undefined)[]): void;
    /**
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     */
    search(path: string, ...handlers: (Handler | Handler[] | undefined)[]): void;
    /**
     * @param {string} path
     * @param {...(Handler|Handler[]|undefined)} handlers
     */
    trace(path: string, ...handlers: (Handler | Handler[] | undefined)[]): void;
    #private;
}
export type Method = import("./types.js").Method;
export type Handler = import("./types.js").Handler;
export type HandlerCb = typeof import("./types.js").HandlerCb;
export type FinalHandler = typeof import("./types.js").FinalHandler;
export type Request = import("./types.js").Request;
export type Response = import("./types.js").Response;
export type Logger = import("./types.js").Log;
export type Connect = (...handlers: (import("./connect.js").Handler | import("./connect.js").Handler[] | undefined)[]) => (req: import("./connect.js").Request, res: import("./connect.js").Response, done: Function) => void;
export type RouterOptions = {
    connect?: ((...handlers: (import("./connect.js").Handler | import("./connect.js").Handler[] | undefined)[]) => (req: import("./connect.js").Request, res: import("./connect.js").Response, done: Function) => void) | undefined;
    finalHandler?: typeof import("./types.js").FinalHandler | undefined;
    findRoute?: FindRoute | undefined;
    cacheSize?: number | undefined;
};
import { FindRoute } from './FindRoute.js';
