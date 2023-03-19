import { ms } from '../utils/ms.js'

/**
 * @typedef {import('../../src/types').HandlerCb} HandlerCb
 *
 * @typedef {object} CacheControlDirectives
 * @property {number|string} [maxAge] response remains fresh until N seconds
 * @property {number|string} [sMaxAge] response remains fresh until N seconds for shared caches
 * @property {boolean} [noCache] caches are required to always check for content updates while reusing stored content
 * @property {boolean} [mustRevalidate] response can be stored in caches and can be reused while fresh. If the response becomes stale, it must be validated with the origin server before reuse
 * @property {boolean} [proxyRevalidate] equivalent of must-revalidate, but specifically for shared caches
 * @property {boolean} [noStore] caches of any kind (private or shared) should not store this response.
 * @property {boolean} [mustUnderstand] like mustRevalidate for shared caches
 * @property {boolean} [private] response can be stored only in a private cache
 * @property {boolean} [public] response can be stored in a shared cache
 * @property {boolean} [mustUnderstand] cache should store the response only if it understands the requirements for caching based on status code
 * @property {boolean} [noTransform] Some intermediaries transform content for various reasons
 * @property {boolean} [immutable] response will not be updated while it's fresh
 * @property {boolean} [staleWhileRevalidate] cache could reuse a stale response while it revalidates it to a cache.]
 * @property {boolean} [staleIfError] cache can reuse a stale response when an origin server responds with an error (500, 502, 503, or 504)
 */

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
 * @param { CacheControlDirectives } [options]
 * @returns {string} cache-control header value
 */
export function buildCacheControl (options = {}) {
  const isEmpty = Object.keys(options).length === 0

  let maxAge = max(ms(options.maxAge, true))
  const sMaxAge = max(ms(options.sMaxAge, true))
  let {
    noCache,
    noStore
  } = options

  if (isEmpty) {
    noCache = noCache ?? true
    noStore = noStore ?? true
    maxAge = 0
  }

  const directives = []
  if (noCache) {
    directives.push('no-cache')
  }
  if (noStore) {
    directives.push('no-store')
  }
  if (options.noTransform) {
    directives.push('no-transform')
  }
  if (options.mustRevalidate) {
    directives.push('must-revalidate')
  }
  if (options.proxyRevalidate) {
    directives.push('proxy-revalidate')
  }
  if (options.mustUnderstand) {
    directives.push('must-understand')
  }
  if (options.private) {
    directives.push('private')
  }
  if (options.public) {
    directives.push('public')
  }
  if (options.immutable) {
    directives.push('immutable')
  }
  if (options.staleWhileRevalidate) {
    directives.push('stale-while-revalidate')
  }
  if (options.staleIfError) {
    directives.push('stale-if-error')
  }

  if (typeof maxAge === 'number') {
    directives.push(`max-age=${maxAge}`)
  }
  if (typeof sMaxAge === 'number') {
    directives.push(`s-maxage=${sMaxAge}`)
  }
  const value = directives.join(', ')
  return value
}

/**
 * @private
 * @param {any} value
 * @param {number} [lower=0]
 * @returns {number|undefined}
 */
function max (value, lower = 0) {
  if (typeof value !== 'number') {
    return
  }
  return Math.max(value, lower)
}

/**
 * Set the cache-control header, regardless of request method
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
 * @param {CacheControlDirectives} [options]
 * @returns {HandlerCb}
 */
export function cacheControl (options) {
  const value = buildCacheControl(options)

  return function cacheControlMw (req, res, next) {
    res.setHeader('cache-control', value)
    next()
  }
}

/**
 * @typedef {object} NoCacheMethods
 * @property {string[]} [noCacheMethods] List of uppercase request methods where no-cache rules must apply
 *
 * @typedef {CacheControlDirectives & NoCacheMethods} CacheControlDirectivesByMethod
 */

/**
 * Set the cache-control header dependent of the request method
 *
 * All requests matching `noCacheMethods` will have
 * `cache-control: no-store, no-cache, max-age=0` being set
 *
 * @param {CacheControlDirectivesByMethod} [options]
 * @returns {HandlerCb}
 */
export function cacheControlByMethod (options) {
  const {
    noCacheMethods = ['POST', 'PUT', 'PATCH', 'DELETE'],
    ...opts
  } = options || {}

  const cacheVal = buildCacheControl(opts)
  const noCacheVal = buildCacheControl()

  return function cacheControlMw (req, res, next) {
    const value = noCacheMethods.includes(req.method || '')
      ? noCacheVal
      : cacheVal
    res.setHeader('cache-control', value)
    next()
  }
}
