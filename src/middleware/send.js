import { createHash } from 'node:crypto'
import { send as resSend } from '../response/index.js'
import { RES_ETAG } from '../constants.js'

/**
 * @typedef {import('../types').HandlerCb} HandlerCb
 * @typedef {import('../types').Response} Response
 * @typedef { import('../types').Request } Request
 */

/**
 * connect middleware which adds `res.send` to the response.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function send (req, res, next) {
  res.send = resSend.bind(null, res)
  next()
}

/**
 * `res.send` with ETag header generation.
 * @param {object} [options]
 * @param {string} [options.algorithm='sha1']
 * @returns {HandlerCb}
 */
export function sendEtag (options) {
  const {
    algorithm = 'sha1'
  } = options || {}

  const hash = (chunk = '') => createHash(algorithm).update(chunk).digest('base64')

  const calcEtag = (req, res, chunk) => {
    const etag = '"' + hash(chunk) + '"'
    if (res.statusCode === 200 && req.headers['if-none-match'] === etag) {
      res.statusCode = 304
    }
    res.setHeader('etag', etag)
  }

  return function sendEtagMw (req, res, next) {
    res.send = resSend.bind(null, res)
    if (['GET', 'HEAD'].includes(req.method || '')) {
      res[RES_ETAG] = calcEtag.bind(null, req, res)
    }
    next()
  }
}
