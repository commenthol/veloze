import { bodyParser } from './bodyParser.js'
import { cacheControlByMethod } from './cacheControl.js'
import { cookieParser } from './cookieParser.js'
import { contentSec, contentSecJson } from './contentSec.js'
import { queryParser } from './queryParser.js'
import { requestId } from './requestId.js'
import { send } from './send.js'

/**
 * @typedef {import('../types').Handler} Handler
 *
 * @typedef {object} PresetOptions
 * @property {number|string} limit body-parser limit
 * @property {import('./contentSec').CspMiddlewareOptions} cspOpts security header options
 * @property {import('./cacheControl.js').CacheControlDirectivesByMethod} cacheControlOpts}
 * @property {import('./requestId.js').RequestIdOptions} requestIdOpts}
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
    cacheControlOpts,
    requestIdOpts
  } = options || {}

  return [
    requestId(requestIdOpts),
    contentSec(cspOpts),
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
    cacheControlOpts = { noStore: true },
    requestIdOpts
  } = options || {}

  return [
    requestId(requestIdOpts),
    contentSecJson(cspOpts),
    cacheControlByMethod(cacheControlOpts),
    send,
    queryParser,
    bodyParser.json({ limit })
  ]
}
