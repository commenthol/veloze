import { getHeader } from './getHeader.js'

/** @typedef {import('#types.js').Request} Request */

const X_FORWARDED_FOR = 'x-forwarded-for'

/**
 * Obtain the remote address of the connection
 *
 * If application itself is running behind a proxy, where `x-forwarded-for`
 * header was set, use `isBehindProxy=true`.
 *
 * The function does NOT check if the remote-address is a valid ipv6 or ipv4.
 *
 * @param {Request} req
 * @param {boolean} [isBehindProxy=false]
 * @returns {string|undefined}
 */
export const remoteAddress = (req, isBehindProxy = false) => {
  if (!isBehindProxy) {
    return req.socket.remoteAddress
  }
  const xForwardedFor = getHeader(req, X_FORWARDED_FOR) || ''
  const remoteAddress = (
    (/^[^,]{7,45}/.exec(xForwardedFor) || [])[0] || ''
  ).trim()
  return remoteAddress || req.socket.remoteAddress
}
