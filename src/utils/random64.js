// only needed on node
import { webcrypto as crypto } from 'node:crypto'

export const DIGITS = '0123456789'
export const HEX = DIGITS + 'abcdef'
export const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
export const UPPERCASE = LOWERCASE.toUpperCase()
export const DASHES = '_-'

const ALPHABET = DIGITS + LOWERCASE

/**
 * generate a random string composed of `alphabet` chars; default [0-9a-z]
 * @param {number} [length=20] of string
 * @param {string} [alphabet] allowed characters
 * @returns {string}
 */
export const nanoid = (length = 20, alphabet = ALPHABET) => {
  const rand = crypto.getRandomValues(new Uint8Array(length))
  let str = ''
  for (let i = 0; i < length; i += 1) {
    str += alphabet[rand[i] % alphabet.length]
  }
  return str
}

/**
 * generate a random string composed of chars [0-9a-zA-Z_-]
 * with length = 21 same entropy as with uuid can be achieved
 * (random64) 64^21 > (uuid4) 16^31
 * @param {number} [length=21] of string
 * @param {boolean} [noDashes] only use chars [0-9a-zA-Z]
 * @returns {string}
 */
export const random64 = (length = 21, noDashes = false) => {
  return nanoid(
    length,
    noDashes ? ALPHABET + UPPERCASE : ALPHABET + UPPERCASE + DASHES
  )
}
