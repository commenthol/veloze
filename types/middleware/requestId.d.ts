/**
 * @typedef {import('../types').HandlerCb} HandlerCb
 */
/**
 * Middleware which sets a random request id;
 * Overwrites or sets `req.headers['x-request-id']`;
 *
 * @param {object} [options]
 * @param {boolean} [options.force] forces setting the requestId on the request
 * @param {boolean} [options.setResponseHeader] set on response header
 * @returns {HandlerCb}
 */
export function requestId(options?: {
    force?: boolean | undefined;
    setResponseHeader?: boolean | undefined;
} | undefined): HandlerCb;
export type HandlerCb = typeof import("../types").HandlerCb;
