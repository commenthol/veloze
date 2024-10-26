import * as zlib from 'node:zlib'
import { webcrypto as crypto } from 'node:crypto'
import { acceptEncoding } from '../request/index.js'
import { vary } from '../response/index.js'
import {
  ACCEPT_ENCODING,
  CONTENT_ENCODING,
  CONTENT_LENGTH,
  CONTENT_TYPE,
  REQ_METHOD_HEAD
} from '../constants.js'

/** @typedef {zlib.BrotliOptions & zlib.ZlibOptions} CompressOptions */
/** @typedef {import('#types.js').Request} Request */
/** @typedef {import('#types.js').Response} Response */

const SUPPORTED = ['br', 'gzip', 'deflate']

/**
 * @param {Request} req
 * @param {Response} res
 * @param {object} [options]
 * @param {CompressOptions} [options.compressOptions]
 * @param {number} [options.threshold=1024]
 * @param {(req: Request, res: Response) => boolean} [options.filter]
 * @returns {import('node:stream').Transform|undefined}
 */
export function compressStream (req, res, options) {
  const {
    compressOptions,
    threshold = 1024,
    filter = filterCompressibleMimeType
  } = options || {}

  if (res.getHeader(CONTENT_ENCODING)) {
    // Maybe another compressor will be applied, so do nothing here
    return
  }

  // Don't compress for Cache-Control: no-transform
  // https://tools.ietf.org/html/rfc7234#section-5.2.2.4
  if (/\bno-transform\b/.test('' + res.getHeader('cache-control'))) {
    return
  }

  const isCompressible = filter(req, res)
  if (isCompressible) {
    // always set vary header for compressible mime types
    vary(res, ACCEPT_ENCODING)
  }

  const length = Number(res.getHeader(CONTENT_LENGTH))
  if (
    !isCompressible ||
    req.method === 'HEAD' ||
    res[REQ_METHOD_HEAD] ||
    [204, 206, 304].includes(res.statusCode) ||
    length < threshold
  ) {
    return
  }

  const acceptable = acceptEncoding(req)

  let encoding
  for (const enc of SUPPORTED) {
    if (acceptable.includes(enc)) {
      encoding = enc
      break
    }
  }

  const stream =
    encoding === 'br'
      ? zlib.createBrotliCompress(compressOptions)
      : encoding === 'gzip'
        ? zlib.createGzip(compressOptions)
        : encoding === 'deflate'
          ? zlib.createDeflate(compressOptions)
          : undefined

  if (encoding) {
    res.setHeader(CONTENT_ENCODING, encoding)
    res.removeHeader(CONTENT_LENGTH)
  }

  return stream
}

/**
 * @param {Request} req
 * @param {Response} res
 * @returns {boolean}
 */
export const filterCompressibleMimeType = (req, res) => {
  const mimeType = res.getHeader(CONTENT_TYPE)
  return isCompressibleMimeType('' + mimeType)
}

/**
 * @param {string} mimeType
 * @returns {boolean}
 */
export const isCompressibleMimeType = (mimeType) =>
  /^text\/|^application\/json\b/.test(mimeType)

/**
 * @param {string} mimeType
 * @returns {boolean}
 */
export const isCompressibleMimeTypeHTB = (mimeType) =>
  /^text\/(html|javascript)\b|^application\/json\b/.test(mimeType)

/**
 * To confuse execution of the BREACH attack random spaces are appended to html,
 * javascript and json responses. Modern browsers ignore such. This implies that
 * from a 100% hit rate such random spaces only return a ~17% hit rate on the
 * smallest compressed file size.
 * @returns {string}
 */
export const healTheBreachRandomSpaces = () => {
  const rand = crypto.getRandomValues(new Uint8Array(49))
  const len = 16 + (rand[0] % 32) // ~17% correct hits
  let spaces = ''
  for (let i = 1; i < len; i++) {
    spaces += spaceMap[rand[i] % 3]
  }
  return spaces
}
const spaceMap = [' ', '\n', '\t']
