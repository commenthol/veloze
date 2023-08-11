import * as fs from 'node:fs'
import * as fsp from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HttpError } from '../HttpError.js'
import { redirect } from '../response/index.js'
import { logger } from '../utils/logger.js'
import {
  bytes,
  mimeTypes,
  rangeParser,
  compressStream
} from '../utils/index.js'
import {
  CONTENT_LENGTH,
  CONTENT_RANGE,
  CONTENT_TYPE,
  REQ_METHOD_HEAD
} from '../constants.js'

/** @typedef {import('../types.js').Request} Request */
/** @typedef {import('../types.js').Response} Response */
/** @typedef {import('../utils/compressStream.js').CompressOptions} CompressOptions */

let log

const ALLOWED_METHODS = ['GET', 'HEAD']
const ALLOW = ALLOWED_METHODS.join(', ')
const RE_TRAVERSE = /(?:^|[\\/])\.\.(?:[\\/]|$)/

/**
 * @typedef {object} ServeOptions
 * @property {boolean} [etag=true] generates weak ETag
 * @property {boolean} [fallthrough] continue processing if document could not be found
 * @property {string} [index='index.html'] index document being served in case that directory was found
 * @property {string} [strip] strip
 * @property {boolean} [compress=true] compresses all text files with file-size greater than compressThreshold
 * @property {number|string} [threshold=1024] compress threshold in bytes
 * @property {(req: Request, res: Response) => boolean} [filter] filter to decide if response shall be compressible. If `true` then response is potentially compressible
 * @property {CompressOptions} [compressOptions]
 */

/**
 * @param {string|URL} root directory
 * @param {ServeOptions} [options]
 * @returns
 */
export function serve (root, options) {
  const {
    etag = true,
    fallthrough = false,
    index = 'index.html',
    strip,
    compress = true,
    compressOptions,
    filter
  } = options || {}

  const threshold = bytes(options?.threshold) || 1024

  const _root = toPathname(root)
  if (!_root) {
    throw new TypeError('need root path')
  }

  log = log || logger(':serve')
  log.debug('root path is %s', _root)

  if (typeof index !== 'string') {
    throw new TypeError('index must be a string')
  }

  return async function serveMw (req, res, next) {
    let err
    try {
      const { method, url, originalUrl } = req
      if (!ALLOWED_METHODS.includes(method)) {
        res.setHeader('allow', ALLOW)
        throw new HttpError(405)
      }

      let [pathnameFromUrl] = (originalUrl || url).split('?', 1)
      if (strip && pathnameFromUrl.startsWith(strip)) {
        pathnameFromUrl = pathnameFromUrl.slice(strip.length)
      }

      const pathname = path.resolve('/', pathnameFromUrl)
      /* c8 ignore next 3 */
      if (RE_TRAVERSE.test(pathname)) {
        throw new HttpError(403)
      }
      const filename = path.join(_root, pathname)

      const basename = path.basename(filename)
      // do not deliver hidden files
      if (basename[0] === '.') {
        throw new HttpError(404)
      }

      const stats = await fsp.stat(filename)
      log.debug(
        'url=%s filename=%s isFile=%s',
        pathnameFromUrl,
        filename,
        stats?.isFile()
      )

      if (stats.isDirectory() && !/[\\/]$/.test(pathnameFromUrl)) {
        redirect(res, pathname + '/')
        return
      }

      const [start, end] = rangeParser(req.headers.range, stats.size)
      if (start === -1) {
        res.setHeader(CONTENT_RANGE, `bytes */${stats.size}`)
        throw new HttpError(416)
      }

      if (stats.isFile()) {
        streamFile({
          filename,
          req,
          res,
          etag,
          stats,
          start,
          end,
          compress,
          threshold,
          compressOptions,
          filter
        })
        return
      }

      {
        const _filename = path.join(filename, index)
        const stats = await fsp.stat(_filename).catch(() => {})
        log.debug(
          'url=%s filename=%s isFile=%s',
          pathnameFromUrl,
          filename,
          stats?.isFile()
        )
        if (stats?.isFile()) {
          streamFile({
            filename: _filename,
            req,
            res,
            etag,
            stats,
            start,
            end,
            compress,
            threshold,
            compressOptions,
            filter
          })
          return
        }
      }
    } catch (/** @type {Error|any} */ e) {
      err = e
      if (['ENAMETOOLONG', 'ENOENT', 'ENOTDIR'].includes(e.code)) {
        err = new HttpError(404)
      }
      log.error(err)
    }
    next(fallthrough ? null : err)
  }
}

/**
 * @param {{
 *  filename: string
 *  req: object
 *  res: object
 *  etag?: boolean
 *  stats: fs.Stats
 *  start?: number
 *  end?: number
 *  compress?: boolean
 *  threshold: number
 *  compressOptions?: CompressOptions
 *  filter?: (req: Request, res: Response) => boolean
 * }} param0
 */
const streamFile = (param0) => {
  const {
    filename,
    req,
    res,
    etag,
    stats,
    start = 0,
    end,
    compress,
    threshold,
    compressOptions,
    filter
  } = param0

  const eTag = setEtag(res, stats)
  if (etag && req.headers['if-none-match'] === eTag) {
    res.statusCode = 304
    res.removeHeader('content-encoding')
    res.removeHeader('content-language')
    res.removeHeader(CONTENT_LENGTH)
    res.removeHeader(CONTENT_RANGE)
    res.removeHeader(CONTENT_TYPE)
    res.removeHeader('transfer-encoding')
    res.end()
    return
  }

  if (end) {
    res.setHeader(CONTENT_RANGE, `bytes ${start}-${end}/${stats.size}`)
    res.statusCode = 206
  }
  res.setHeader(CONTENT_LENGTH, end ? end - start : stats.size)
  if (res[REQ_METHOD_HEAD] || req.method === 'HEAD') {
    res.end()
    return
  }

  setMimeType(res, filename)

  const stream = fs.createReadStream(filename, { start, end })
  stream.on('error', (err) => {
    /* c8 ignore next 3 */
    log.error(err)
    stream.destroy()
  })

  const compressibleStream = compress
    ? compressStream(req, res, { compressOptions, threshold, filter })
    : undefined

  if (compressibleStream) {
    stream.pipe(compressibleStream).pipe(res)
  } else {
    stream.pipe(res)
  }
  res.writablePipe = true
}

/**
 * @param {object} res The response object.
 * @param {fs.Stats} stats file stats
 */
const setEtag = (res, stats) => {
  const { mtime, size } = stats
  const eTag = `W/"${mtime.getTime()}-${size}"`
  res.setHeader('etag', eTag)
  return eTag
}

/**
 * @param {object} res The response object.
 * @param {string} filename The name of the file.
 * @returns {string} mimeType
 */
const setMimeType = (res, filename) => {
  const fileExtension = path.extname(filename)
  const mimeType = mimeTypes[fileExtension] || 'application/octet-stream'
  res.setHeader(CONTENT_TYPE, mimeType)
  return mimeType
}

/**
 * @param {string|URL} pathOrUrl
 * @returns {string|undefined}
 */
const toPathname = (pathOrUrl) => {
  if (!pathOrUrl) {
    return
  }
  if (typeof pathOrUrl === 'string') {
    return pathOrUrl
  }
  if (pathOrUrl instanceof URL) {
    return fileURLToPath(pathOrUrl)
  }
}
