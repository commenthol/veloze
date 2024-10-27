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
 * @param {import('#types.js').Response} res
 * @param {string} reqHeader request header name
 */
export function vary(res, reqHeader) {
  if (!RE_FIELD_NAME.test(reqHeader)) {
    throw new TypeError('vary value contains invalid characters')
  }
  const header = []
    // @ts-expect-error
    .concat(res.getHeader(VARY) || '', reqHeader)
    .filter(Boolean)
    .join(', ')
    .toLowerCase()
  const values = [...new Set(header.split(/,\s?/))]
  const newValue = values.includes('*') ? '*' : values.join(', ')
  res.setHeader(VARY, newValue)
}
