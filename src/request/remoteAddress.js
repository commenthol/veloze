import { getHeader } from './getHeader.js'
import { oneOf, stringFormatT } from '@veloze/validate'

/** @typedef {import('#types.js').Request} Request */

const X_FORWARDED_FOR = 'x-forwarded-for'

const schemaIp = oneOf([stringFormatT().ipv6(), stringFormatT().ipv4()])

/**
 * Obtain the remote address of the connection
 *
 * If application itself is running behind a proxy, where `x-forwarded-for`
 * header was set, use `isBehindProxy=true`.
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

  const isValid = schemaIp.validate(remoteAddress)
  return isValid ? remoteAddress : req.socket.remoteAddress
}
