import { HttpError } from '../HttpError.js'
import { getHeader } from '../request/getHeader.js'
import { timingSafeEqual } from '../utils/index.js'

/**
 * @typedef {import('#types.js').Handler} Handler
 */

/**
 * @see https://datatracker.ietf.org/doc/html/rfc7617
 * @param {object} options
 * @param {Record<string, string>} options.users user-password records
 * @param {string} [options.realm='Secure']
 * @returns {Handler}
 */
export function basicAuth(options) {
  const { users, realm: _realm = 'Secure' } = options || {}

  if (!users || !Object.keys(users).length) {
    throw new Error('need at least one user')
  }

  const realm = _realm.replaceAll('"', '\\"')
  const setRealmHeader = (res) => {
    res.setHeader('www-authenticate', `Basic realm="${realm}", charset="UTF-8"`)
  }

  return function _basicAuth(req, res, next) {
    const authorization = getHeader(req, 'authorization') || ''

    if (!compareLc(authorization)) {
      setRealmHeader(res)
      next(new HttpError(401))
      return
    }

    const decoded = Buffer.from(authorization.slice(6), 'base64').toString(
      'utf-8'
    )
    const [username] = decoded.split(':', 1)
    const password = decoded.slice(username.length + 1)

    if (!timingSafeEqual(password, users[username])) {
      setRealmHeader(res)
      next(new HttpError(401))
      return
    }

    req.auth = { username }

    next()
  }
}

export const compareLc = (str = '', compare = 'basic ') => {
  const part = str.slice(0, compare.length)
  return part.toLowerCase() === compare
}
