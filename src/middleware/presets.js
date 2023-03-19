import { bodyParser } from './bodyParser.js'
import { cacheControlByMethod } from './cacheControl.js'
import { cookieParser } from './cookieParser.js'
import { csp, cspJson } from './csp.js'
import { queryParser } from './queryParser.js'
import { requestId } from './requestId.js'
import { send } from './send.js'
import { tooBusy } from './tooBusy.js'

/**
 * @typedef {import('../types.js').Handler} Handler
 *
 * @typedef {object} PresetOptions
 * @property {number|string} limit body-parser limit
 * @property {import('./csp').CspMiddlewareOptions} cspOpts security header options
 * @property {import('./tooBusy.js').TooBusyOptions} tooBusyOpts Note: tooBusy options are set globally for the whole server
 * @property {import('./cacheControl.js').CacheControlDirectivesByMethod} cacheControlOpts}
 */

/**
 * Preset for endpoints rendering HTML pages
 * @param {PresetOptions} [options]
 * @return {Handler[]}
 */
export const presetHtml = (options) => {
  const {
    limit = '100kb',
    cspOpts,
    tooBusyOpts,
    cacheControlOpts
  } = options || {}

  return [
    tooBusy(tooBusyOpts),
    requestId(),
    csp(cspOpts),
    cacheControlByMethod(cacheControlOpts),
    send,
    queryParser,
    cookieParser,
    bodyParser.urlEncoded({ limit })
  ]
}

/**
 * Preset for REST JSON based endpoints
 * @param {PresetOptions} [options]
 * @return {Handler[]}
 */
export const presetJson = (options) => {
  const {
    limit = '100kb',
    cspOpts,
    tooBusyOpts,
    cacheControlOpts = { noStore: true }
  } = options || {}

  return [
    tooBusy(tooBusyOpts),
    requestId(),
    cspJson(cspOpts),
    cacheControlByMethod(cacheControlOpts),
    send,
    queryParser,
    bodyParser.json({ limit })
  ]
}
