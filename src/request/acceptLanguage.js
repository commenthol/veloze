import { headerParser } from '../utils/headerParser.js'

/**
 * @typedef {import('../../src/types').Request} Request
 */

/**
 * Parses the request header 'accept-language'
 * @param {Request} req
 * @returns {string[]} list of languages
 */
export function acceptLanguage (req) {
  const value = req.headers['accept-language']
  // @ts-expect-error
  return headerParser(value, { fn: addMainLang, noWeight: true })
}

const addMainLang = (value) => {
  if (!/^[a-z]{2}/.test(value)) {
    return
  }
  const [main] = value.split('-')
  return [value, main]
}
