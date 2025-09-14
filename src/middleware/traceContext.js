import { TraceParent } from '#utils/traceParent.js'
import { getHeader } from '#request/getHeader.js'

/**
 * @typedef {import('../types.js').HandlerCb} HandlerCb
 */

/**
 * Middleware which sets a parsed or fresh request traceparent
 * @see https://www.w3.org/TR/trace-context
 * @returns {HandlerCb}
 */
export function traceContext() {
  return function traceContextMw(req, res, next) {
    // @ts-expect-error
    req.traceparent = TraceParent.parse(
      getHeader(req, 'traceparent') || ''
    ).addResponse(res)
    next()
  }
}
