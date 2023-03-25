import { isHttpsProto } from '../request/isHttpsProto.js'
import { redirect } from '../response/redirect.js'

/**
 * @typedef {import('../types').HandlerCb} HandlerCb
 */

/**
 * A connect middleware to redirect from http to https
 * @param {object} options
 * @param {string} options.redirectUrl
 * @param {number} [options.status=308] redirect status code; defaults to 308
 * @param {string[]} [options.allowedHosts] list of allowed vhosts (Don't append any port info)
 * @returns {HandlerCb}
 */
export function redirect2Https (options) {
  const {
    redirectUrl,
    status = 308,
    allowedHosts
  } = options

  const parsed = new URL(redirectUrl)
  if (parsed.protocol !== 'https:') {
    throw new Error('redirectUrl needs to use https:// as protocol')
  }

  const host = parsed.host
  const port = parsed.port ? ':' + parsed.port : ''
  const pathname = fixPathname(parsed.pathname)

  return function redirect2Https (req, res, next) {
    const isHttps = isHttpsProto(req)

    if (isHttps) {
      next()
    } else {
      const reqUrl = fixPathname(req.originalUrl || req.url)
      const [hostHeader] = hostPort(req.headers?.host)
      const _host = allowedHosts?.length && hostHeader && allowedHosts.includes(hostHeader)
        ? hostHeader + port
        : host
      const location = `https://${_host}${pathname}${reqUrl}`
      redirect(res, location, status)
    }
  }
}

const fixPathname = (pathname) => pathname === '/' ? '' : pathname

const hostPort = (host = '') => ('' + host).split(':')
