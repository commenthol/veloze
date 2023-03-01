import {
  REQ_METHOD_HEAD,
  CONTENT_TYPE,
  MIME_HTML_UTF8,
  MIME_JSON_UTF8,
  MIME_BIN
} from '../constants.js'
import { setHeaders } from './setHeaders.js'

/**
 * @typedef {import('../types').Response} Response
 * @typedef { import('../types').Request } Request
 */

// TODO: add fresh and etag generation
/**
 * Sends response
 * sets content-type header and corrects headers based on status-code.
 *
 * @param {Response} res
 * @param {any} body
 * @param {number} [status]
 * @param {object} [headers]
 */
export function send (res, body, status, headers) {
  let chunk = body
  /** @type {BufferEncoding} */
  let encoding = 'utf-8'

  setHeaders(res, headers)

  if (typeof chunk === 'string') {
    if (!res.getHeader(CONTENT_TYPE)) {
      res.setHeader(CONTENT_TYPE, MIME_HTML_UTF8)
    }
  } else if (Buffer.isBuffer(chunk)) {
    encoding = 'binary'
    if (!res.getHeader(CONTENT_TYPE)) {
      res.setHeader(CONTENT_TYPE, MIME_BIN)
    }
  } else if (chunk === null || chunk === undefined) {
    chunk = ''
  } else {
    chunk = JSON.stringify(chunk)
    if (!res.getHeader(CONTENT_TYPE)) {
      res.setHeader(CONTENT_TYPE, MIME_JSON_UTF8)
    }
  }

  res.statusCode = status || res.statusCode || 200

  switch (res.statusCode) {
    case 204:
    case 304:
      // strip irrelevant headers
      res.removeHeader('content-type')
      res.removeHeader('transfer-encoding')
      chunk = ''
      break
    case 205:
      // alter headers for 205
      res.removeHeader('transfer-encoding')
      chunk = ''
      break
  }

  if (res[REQ_METHOD_HEAD]) {
    res.setHeader('content-length', Buffer.byteLength(chunk, 'utf-8'))
    res.end()
    return
  }
  res.end(chunk, encoding)
}
