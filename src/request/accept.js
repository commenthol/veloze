/**
 * @note accept-charset header is deprecated; simply use utf-8; always;
 * therefor it is not included here
 */

import { headerParser } from '../utils/headerParser.js'
import { getHeader } from './getHeader.js'

/**
 * @typedef {import('../../src/types').Request} Request
 * @typedef {import('../../src/utils/headerParser').HeaderParserResult} HeaderParserResult
 */

/**
 * @private
 * @param {string} header
 * @param {(value: string) => string|string[]|undefined} [fn]
 * @returns {(req: Request, weight?: boolean) => HeaderParserResult[]}
 */
const _accept = (header, fn) => (req, weight = false) => {
  const value = getHeader(req, header)
  return headerParser(value, { fn, weight })
}

/**
 * Parses the request header 'accept'
 * @param {Request} req request
 * @param {boolean} [weight=false] returns weight information
 * @returns {HeaderParserResult[]} list of mime types
 */
export const accept = _accept('accept')

/**
 * Parses the request header 'accept-encoding'
 * @param {Request} req request
 * @param {boolean} [weight=false] returns weight information
 * @returns {HeaderParserResult[]} list of mime types
 */
export const acceptEncoding = _accept('accept-encoding')

const addMainLang = (value) => {
  if (!/^[a-z]{2}/.test(value)) {
    return
  }
  const [main] = value.split('-')
  return [value, main]
}

/**
 * Parses the request header 'accept-language'
 * @param {Request} req request
 * @param {boolean} [weight=false] returns weight information
 * @returns {HeaderParserResult[]} list of languages
 */
export const acceptLanguage = _accept('accept-language', addMainLang)
