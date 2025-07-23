/**
 * @typedef {import('../types.js').Response} Response
 */
/**
 * Set (multiple) headers on response
 *
 * if header value is set to `false` header is removed.
 *
 * @param {Response} res
 * @param {Record<string, string|number|boolean>|{}} [headers]
 *
 * @example
 * async (req, res) => {
 *  setHeader(res, {
 *    'content-type': 'text/html; charset=utf-8',
 *    'content-security-policy': "default-src 'self'"
 *  })
 * }
 */
export function setHeaders(res, headers) {
  for (const [name, value] of Object.entries(headers || {})) {
    if (value === false) {
      res.removeHeader(name)
    } else {
      res.setHeader(name, '' + value)
    }
  }
}
