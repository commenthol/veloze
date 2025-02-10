/**
 * @typedef { import('#types.js').Response } Response
 * @typedef { import('#utils/cookie.js').CookieOpts } CookieOpts
 */
/**
 * set cookie on response
 * @param {Response} res
 * @param {string} name
 * @param {string|number|boolean} value
 * @param {CookieOpts} [opts]
 * @returns {Response}
 */
export function setCookie(res: Response, name: string, value: string | number | boolean, opts?: CookieOpts): Response;
/**
 * clear cookie on response
 * @param {Response} res
 * @param {string} name
 * @param {CookieOpts} [opts]
 * @returns {Response}
 */
export function clearCookie(res: Response, name: string, opts?: CookieOpts): Response;
export type Response = import("#types.js").Response;
export type CookieOpts = import("#utils/cookie.js").CookieOpts;
