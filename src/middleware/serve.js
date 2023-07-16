import * as fsp from 'node:fs/promises'
import * as fs from 'node:fs'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { HttpError } from '../HttpError.js'
import { redirect } from '../response/index.js'
import { logger } from '../utils/logger.js'
import { mimeTypes, rangeParser } from '../utils/index.js'
import { REQ_METHOD_HEAD } from '../constants.js'

let log

const ALLOWED_METHODS = ['GET', 'HEAD']
const ALLOW = ALLOWED_METHODS.join(', ')
const RE_TRAVERSE = /(?:^|[\\/])\.\.(?:[\\/]|$)/

/**
 * @param {string|URL} root directory
 * @param {{
 *  etag?: boolean
 *  fallthrough?: boolean
 *  index?: string
 *  strip?: string
 * }} [options]
 * @returns
 */
export function serve (root, options) {
  const {
    etag = true,
    fallthrough = false,
    index = 'index.html',
    strip
  } = options || {}

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
      log.debug('url=%s filename=%s isFile=%s', pathnameFromUrl, filename, stats?.isFile())

      if (stats.isDirectory() && !/[\\/]$/.test(pathnameFromUrl)) {
        redirect(res, pathname + '/')
        return
      }

      const [start, end] = rangeParser(req.headers.range, stats.size)
      if (start === -1) {
        res.setHeader('content-range', `bytes */${stats.size}`)
        throw new HttpError(416)
      }

      if (stats.isFile()) {
        streamFile({ filename, req, res, etag, stats, start, end })
        return
      }

      {
        const _filename = path.join(filename, index)
        const stats = await fsp.stat(_filename).catch(() => {})
        log.debug('url=%s filename=%s isFile=%s', pathnameFromUrl, filename, stats?.isFile())
        if (stats?.isFile()) {
          streamFile({ filename: _filename, req, res, etag, stats, start, end })
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

const streamFile = ({ filename, req, res, etag, stats, start = 0, end }) => {
  const eTag = setEtag(req, res, stats)
  if (etag && req.headers['if-none-match'] === eTag) {
    res.statusCode = 304
    res.removeHeader('content-encoding')
    res.removeHeader('content-language')
    res.removeHeader('content-length')
    res.removeHeader('content-range')
    res.removeHeader('content-type')
    res.removeHeader('transfer-encoding')
    res.end()
    return
  }

  if (end) {
    res.setHeader('content-range', `bytes ${start}-${end}/${stats.size}`)
    res.statusCode = 206
  }
  res.setHeader('content-length', end ? end - start : stats.size)
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
  stream.pipe(res)
  res.writablePipe = true
}

const setEtag = (req, res, stats) => {
  const { mtime, size } = stats
  const eTag = `W/"${mtime.getTime()}-${size}"`
  res.setHeader('etag', eTag)
  return eTag
}

/**
 * @param {object} res - The response object.
 * @param {string} filename - The name of the file.
 */
const setMimeType = (res, filename) => {
  const fileExtension = path.extname(filename)
  const mimeType = mimeTypes[fileExtension] || 'application/octet-stream'
  res.setHeader('content-type', mimeType)
}

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
