import * as http from 'node:http'

export class HttpError extends Error {
  /**
   * @param {number} status HTTP status code for response
   * @param {string} [message] error message for response
   * @param {Error} [err] internal error cause; is logged in finalHandler; use this for any internal error
   */
  constructor (status, message, err) {
    const _message = message || http.STATUS_CODES[status] || 'general error'
    super(_message, { cause: err })
    this.status = status || 500
  }
}
