/**
 * @typedef {import('../types.js').HandlerCb} HandlerCb
 */
/**
 * Middleware which sets a random request id;
 * Overwrites or sets `req.headers['x-request-id']`;
 *
 * @see https://www.w3.org/TR/trace-context
 * @returns {HandlerCb}
 */
export function traceContext(): HandlerCb;
export type HandlerCb = typeof import("../types.js").HandlerCb;
