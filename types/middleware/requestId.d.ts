/**
 * @typedef {import('#types.js').HandlerCb} HandlerCb
 */
/**
 * @typedef {object} RequestIdOptions
 * @property {boolean} [force] forces setting the requestId on the request
 * @property {boolean} [setResponseHeader] set on response header
 */
/**
 * Middleware which sets a random request id;
 * Overwrites or sets `req.headers['x-request-id']`;
 *
 * @param {RequestIdOptions} [options]
 * @returns {HandlerCb}
 */
export function requestId(options?: RequestIdOptions | undefined): HandlerCb;
export type HandlerCb = typeof import("#types.js").HandlerCb;
export type RequestIdOptions = {
    /**
     * forces setting the requestId on the request
     */
    force?: boolean | undefined;
    /**
     * set on response header
     */
    setResponseHeader?: boolean | undefined;
};
