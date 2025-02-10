import { logger } from './logger.js'

const log = logger(':safeDecode')

/**
 * @param {string} str
 * @param {string} [def]
 * @returns {string|undefined}
 */
export const safeDecodeUriComponent = (str, def) => {
  try {
    return decodeURIComponent(str)
  } catch (e) {
    log.debug(`malformed URI Component: ${str}`)
  }
  return def
}
