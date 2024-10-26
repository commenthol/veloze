import {
  REQ_METHOD_HEAD,
  CONTENT_TYPE,
  CONTENT_LENGTH,
  MIME_HTML,
  MIME_HTML_UTF8,
  CONTENT_SECURITY_POLICY
} from '../constants.js'
import { setHeaders } from './setHeaders.js'
import { escapeHtmlLit } from '../utils/index.js'

/**
 * @typedef {import('#types.js').Response} Response
 */

const htmlTmpl = (location) => escapeHtmlLit`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
  <p>Redirecting to <a href="${location}">${location}</a>.
</body>
</html>
`

/**
 * Send redirect dependent of content-type;
 * Defaults to 307 Temporary Redirect
 *
 * @param {Response} res
 * @param {string} location
 * @param {number} [status=307]
 * @param {Record<string, string|number|boolean>|{}} [headers]
 */
export function redirect (res, location, status = 307, headers = {}) {
  res.statusCode = Math.floor(status / 100) === 3 ? status : 307

  /// remove any previously set cache-control header
  /// if redirect needs cache-control set with `headers['cache-control']`!
  res.removeHeader('cache-control')
  setHeaders(res, { ...headers, location })

  if (res[REQ_METHOD_HEAD]) {
    res.end()
    return
  }

  let body
  const type = '' + res.getHeader(CONTENT_TYPE)
  if (!type || type.startsWith(MIME_HTML)) {
    body = htmlTmpl(location)
    res.setHeader(CONTENT_TYPE, MIME_HTML_UTF8)
    res.setHeader(CONTENT_LENGTH, Buffer.byteLength(body))
    if (!res.getHeader(CONTENT_SECURITY_POLICY)) {
      res.setHeader(CONTENT_SECURITY_POLICY, "default-src 'self'")
    }
  }

  res.end(body)
}
