/**
 * @typedef {import('../types').Response} Response
 */

/**
 * call listener function as soon as res.writeHead is called
 * @param {Response} res
 * @param {(res: Response) => void} listener
 */
export function onWriteHead (res, listener) {
  if (!res) {
    throw new TypeError('need request')
  }
  if (typeof listener !== 'function') {
    throw new TypeError('listener must be a function')
  }

  const _writeHead = res.writeHead.bind(res)

  // @ts-expect-error
  res.writeHead = function (statusCode, statusMessage, headers) {
    listener(res)

    statusCode = res.statusCode === 200 ? statusCode : res.statusCode

    const _headers = {
      ...res.getHeaders(),
      ...getHeaders(statusMessage, headers)
    }

    return typeof statusMessage === 'string'
      ? _writeHead(statusCode, statusMessage, _headers)
      : _writeHead(statusCode, _headers)
  }
}

/**
 * @param {string|object|string[][]} statusMessage
 * @param {object|string[][]} [headers]
 * @returns {Record<string,any>|{}}
 */
const getHeaders = (statusMessage, headers) => {
  const rawHeaders =
    (typeof statusMessage === 'string' ? headers : statusMessage) || {}

  return Array.isArray(rawHeaders)
    ? rawHeaders.reduce((curr, [k, v]) => {
      curr[k] = v
      return curr
    }, {})
    : rawHeaders
}
