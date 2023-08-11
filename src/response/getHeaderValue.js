/**
 * @param {import('../types').Response} res
 * @param {string} header
 * @returns {string|number|undefined}
 */
export const getHeaderValue = (res, header) => {
  const values = res.getHeader(header.toLowerCase())
  return Array.isArray(values) ? values[0] : values
}
