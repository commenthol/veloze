import * as http from 'node:http'

export class HttpError extends Error {
  /**
   * @param {number} status
   * @param {string} [message]
   * @param {Error} [err]
   */
  constructor (status, message, err) {
    const _message = message || http.STATUS_CODES[status] || 'general error'
    super(_message, { cause: err })
    this.status = status || 500
  }
}
