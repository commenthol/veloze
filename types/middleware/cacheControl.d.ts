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
export function buildCacheControl(options?: CacheControlDirectives | undefined): string;
/**
 * Set the cache-control header, regardless of request method
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
 * @param {CacheControlDirectives} [options]
 * @returns {HandlerCb}
 */
export function cacheControl(options?: CacheControlDirectives | undefined): HandlerCb;
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
export function cacheControlByMethod(options?: CacheControlDirectivesByMethod | undefined): HandlerCb;
export type HandlerCb = typeof import("../../src/types").HandlerCb;
export type CacheControlDirectives = {
    /**
     * response remains fresh until N seconds
     */
    maxAge?: string | number | undefined;
    /**
     * response remains fresh until N seconds for shared caches
     */
    sMaxAge?: string | number | undefined;
    /**
     * caches are required to always check for content updates while reusing stored content
     */
    noCache?: boolean | undefined;
    /**
     * response can be stored in caches and can be reused while fresh. If the response becomes stale, it must be validated with the origin server before reuse
     */
    mustRevalidate?: boolean | undefined;
    /**
     * equivalent of must-revalidate, but specifically for shared caches
     */
    proxyRevalidate?: boolean | undefined;
    /**
     * caches of any kind (private or shared) should not store this response.
     */
    noStore?: boolean | undefined;
    /**
     * like mustRevalidate for shared caches
     */
    mustUnderstand?: boolean | undefined;
    /**
     * response can be stored only in a private cache
     */
    private?: boolean | undefined;
    /**
     * response can be stored in a shared cache
     */
    public?: boolean | undefined;
    /**
     * Some intermediaries transform content for various reasons
     */
    noTransform?: boolean | undefined;
    /**
     * response will not be updated while it's fresh
     */
    immutable?: boolean | undefined;
    /**
     * cache could reuse a stale response while it revalidates it to a cache.]
     */
    staleWhileRevalidate?: boolean | undefined;
    /**
     * cache can reuse a stale response when an origin server responds with an error (500, 502, 503, or 504)
     */
    staleIfError?: boolean | undefined;
};
export type NoCacheMethods = {
    /**
     * List of uppercase request methods where no-cache rules must apply
     */
    noCacheMethods?: string[] | undefined;
};
export type CacheControlDirectivesByMethod = CacheControlDirectives & NoCacheMethods;
