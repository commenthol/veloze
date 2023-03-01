const VARY = 'vary'

/**
 * RegExp to match field-name in RFC 7230 sec 3.2
 *
 * field-name    = token
 * token         = 1*tchar
 * tchar         = "!" / "#" / "$" / "%" / "&" / "'" / "*"
 *               / "+" / "-" / "." / "^" / "_" / "`" / "|" / "~"
 *               / DIGIT / ALPHA
 *               ; any VCHAR, except delimiters
 */
const RE_FIELD_NAME = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/

/**
 * Sets vary header on response
 *
 * @throws {TypeError}
 * @param {import("../types").Response} res
 * @param {string} value
 */
export function vary (res, value) {
  if (!RE_FIELD_NAME.test(value)) {
    throw new TypeError('vary value contains invalid characters')
  }
  // @ts-expect-error
  const header = [].concat(res.getHeader(VARY) || '', value)
    .filter(Boolean).join(', ').toLowerCase()
  const values = [...new Set(header.split(/\s*,\s*/))]
  const newValue = values.includes('*') ? '*' : values.join(', ')
  res.setHeader(VARY, newValue)
}
