import { HttpError } from '../HttpError.js'
import { bytes, qs } from '../utils/index.js'
import { logger } from '../utils/logger.js'
import {
  CONTENT_LENGTH,
  CONTENT_TYPE,
  MIME_JSON,
  MIME_FORM,
  MIME_BIN
} from '../constants.js'

/**
 * @typedef {import('../types.js').HandlerCb} HandlerCb
 * @typedef {import('../types.js').Log} Log
 *
 * @typedef {object} BodyParserOptions
 * @property {string|number} [limit='100kB']
 * @property {string[]} [methods=['POST', 'PUT', 'PATCH', 'SEARCH']] allowed methods for bodyParsing
 * @property {string|false} [typeJson='application/json'] parse json content
 * @property {string|false} [typeUrlEncoded='application/x-www-form-urlencoded'] parse urlEncoded content
 * @property {string|false} [typeRaw='application/octet-stream'] parse raw content
 */

const log = logger(':bodyParser')

/**
 * body parser for json, urlEncoded form or raw
 *
 * The default parses to `req.body` according to the content-type header of the
 * request. If only a dedicated parser shall be used consider the
 * `bodyParser.json()`, `bodyParser.urlEncoded()` or `bodyParser.raw()` methods.
 *
 * If `req.body` was already parsed in a previous middleware parsing is skipped.
 *
 * @param {BodyParserOptions} [options]
 * @returns {HandlerCb}
 */
export const bodyParser = (options) => {
  const {
    limit: _limit,
    methods = ['POST', 'PUT', 'PATCH', 'SEARCH'],
    typeJson = MIME_JSON,
    typeUrlEncoded = MIME_FORM,
    typeRaw = MIME_BIN
  } = options || {}
  const limit = bytes(_limit || '100kB') || 102400
  log.debug(`limit is set to ${limit} bytes`)

  return function bodyParserMw(req, res, next) {
    // @ts-expect-error
    if (!methods.includes(req.method) || req.body) {
      next()
      return
    }

    let body = Buffer.alloc(0)

    const contentLength =
      req.headers[CONTENT_LENGTH] === undefined
        ? NaN
        : parseInt(req.headers[CONTENT_LENGTH], 10)

    if (contentLength > limit) {
      next(new HttpError(413, `upload limit of ${limit} bytes`))
      return
    }

    req.on('data', onData)
    req.on('end', onEnd)
    req.on('error', onEnd)

    function removeListeners() {
      req.removeListener('data', onData)
      req.removeListener('end', onEnd)
      req.removeListener('error', onEnd)
    }
    function onData(chunk) {
      if ((body.length || chunk.length) < limit) {
        body = Buffer.concat([body, chunk])
      } else {
        /* c8 ignore next 3 */
        removeListeners()
        next(new HttpError(413, 'upload limit'))
      }
    }
    function onEnd(err) {
      removeListeners()
      /* c8 ignore next 4 */
      if (err) {
        next(new HttpError(400, '', err))
        return
      }

      const [contentType] = (req.headers[CONTENT_TYPE] || '').split(';')

      if (typeJson && contentType === typeJson) {
        try {
          req.body = JSON.parse(body.toString())
        } catch (/** @type {Error|any} */ e) {
          err = new HttpError(400, 'json parse error', e)
        }
      } else if (typeUrlEncoded && contentType === typeUrlEncoded) {
        try {
          req.body = qs(body.toString())
        } catch (/** @type {Error|any} */ e) {
          /* c8 ignore next 2 */
          err = new HttpError(400, 'urlencoded parse error', e)
        }
      } else if (typeRaw && contentType === typeRaw) {
        req.body = body
      }

      next(err)
    }
  }
}

/**
 * JSON parser
 * `req.body instanceof Object`
 * @param {BodyParserOptions} options
 * @returns {HandlerCb}
 */
bodyParser.json = (options = {}) =>
  bodyParser({ ...options, typeUrlEncoded: false, typeRaw: false })

/**
 * UrlEncoded Form parser
 * `req.body instanceof Object`
 * @param {BodyParserOptions} options
 * @returns {HandlerCb}
 */
bodyParser.urlEncoded = (options = {}) =>
  bodyParser({ ...options, typeJson: false, typeRaw: false })

/**
 * Raw Parser
 * `req.body instanceof Buffer`
 * @param {BodyParserOptions} options
 * @returns {HandlerCb}
 */
bodyParser.raw = (options = {}) =>
  bodyParser({ ...options, typeJson: false, typeUrlEncoded: false })
