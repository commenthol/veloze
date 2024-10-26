/**
 * @typedef {import('#types.js').Request} Request
 */

/**
 * get (first) request header
 * @param {Request} req
 * @param {string} header
 */
export function getHeader (req, header = '') {
  const values = req.headers[header.toLowerCase()]
  const first = Array.isArray(values) ? values[0] : values
  return first
}
