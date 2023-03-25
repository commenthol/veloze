/**
 * Cookie-parser middleware which adds `req.cookies` as object to Request
 *
 * If `res.headers.['x-forwarded-proto'] === 'https'` then secure flag will be
 * set with `res.cookie()`
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 *
 * @example
 * ```js
 * connect(cookieParser, (req, res) => {
 *  // get parsed cookies
 *  console.log(req.cookies)
 *  // set cookie in response (uses `setCookie()`)
 *  res.cookie('name', 'value', { maxAge: 3600 })
 *  // clear cookie if exists (uses `clearCookie()`)
 *  if (req.cookies.reset) {
 *    res.clearCookie('reset')
 *  }
 * })
 * ```
 */
export function cookieParser(req: Request, res: Response, next: Function): void;
/**
 * @typedef { import('../types').Request } Request
 * @typedef { import('../types').Response } Response
 */
export const COOKIE_OPTS_SECURE: unique symbol;
export type Request = import('../types').Request;
export type Response = import('../types').Response;
