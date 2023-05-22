import { logger } from './logger.js'

let log

/**
 * @param {string} str
 * @param {string} [def]
 * @returns {string|undefined}
 */
export const safeDecodeUriComponent = (str, def) => {
  try {
    return decodeURIComponent(str)
  } catch (e) {
    log = log || logger(':safeDecode')
    log.debug(`malformed URI Component: ${str}`)
  }
  return def
}
