import { logger } from './logger.js'

let log

export const safeDecodeUriComponent = (value, def) => {
  try {
    return decodeURIComponent(value)
  } catch (e) {
    log = log || logger(':safeDecode')
    log.debug(`malformed URI Component: ${value}`)
  }
  return def
}
