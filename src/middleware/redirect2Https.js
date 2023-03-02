import { isHttpsProto } from '../request/isHttpsProto.js'
import { redirect } from '../response/redirect.js'

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
export function redirect2Https (options) {
  const {
    redirectUrl,
    status = 308
  } = options

  const parsed = new URL(redirectUrl)
  if (parsed.protocol !== 'https:') {
    throw new Error('redirectUrl needs to use https:// as protocol')
  }

  const host = parsed.host
  const pathname = fixPathname(parsed.pathname)

  return function redirect2Https (req, res, next) {
    const isHttps = isHttpsProto(req)

    if (isHttps) {
      next()
    } else {
      const reqUrl = fixPathname(req.originalUrl || req.url)
      const location = `https://${host}${pathname}${reqUrl}`
      redirect(res, location, status)
    }
  }
}

const fixPathname = (pathname) => pathname === '/' ? '' : pathname