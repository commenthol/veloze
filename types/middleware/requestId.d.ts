/**
 * @typedef {import('../../src/types').HandlerCb} HandlerCb
 */
/**
 * Middleware which sets a request id;
 * Overwrites or sets `req.headers['x-request-id']`;
 *
 * @param {object} [options]
 * @param {boolean} [options.force] forces setting the requestId on the request
 * @returns {HandlerCb}
 */
export function requestId(options?: {
    force?: boolean | undefined;
} | undefined): HandlerCb;
export type HandlerCb = typeof import("../../src/types").HandlerCb;
