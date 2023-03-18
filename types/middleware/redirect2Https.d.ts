/**
 * @typedef {import('../../src/types').HandlerCb} HandlerCb
 */
/**
 * A connect middleware to redirect from http to https
 * @param {object} options
 * @param {string} options.redirectUrl
 * @param {number} [options.status=308] redirect status code; defaults to 308
 * @param {string[]} [options.allowedHosts] list of allowed vhosts (Don't append any port info)
 * @returns {HandlerCb}
 */
export function redirect2Https(options: {
    redirectUrl: string;
    status?: number | undefined;
    allowedHosts?: string[] | undefined;
}): HandlerCb;
export type HandlerCb = typeof import("../../src/types").HandlerCb;
