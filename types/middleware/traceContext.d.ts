/**
 * @typedef {import('../types.js').HandlerCb} HandlerCb
 */
/**
 * Middleware which sets a parsed or fresh request traceparent
 * @see https://www.w3.org/TR/trace-context
 * @returns {HandlerCb}
 */
export function traceContext(): HandlerCb;
export type HandlerCb = typeof import("../types.js").HandlerCb;
