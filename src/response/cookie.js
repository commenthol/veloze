import { COOKIE_OPTS_SECURE } from '../middleware/cookieParser.js'
import { cookieSerialize } from '../utils/cookie.js'

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
export function setCookie (res, name, value, opts = {}) {
  const _opts = {
    path: '/',
    sameSite: 'Lax',
    secure: !!res[COOKIE_OPTS_SECURE],
    ...opts
  }

  if (typeof _opts.maxAge === 'number') {
    _opts.expires = new Date(Date.now() + _opts.maxAge)
    _opts.maxAge = Math.floor(_opts.maxAge / 1000)
  }

  const cookie = cookieSerialize(name, String(value), _opts)
  // @ts-expect-error
  res.appendHeader('set-cookie', cookie)

  return res
}

/**
 * clear cookie on response
 * @param {Response} res
 * @param {string} name
 * @param {CookieOpts} [opts]
 * @returns {Response}
 */
export function clearCookie (res, name, opts) {
  // eslint-disable-next-line no-unused-vars
  const { maxAge, ..._opts } = opts || {}
  return setCookie(res, name, '', {
    path: '/',
    ..._opts,
    expires: new Date(0)
  })
}
