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
 * @property {number} [timeout=30000] timeout in ms for receiving the body
 * @property {string[]} [methods=['POST', 'PUT', 'PATCH', 'SEARCH']] allowed methods for bodyParsing
 * @property {string|false} [typeJson='application/json'] parse json content
 * @property {string|false} [typeUrlEncoded='application/x-www-form-urlencoded'] parse urlEncoded content
 * @property {string|false} [typeRaw='application/octet-stream'] parse raw content
 * @property {number} [heapPercentThreshold=90] memory heap usage percent threshold to trigger error
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
    typeRaw = MIME_BIN,
    timeout = 30000
  } = options || {}
  const limit = bytes(_limit || '100kB') || 102400
  log.debug(`limit is set to ${limit} bytes`)

  function hasMemoryPressure() {
    const usage = process.memoryUsage()
    return usage.heapUsed / usage.heapTotal > 0.95
  }

  return function bodyParserMw(req, _res, next) {
    // @ts-expect-error
    if (!methods.includes(req.method) || req.body) {
      next()
      return
    }

    const chunks = []
    let receivedBytes = 0
    let timeoutId

    const contentLength =
      req.headers[CONTENT_LENGTH] === undefined
        ? NaN
        : parseInt('' + req.headers[CONTENT_LENGTH], 10)

    if (contentLength > limit) {
      next(new HttpError(413, `upload limit of ${limit} bytes`))
      return
    }

    // prevent slow client attacks
    if (timeout > 0) {
      timeoutId = setTimeout(() => {
        removeListeners()
        req.destroy()
        next(new HttpError(408, 'Request timeout'))
      }, timeout)
    }

    req.on('data', onData)
    req.on('end', onEnd)
    req.on('error', onEnd)

    function removeListeners() {
      clearTimeout(timeoutId)
      req.removeListener('data', onData)
      req.removeListener('end', onEnd)
      req.removeListener('error', onEnd)
    }
    function onData(chunk) {
      receivedBytes += chunk.length

      let err
      if (hasMemoryPressure()) {
        log.warn('Memory usage is high, aborting request')
        err = new HttpError(503, 'server is under high load, try again later')
      } else if (receivedBytes > limit) {
        // Check total received bytes
        err = new HttpError(413, 'upload limit exceeded')
      }

      if (err) {
        removeListeners()
        req.destroy() // Destroy the socket to stop receiving data
        next(err)
        return
      }

      chunks.push(chunk)
    }
    function onEnd(err) {
      removeListeners()
      /* c8 ignore next 4 */
      if (err) {
        next(new HttpError(400, '', err))
        return
      }

      // Verify Content-Length matches actual received bytes
      if (!isNaN(contentLength) && contentLength !== receivedBytes) {
        next(new HttpError(400, 'Content-Length mismatch'))
        return
      }

      const body = Buffer.concat(chunks, receivedBytes)
      const [contentType] = ('' + req.headers[CONTENT_TYPE]).split(';')

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
