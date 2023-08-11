/**
 * @copyright Copyright(c) 2010 Sencha Inc.
 * @copyright Copyright(c) 2011 TJ Holowaychuk
 * @copyright Copyright(c) 2014 Jonathan Ong
 * @copyright Copyright(c) 2014-2015 Douglas Christopher Wilson
 * @copyright Copyright(c) 2023 commenthol
 * @license MIT
 */

import { Transform } from 'node:stream'
import { onWriteHead, getHeaderValue } from '../response/index.js'
import {
  bytes,
  filterCompressibleMimeType,
  isCompressibleMimeTypeHTB,
  healTheBreachRandomSpaces,
  compressStream
} from '../utils/index.js'
import { CONTENT_LENGTH, CONTENT_TYPE } from '../constants.js'

/** @typedef {import('../types.js').Request} Request */
/** @typedef {import('../types.js').Response} Response */

/**
 * @param {object} [options]
 * @param {number|string} [options.threshold=1024] if content-length greater threshold then content might be compressed
 * @param {boolean} [options.healTheBreach=true] prevents BREACH attack for html, js and json MIME-types
 * @param {import('../utils/compressStream.js').CompressOptions} [options.compressOptions]
 * @param {(req: Request, res: Response) => boolean} [options.filter]
 * @returns {import('../types.js').Handler}
 */
export function compress (options) {
  const {
    healTheBreach = true,
    compressOptions,
    filter = filterCompressibleMimeType
  } = options || {}

  const threshold = bytes(options?.threshold ?? 1024)

  return function compressMw (req, res, next) {
    let stream
    let writableEnded = false
    let length = 0
    const listeners = []

    // wrap request
    const _on = res.on
    const _write = res.write
    const _end = res.end

    res.write = function write (chunk, encoding) {
      if (writableEnded) {
        return false
      }

      if (!res._header) {
        res.writeHead(res.statusCode)
      }

      const bChunk = toBuffer(chunk, encoding)
      length += bChunk.length

      return stream ? stream.write(bChunk) : _write.call(res, chunk, encoding)
    }

    res.flush = function flush () {
      stream?.flush && stream.flush()
    }

    res.end = function end (chunk, encoding) {
      if (writableEnded) {
        return false
      }

      // mark ended
      writableEnded = true
      // tell connect to stop stack processing
      res.writablePiped = true

      let bChunk = toBuffer(chunk, encoding)

      if (healTheBreach && bChunk &&
        filter(req, res) &&
        isCompressibleMimeTypeHTB('' + getHeaderValue(res, CONTENT_TYPE))
      ) {
        bChunk = Buffer.concat([
          bChunk,
          Buffer.from(healTheBreachRandomSpaces())
        ])
      }
      length += bChunk.length

      if (!res._header) {
        res.setHeader(CONTENT_LENGTH, length)
        res.writeHead(res.statusCode)
      }

      if (!stream) {
        return _end.call(res, chunk, encoding)
      }

      return bChunk ? stream.end(bChunk) : stream.end()
    }

    res.on = function on (type, listener) {
      if (type !== 'drain') {
        _on.call(res, type, listener)
        return this
      }

      if (stream) {
        stream.on(type, listener)
        return this
      }
      // store listeners if they need to be applied on stream
      listeners.push([type, listener])

      return this
    }

    onWriteHead(res, () => {
      stream =
        compressStream(req, res, { compressOptions, threshold, filter }) ||
        new Transform({
          transform: function (chunk, encoding, done) {
            this.push(chunk, encoding)
            done()
          }
        })

      for (const [type, listener] of listeners) {
        stream.on(type, listener)
      }
      stream.on('data', (chunk) => {
        if (_write.call(res, chunk) === false) {
          stream.pause && stream.pause()
        }
      })
      _on.call(res, 'drain', () => {
        stream.resume && stream.resume()
      })
      stream.on('end', () => {
        _end.call(res)
      })
    })

    next()
  }
}

const toBuffer = (chunk, encoding) =>
  Buffer.isBuffer(chunk)
    ? chunk
    : Buffer.from(chunk === null || chunk === undefined ? '' : chunk, encoding)
