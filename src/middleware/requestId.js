import * as crypto from 'node:crypto'
import { X_REQUEST_ID } from '../constants.js'

/**
 * @typedef {import('../../src/types').HandlerCb} HandlerCb
 */

// TODO: distinguish between requests from private and public ips
// TODO: tests
/**
 * Middleware which sets a request id;
 * Overwrites or sets `req.headers['x-request-id']`;
 *
 * @param {object} [options]
 * @param {boolean} [options.force] forces setting the requestId on the request
 * @returns {HandlerCb}
 */
export function requestId (options) {
  const { force } = options
  return function _requestId (req, res, next) {
    if (force) {
      req.id = crypto.randomUUID()
    } else {
      const xRequestId = req.headers[X_REQUEST_ID]
      req.id = xRequestId || crypto.randomUUID()
    }
    req.headers[X_REQUEST_ID] = req.id
    next()
  }
}
