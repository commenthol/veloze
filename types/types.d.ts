import * as http from 'node:http';
import { CookieOpts } from '#utils/cookie.js';
export { CookieOpts };
export { TooBusyOptions } from '#utils/tooBusy.js';
export { HeaderParserResult } from '#utils/headerParser.js';
export { BodyParserOptions } from '#middleware/bodyParser.js';
export { CacheControlDirectives } from '#middleware/cacheControl.js';
export { CspMiddlewareOptions, CspOptions, HstsOptions, ReferrerPolicy } from '#middleware/contentSec.js';
export { CorsOptions } from '#middleware/cors.js';
export { PresetOptions } from '#middleware/presets.js';
export { RetryAfterOption } from '#middleware/tooBusy.js';
export type Method = 'ALL' | 'ACL' | 'BIND' | 'CHECKOUT' | 'CONNECT' | 'COPY' | 'DELETE' | 'GET' | 'HEAD' | 'LINK' | 'LOCK' | 'M-SEARCH' | 'MERGE' | 'MKACTIVITY' | 'MKCALENDAR' | 'MKCOL' | 'MOVE' | 'NOTIFY' | 'OPTIONS' | 'PATCH' | 'POST' | 'PROPFIND' | 'PROPPATCH' | 'PURGE' | 'PUT' | 'REBIND' | 'REPORT' | 'SEARCH' | 'SOURCE' | 'SUBSCRIBE' | 'TRACE' | 'UNBIND' | 'UNLINK' | 'UNLOCK' | 'UNSUBSCRIBE';
export interface Request extends http.IncomingMessage {
    /**
     * url of the request
     */
    url: string;
    /**
     * original url of the request. `url` is rewritten if Router is mounted
     */
    originalUrl?: string;
    /**
     * params object from url parameters e.g. for route
     * `/authors/:author/books/:bookTitle` would return with url
     * `/authors/melville/books/moby-dick` the object
     * `{ author: 'melville', bookTitle: 'moby-dick' }`
     */
    params: Record<string, string> | {};
    /**
     * url path;
     * needs queryParser middleware
     */
    path?: string;
    /**
     * query parameters e.g. `?foo=bar&v=1` becomes `{ foo: 'bar', v: '1' }`;
     * needs queryParser middleware
     */
    query?: Record<string, string> | {};
    /**
     * parsed request body;
     * needs bodyParser middleware
     */
    body?: Record<string, any> | {} | Buffer;
    /**
     * parsed cookies;
     * needs cookieParser middleware
     */
    cookies?: Record<string, string> | {};
    /**
     * request id;
     * needs requestId middleware
     */
    id?: string;
}
export interface Response extends http.ServerResponse {
    /**
     * response body
     */
    body?: any;
    /**
     * send request;
     * needs send or sendEtag middleware
     */
    send?: (body: any, status?: number, headers?: object) => void;
    /**
     * redirect request;
     * needs send middleware
     */
    redirect?: (location: string, status?: number, headers?: object) => void;
    /**
     * send request;
     * needs json or jsonEtag middleware
     */
    json?: (body: any, status?: number, headers?: object) => void;
    /**
     * sets a response cookie;
     * needs cookieParser middleware
     */
    cookie?: (name: string, value: string | number | boolean, opts?: CookieOpts) => Response;
    /**
     * Clears the cookie specified by name;
     * needs cookieParser middleware
     */
    clearCookie?: (name: string, opts?: CookieOpts) => Response;
    /**
     * local template variables for res.render;
     * needs renderEngine middleware
     */
    locals?: Record<string, any>;
    /**
     * template render function;
     * needs renderEngine middleware
     */
    render?: (name: string, locals: Record<string, any>) => Promise<void>;
    /**
     * set flag for connect to indicate that response is ended by a streaming
     * pipeline. Causes connect to exit stack loop.
     */
    writablePiped?: boolean;
}
export declare function HandlerCb(req: Request, res: Response, next: Function): void;
export declare function HandlerAsync(req: Request, res: Response): Promise<void>;
export declare function ErrorHandler(err: Error, req: Request, res: Response, next: Function): void;
export declare function FinalHandler(err: Error, req: Request, res: Response): void;
export type Handler = typeof HandlerCb | typeof HandlerAsync | typeof ErrorHandler;
export interface HttpError extends Error {
    status: number;
}
export interface Log {
    debug: Function;
    info: Function;
    warn: Function;
    error: Function;
}
