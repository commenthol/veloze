import * as crypto from 'node:crypto'
import { X_REQUEST_ID } from '../constants.js'
import { getHeader } from '../request/getHeader.js'

/**
 * @typedef {import('../types').HandlerCb} HandlerCb
 */

// TODO: distinguish between requests from private and public ips

/**
 * Middleware which sets a random request id;
 * Overwrites or sets `req.headers['x-request-id']`;
 *
 * @param {object} [options]
 * @param {boolean} [options.force] forces setting the requestId on the request
 * @param {boolean} [options.setResponseHeader] set on response header
 * @returns {HandlerCb}
 */
export function requestId (options) {
  const {
    force = false,
    setResponseHeader: setResponse = false
  } = options || {}

  return function requestIdMw (req, res, next) {
    req.id = force
      ? crypto.randomUUID()
      : (getHeader(req, X_REQUEST_ID) || crypto.randomUUID())
    req.headers[X_REQUEST_ID] = req.id
    if (setResponse) {
      res.setHeader(X_REQUEST_ID, req.id)
    }
    next()
  }
}
