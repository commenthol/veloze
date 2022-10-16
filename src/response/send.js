/**
 * @typedef {import('../types').Response} Response
 * @typedef { import('../types').Request } Request
 */

export const METHOD_HEAD = Symbol('kMethodHead')
export const CONTENT_TYPE = 'content-type'
export const MIME_HTML = 'text/html; charset=utf-8'
export const MIME_JSON = 'application/json; charset=utf-8'
export const MIME_BIN = 'application/octet-stream'

/**
 * @param {Response} res
 * @param {any} body
 * @param {number} [status]
 * @param {object} [headers]
 */
export function send (res, body, status, headers) {
  let chunk = body
  /** @type {BufferEncoding} */
  let encoding = 'utf-8'

  for (const [header, value] of Object.entries(headers || {})) {
    res.setHeader(header, value)
  }

  if (typeof chunk === 'string') {
    if (!res.getHeader(CONTENT_TYPE)) {
      res.setHeader(CONTENT_TYPE, MIME_HTML)
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
      res.setHeader(CONTENT_TYPE, MIME_JSON)
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

  if (res[METHOD_HEAD]) {
    res.setHeader('content-length', Buffer.byteLength(chunk, 'utf-8'))
    res.end()
    return
  }
  res.end(chunk, encoding)
}
