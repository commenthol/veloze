/** @typedef {import('#types.js').Request} Request */

const X_FORWARDED_PROTO = 'x-forwarded-proto'
const HTTPS_PROTO = 'https'

/**
 * Verify if request was made using TLS
 *
 * If application itself is running as https server or if running behind a
 * proxy, where `x-forwarded-proto` header was set to `https` returns `true`.
 *
 * If behind a proxy ensure that the proxy sets the `x-forwarded-proto` header
 * to `https`
 *
 * @param {Request} req
 * @returns {boolean}
 */
export const isHttpsProto = (req) =>
  // @ts-expect-error
  req.socket?.encrypted || req.headers?.[X_FORWARDED_PROTO] === HTTPS_PROTO
// HTTP/2 req.httpVersion[0] === '2' uses
// req.headers[':scheme'] === HTTPS_PROTO
// but req.socket.encrypted is true
