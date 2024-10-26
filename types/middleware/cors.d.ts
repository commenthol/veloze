/**
 * Middleware to handle [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
 * preflight and CORS response headers for different origins.
 *
 * @param {CorsOptions} options
 * @returns {HandlerCb}
 */
export function cors(options?: CorsOptions): HandlerCb;
export type Request = import("#types.js").Request;
export type Response = import("#types.js").Response;
export type HandlerCb = typeof import("#types.js").HandlerCb;
export type Origin = (string | RegExp | ((req: Request) => boolean));
export type CorsOptions = {
    /**
     * if `true` next middleware is called instead of responding the request
     */
    preflightContinue?: boolean | undefined;
    /**
     * list of allowed origins
     */
    origin?: Origin | Origin[] | undefined;
    /**
     * comma separated list of allowed methods
     */
    methods?: string | undefined;
    /**
     * if `true` allow requests to send cookies, authorization headers, or TLS client certificates
     */
    credentials?: boolean | undefined;
    /**
     * list any number of allowed headers, separated by commas
     */
    headers?: string | undefined;
    /**
     * list of comma-separated header names that clients are allowed to access from a response.
     */
    exposeHeaders?: string | undefined;
    /**
     * caching max-age in seconds. Is set to 7200 (2h) for NODE_ENV !== development
     */
    maxAge?: number | undefined;
};
