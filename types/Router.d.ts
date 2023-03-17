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
    /**
     * print the routing-tree from FindRoute
     */
    print(): void;
    /**
     * add a pre-hook handler
     * @param  {...Handler} handlers
     * @returns {this}
     */
    preHook(...handlers: Handler[]): this;
    /**
     * add a post-hook handler
     * @param  {...Handler} handlers
     * @returns {this}
     */
    postHook(...handlers: Handler[]): this;
    /**
     * route by method(s) and path(s)
     * @param {Method|Method[]} methods
     * @param {string|string[]} paths
     * @param  {...Handler} handlers
     * @returns {this}
     */
    method(methods: Method | Method[], paths: string | string[], ...handlers: Handler[]): this;
    /**
     * route all methods
     * @param {string} path
     * @param  {...Handler} handlers
     * @returns {this}
     */
    all(path: string, ...handlers: Handler[]): this;
    /**
     * mount router or add pre-hook handler
     *
     * `app.use(handler)` adds `handler` as pre-hook handler which is added to all following routes
     * `app.use('/path', handler)` mounts `handler` on `/path/*` for ALL methods
     *
     * @param {string|string[]|Handler} path
     * @param  {...Handler} handlers
     */
    use(path: string | string[] | Handler, ...handlers: Handler[]): Router;
    #private;
}
export type Method = import('../src/types').Method;
export type Handler = import('../src/types').Handler;
export type HandlerCb = typeof import("../src/types").HandlerCb;
export type FinalHandler = typeof import("../src/types").FinalHandler;
export type Request = import('../src/types').Request;
export type Response = import('../src/types').Response;
export type Connect = import('../src/types').Connect;
export type Logger = import('../src/types').Log;
export type RouterOptions = {
    connect?: import("../src/types").Connect | undefined;
    finalHandler?: typeof import("../src/types").FinalHandler | undefined;
    findRoute?: FindRoute | undefined;
};
import { FindRoute } from './FindRoute.js';
