/**
 * @typedef { import('../../src/types').Response } Response
 * @typedef { import('../../src/utils/cookie').CookieOpts } CookieOpts
 */
/**
 * set cookie on response
 * @param {Response} res
 * @param {string} name
 * @param {string|number|boolean} value
 * @param {CookieOpts} [opts]
 * @returns {Response}
 */
export function setCookie(res: Response, name: string, value: string | number | boolean, opts?: import("../utils/cookie.js").CookieOpts | undefined): Response;
/**
 * clear cookie on response
 * @param {Response} res
 * @param {string} name
 * @param {CookieOpts} [opts]
 * @returns {Response}
 */
export function clearCookie(res: Response, name: string, opts?: import("../utils/cookie.js").CookieOpts | undefined): Response;
export type Response = import('../../src/types').Response;
export type CookieOpts = import('../../src/utils/cookie').CookieOpts;
