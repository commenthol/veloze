import { cookieParse } from '../utils/cookie.js'
import { setCookie, clearCookie } from '../response/cookie.js'
import { isHttpsProto } from '../request/isHttpsProto.js'

/**
 * @typedef { import('../../src/types').Request } Request
 * @typedef { import('../../src/types').Response } Response
 */

export const COOKIE_OPTS_SECURE = Symbol('kCookieOptsSecure')

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
export function cookieParser (req, res, next) {
  const cookie = req.headers?.cookie
  req.cookies = typeof cookie === 'string'
    ? cookieParse(cookie)
    : {}
  res[COOKIE_OPTS_SECURE] = isHttpsProto(req)
  res.cookie = setCookie.bind(null, res)
  res.clearCookie = clearCookie.bind(null, res)
  next()
}
