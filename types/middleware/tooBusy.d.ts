/**
 * @typedef {import('../types').HandlerCb} HandlerCb
 * @typedef {import('../types').TooBusyOptions} TooBusyOptions
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
export function tooBusy(options?: (import("../types").TooBusyOptions & RetryAfterOption) | undefined): HandlerCb;
export type HandlerCb = typeof import("../types").HandlerCb;
export type TooBusyOptions = import('../types').TooBusyOptions;
export type RetryAfterOption = {
    /**
     * if server is busy set retry-after header to `retryAfter seconds`. If number, value is seconds.
     */
    retryAfter?: string | number | undefined;
};
