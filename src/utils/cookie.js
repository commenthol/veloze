import { safeDecodeUriComponent } from './safeDecode.js'

/**
 * @typedef {object} CookieOpts
 * @property {string} [domain] Domain name for the cookie.
 * @property {Date} [expires] Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
 * @property {boolean} [httpOnly] Flags the cookie to be accessible only by the web server.
 * @property {number} [maxAge] Convenient option for setting the expiry time relative to the current time in milliseconds.
 * @property {string} [path] Path for the cookie. Defaults to "/".
 * @property {boolean} [secure] Marks the cookie to be used with HTTPS only.
 * @property {boolean|string|'Lax'|'Strict'|'None'} [sameSite] Value of the "SameSite" Set-Cookie attribute. More information at https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1
 */

/**
 * parses a cookie string
 * @param {string} cookieStr
 * @returns {Record<string, string>|{}}
 */
export function cookieParse (cookieStr = '') {
  const parts = cookieStr.split(';')
  const cookies = {}
  for (const part of parts) {
    const [key, val] = part.trim().split('=')
    if (key && typeof val === 'string') {
      const value = safeDecodeUriComponent(val)
      cookies[key] = value
    }
  }
  return cookies
}

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
// eslint-disable-next-line no-control-regex
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/

const isDate = d => !isNaN(new Date(d).getTime())

/**
 * serializes a cookie
 * @param {string} name
 * @param {any} value
 * @param {CookieOpts} [options]
 * @returns {string}
 */
export function cookieSerialize (name, value, options) {
  const {
    maxAge,
    domain,
    path,
    expires,
    httpOnly = true,
    secure = false,
    sameSite = 'Strict'
  } = options || {}

  if (!name || !fieldContentRegExp.test(name)) {
    throw TypeError('invalid name')
  }

  const parts = [`${name}=${encodeURIComponent(value)}`]

  if (maxAge && !isNaN(maxAge - 0) && isFinite(maxAge)) {
    parts.push(`Max-Age=${maxAge}`)
  }
  if (domain && fieldContentRegExp.test(domain)) {
    parts.push(`Domain=${domain}`)
  }
  if (path && fieldContentRegExp.test(path)) {
    parts.push(`Path=${path}`)
  }
  if (expires !== undefined && isDate(expires)) {
    parts.push(`Expires=${new Date(expires).toUTCString()}`)
  }
  if (httpOnly) {
    parts.push('HttpOnly')
  }
  if (secure) {
    parts.push('Secure')
  }
  if (sameSite) {
    parts.push(`SameSite=${sameSite}`)
  }
  return parts.join('; ')
}
