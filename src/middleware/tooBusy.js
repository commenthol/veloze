import { tooBusy as tooBusyCheck, ms } from '../utils/index.js'
import { HttpError } from '../HttpError.js'

/**
 * @typedef {import('../types.js').HandlerCb} HandlerCb
 * @typedef {import('../types.js').TooBusyOptions} TooBusyOptions
 *
 * @typedef {object} RetryAfterOption
 * @property {number|string} [retryAfter] if server is busy set retry-after header to `retryAfter seconds`. If number, value is seconds.
 */

/**
 * Connect middleware which checks if server is too busy.
 *
 * In case that the event-loop lags behind the defined maxLag, incoming requests
 * are rejected with a 429 Too Many Requests
 *
 * @param {TooBusyOptions & RetryAfterOption} [options]
 * @returns {HandlerCb}
 */
export function tooBusy(options) {
  tooBusyCheck.set(options)
  const retryAfter = ms(options?.retryAfter || '15s', true)

  return function tooBusyMw(req, res, next) {
    if (tooBusyCheck()) {
      // @ts-expect-error
      res.setHeader('retry-after', retryAfter)
      next(new HttpError(429, 'Server Too Busy'))
      return
    }
    next()
  }
}
