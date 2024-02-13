import { getHeader } from './getHeader.js'

/** @typedef {import('../types').Request} Request */

const X_FORWARDED_FOR = 'x-forwarded-for'

/**
 * Obtain the remote address of the connection
 *
 * If application itself is running behind a
 * proxy, where `x-forwarded-for` header was set, use `isBehindProxy=true`.
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
  const [remoteAddress] = xForwardedFor.split(/\s*,\s*/)
  return remoteAddress || req.socket.remoteAddress
}
