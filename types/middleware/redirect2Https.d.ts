/**
 * @typedef {import('../../src/types').HandlerCb} HandlerCb
 */
/**
 * A connect middleware to redirect from http to https
 * @param {object} options
 * @param {string} options.redirectUrl
 * @param {number} [options.status] redirect status code; defaults to 308
 * @returns {HandlerCb}
 */
export function redirect2Https(options: {
    redirectUrl: string;
    status?: number | undefined;
}): HandlerCb;
export type HandlerCb = typeof import("../../src/types").HandlerCb;
