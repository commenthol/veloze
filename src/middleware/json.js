import { createHash } from 'node:crypto'
import { json as resJson } from '../response/index.js'
import { RES_ETAG } from '../constants.js'

export { RES_ETAG }

/**
 * @typedef {import('../types.js').HandlerCb} HandlerCb
 * @typedef {import('../types.js').Response} Response
 * @typedef { import('../types.js').Request } Request
 */

/**
 * connect middleware which adds `res.json` to the response.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function json(req, res, next) {
  res.json = resJson.bind(null, res)
  next()
}

export const etagHash = (chunk = '', algorithm = 'sha1') =>
  '"' + createHash(algorithm).update(chunk).digest('base64') + '"'

/**
 * `res.json` with ETag header generation.
 *
 * @param {object} [options]
 * @param {string} [options.algorithm='sha1']
 * @returns {HandlerCb}
 */
export function jsonEtag(options) {
  const { algorithm = 'sha1' } = options || {}

  const calcEtag = (req, res, chunk) => {
    if (res.statusCode > 201 || ['DELETE'].includes(req.method || '')) {
      return
    }

    const etag = etagHash(chunk, algorithm)
    res.setHeader('etag', etag)

    if (req.headers['if-none-match'] === etag) {
      res.statusCode = 304
    }
  }

  return function jsonEtagMw(req, res, next) {
    res.json = resJson.bind(null, res)
    res[RES_ETAG] = calcEtag.bind(null, req, res)
    next()
  }
}
