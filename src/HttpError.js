import * as http from 'node:http'

/**
 * @typedef {object} HttpErrorParam
 * @property {Error} [cause] internal error cause; is logged in finalHandler; use this for any internal error
 * @property {object|string} [description] error description for use in response
 * @property {string|number} [code] optional error code
 */

export class HttpError extends Error {
  /**
   * @param {number} status HTTP status code for response
   * @param {string} [message] error message for response
   * @param {Error|HttpErrorParam} [param]
   */
  constructor (status, message, param) {
    let cause
    let description
    let code
    if (param instanceof Error) {
      cause = param
    } else {
      cause = param?.cause
      description = param?.description
      code = param?.code
    }
    const _message = message || http.STATUS_CODES[status] || 'general error'
    super(_message, { cause })
    this.status = status || 500
    this.description = description
    this.code = code
  }
}
