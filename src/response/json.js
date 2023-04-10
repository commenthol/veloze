import {
  REQ_METHOD_HEAD,
  RES_ETAG,
  CONTENT_TYPE,
  MIME_JSON_UTF8
} from '../constants.js'
import { setHeaders } from './setHeaders.js'

/**
 * @typedef {import('../types').Response} Response
 * @typedef { import('../types').Request } Request
 */

/**
 * Sends response
 * sets content-type header and corrects headers based on status-code.
 *
 * @param {Response} res
 * @param {any} body
 * @param {number} [status]
 * @param {Record<string, string|number|boolean>|{}} [headers]
 */
export function json (res, body, status, headers) {
  let chunk = body

  setHeaders(res, headers)

  if (!res.getHeader(CONTENT_TYPE)) {
    res.setHeader(CONTENT_TYPE, MIME_JSON_UTF8)
  }

  res.statusCode = status || res.statusCode || 200

  chunk = JSON.stringify(chunk)
  if (res[RES_ETAG]) {
    res[RES_ETAG](chunk)
  }

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
    case 301:
    case 302:
    case 307:
    case 308:
      chunk = ''
      break
  }

  if (res[REQ_METHOD_HEAD]) {
    res.setHeader('content-length', Buffer.byteLength(chunk, 'utf-8'))
    res.end()
    return
  }
  res.end(chunk, 'utf-8')
}
