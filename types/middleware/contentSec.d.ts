/**
 * @typedef {object} CspMiddlewareOptions
 * @property {string[]} [extensions=['', '.html', '.htm']] extensions where CSP is applied
 * @property {CspOptions|false} [csp] content-security-policy; false disables CSP
 * @property {HstsOptions|false} [hsts] strict-transport-security; false disables HSTS
 * @property {ReferrerPolicy|false} [referrerPolicy='no-referrer'] referrer-policy header
 * @property {boolean} [xContentTypeOptions=true] x-content-type-options header; true sets 'nosniff'
 * @property {'on'|'off'|false} [xDnsPrefetchControl='off'] x-dns-prefetch-control header
 * @property {'require-corp'|'unsafe-none'|'credentialless'|false} [crossOriginEmbedderPolicy='require-corp'] cross-origin-embedder-policy header; see https://web.dev/coop-coep/
 * @property {'same-origin'|'same-origin-allow-popups'|'unsafe-none'|false} [crossOriginOpenerPolicy='same-origin'] cross-origin-opener-policy header
 * @property {'same-origin'|'same-site'|'cross-origin'|false} [crossOriginResourcePolicy='same-origin'] cross-origin-resource-policy header
 */
/**
 * Middleware which adding various security headers to html page responses.
 *
 * This is a "slow" middleware. If performance is required it is recommended to
 * set the security headers "manually". Use this middleware then to identify the
 * necessary secure settings to extract the headers into it's own middleware.
 *
 * - csp: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 * - hsts: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
 * - referrerPolicy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
 * - xContentTypeOptions: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
 * - xDnsPrefetchControl: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
 * - crossOriginEmbedderPolicy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
 * - crossOriginOpenerPolicy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
 * - crossOriginResourcePolicy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy
 *
 * Links
 *
 * - https://web.dev/strict-csp/
 * - https://owasp.org/www-project-secure-headers/ci/headers_add.json
 *
 * @param {CspMiddlewareOptions} [options]
 * @returns {HandlerCb}
 */
export function contentSec(options?: CspMiddlewareOptions | undefined): HandlerCb;
/**
 * Middleware adding various security headers to json responses.
 * @see https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#security-headers
 * @param {CspMiddlewareOptions} [options]
 * @returns {HandlerCb}
 */
export function contentSecJson(options?: CspMiddlewareOptions | undefined): HandlerCb;
/**
 * Parse and log csp violation
 * @param {{log: Log}} options
 * @returns {HandlerCb}
 */
export function cspReport(options: {
    log: Log;
}): HandlerCb;
export function buildHsts(options: HstsOptions | boolean | undefined): string | undefined;
export function buildCsp(options?: {} | CspOptions | undefined): string;
export type CspMiddlewareOptions = {
    /**
     * extensions where CSP is applied
     */
    extensions?: string[] | undefined;
    /**
     * content-security-policy; false disables CSP
     */
    csp?: false | CspOptions | undefined;
    /**
     * strict-transport-security; false disables HSTS
     */
    hsts?: false | HstsOptions | undefined;
    /**
     * referrer-policy header
     */
    referrerPolicy?: false | ReferrerPolicy | undefined;
    /**
     * x-content-type-options header; true sets 'nosniff'
     */
    xContentTypeOptions?: boolean | undefined;
    /**
     * x-dns-prefetch-control header
     */
    xDnsPrefetchControl?: false | "off" | "on" | undefined;
    /**
     * cross-origin-embedder-policy header; see https://web.dev/coop-coep/
     */
    crossOriginEmbedderPolicy?: false | "require-corp" | "unsafe-none" | "credentialless" | undefined;
    /**
     * cross-origin-opener-policy header
     */
    crossOriginOpenerPolicy?: false | "same-origin" | "unsafe-none" | "same-origin-allow-popups" | undefined;
    /**
     * cross-origin-resource-policy header
     */
    crossOriginResourcePolicy?: false | "same-origin" | "same-site" | "cross-origin" | undefined;
};
export type HandlerCb = typeof import("../types").HandlerCb;
export type Log = import('../types').Log;
export type HstsOptions = {
    /**
     * max-age in seconds (defaults to 180days) or ms string
     */
    maxAge?: string | number | undefined;
    includeSubDomains?: boolean | undefined;
    preload?: boolean | undefined;
};
export type ReferrerPolicy = 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
export type CspOptions = {
    /**
     * if `true` CspOptions are not patched with CSP_DEFAULTS
     */
    omitDefaults?: boolean | undefined;
    /**
     * if `true` csp is only reported but not blocked
     */
    reportOnly?: boolean | undefined;
    "connect-src"?: string | string[] | undefined;
    "default-src"?: string | string[] | undefined;
    "font-src"?: string | string[] | undefined;
    "frame-src"?: string | string[] | undefined;
    "img-src"?: string | string[] | undefined;
    "manifest-src"?: string | string[] | undefined;
    "media-src"?: string | string[] | undefined;
    "object-src"?: string | string[] | undefined;
    "prefetch-src"?: string | string[] | undefined;
    "script-src"?: string | string[] | undefined;
    "script-src-elem"?: string | string[] | undefined;
    "script-src-attr"?: string | string[] | undefined;
    "style-src"?: string | string[] | undefined;
    "style-src-elem"?: string | string[] | undefined;
    "style-src-attr"?: string | string[] | undefined;
    "worker-src"?: string | string[] | undefined;
    "base-uri"?: string | string[] | undefined;
    sandbox?: string | string[] | undefined;
    "form-action"?: string | string[] | undefined;
    "frame-ancestors"?: string | string[] | undefined;
    "navigate-to"?: string | string[] | undefined;
    "report-to"?: string | undefined;
    "report-uri"?: string | undefined;
    "require-trusted-types-for"?: string | string[] | undefined;
    "trusted-types"?: string | string[] | undefined;
    "upgrade-insecure-requests"?: boolean | undefined;
};
