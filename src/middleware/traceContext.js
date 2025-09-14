import { TraceParent } from '#utils/traceParent.js'
import { getHeader } from '#request/getHeader.js'

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
export function traceContext() {
  return function requestIdMw(req, _res, next) {
    // @ts-expect-error
    req.traceparent = TraceParent.parse(
      getHeader(req, 'traceparent') || ''
    ).update()
    next()
  }
}
