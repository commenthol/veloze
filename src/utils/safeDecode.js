import { logger } from './logger.js'

const log = logger(':safeDecode')

export const safeDecodeUriComponent = (value, def) => {
  try {
    return decodeURIComponent(value)
  } catch (e) {
    log.debug(`malformed URI Component: ${value}`)
  }
  return def
}
