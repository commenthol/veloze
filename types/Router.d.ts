/**
 * @typedef {import('./types').Method} Method
 * @typedef {import('./types').Handler} Handler
 * @typedef {import('./types').HandlerCb} HandlerCb
 * @typedef {import('./types').FinalHandler} FinalHandler
 * @typedef {import('./types').Request} Request
 * @typedef {import('./types').Response} Response
 * @typedef {import('./connect').connect} Connect
 * @typedef {import('./types').Log} Logger
 *
 * @typedef {object} RouterOptions
 * @property {Connect} [connect]
 * @property {FinalHandler} [finalHandler]
 * @property {FindRoute} [findRoute]
 */
/**
 * Router
 */
export class Router {
    /**
     * @param {RouterOptions} [options]
     */
    constructor(options?: RouterOptions | undefined);
    /**
     * request handler
     * @param {Request} req
     * @param {Response} res
     * @param {Function} [next]
     */
    handle(req: Request, res: Response, next?: Function | undefined): void;
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
     * @param {string|string[]|Handler} path
     * @param  {...(Handler|Handler[]|undefined)} handlers
     */
    use(path: string | string[] | Handler, ...handlers: (Handler | Handler[] | undefined)[]): Router;
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
export type Method = import('./types').Method;
export type Handler = import('./types').Handler;
export type HandlerCb = typeof import("./types").HandlerCb;
export type FinalHandler = typeof import("./types").FinalHandler;
export type Request = import('./types').Request;
export type Response = import('./types').Response;
export type Connect = (...handlers: (import("./types").Handler | import("./types").Handler[] | undefined)[]) => (req: import("./types").Request, res: import("./types").Response, done: Function) => void;
export type Logger = import('./types').Log;
export type RouterOptions = {
    connect?: ((...handlers: (import("./types").Handler | import("./types").Handler[] | undefined)[]) => (req: import("./types").Request, res: import("./types").Response, done: Function) => void) | undefined;
    finalHandler?: typeof import("./types").FinalHandler | undefined;
    findRoute?: FindRoute | undefined;
};
import { FindRoute } from './FindRoute.js';
