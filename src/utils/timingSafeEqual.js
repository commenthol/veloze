import { timingSafeEqual as cryptoTimingSafeEqual } from 'node:crypto'

/**
 * @param {string} a input; secret from others
 * @param {string} b secret for comparison
 */
export const timingSafeEqual = (a, b = '') => {
  if (!a || typeof a !== 'string' || typeof b !== 'string') {
    return false
  }

  try {
    return cryptoTimingSafeEqual(Buffer.from(a, 'utf8'), Buffer.from(b, 'utf8'))
  } catch {
    return false
  }
}
