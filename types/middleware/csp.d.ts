/**
 * Middleware which adds various security headers on html pages.
 * - csp: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 * - hsts: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
 * - referrerPolicy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
 * - xContentTypeOptions: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options
 * - xDnsPrefetchControl: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control
 * - crossOriginEmbedderPolicy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy
 * - crossOriginOpenerPolicy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy
 * - crossOriginResourcePolicy: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy
 *
 * @see https://owasp.org/www-project-secure-headers/ci/headers_add.json
 *
 * @param {object} [options]
 * @param {string[]} [options.extensions=['', '.html', '.htm']] extensions where CSP is applied
 * @param {CspOptions|false} [options.csp] content-security-policy; false disables CSP
 * @param {HstsOptions|false} [options.hsts] strict-transport-security; false disables HSTS
 * @param {ReferrerPolicy|false} [options.referrerPolicy='no-referrer'] referrer-policy header
 * @param {boolean} [options.xContentTypeOptions=true] x-content-type-options header; true sets 'nosniff'
 * @param {'on'|'off'|false} [options.xDnsPrefetchControl='off'] x-dns-prefetch-control header
 * @param {'require-corp'|'unsafe-none'|'credentialless'|false} [options.crossOriginEmbedderPolicy='require-corp'] cross-origin-embedder-policy header
 * @param {'same-origin'|'same-origin-allow-popups'|'unsafe-none'|false} [options.crossOriginOpenerPolicy='same-origin'] cross-origin-opener-policy header
 * @param {'same-origin'|'same-site'|'cross-origin'|false} [options.crossOriginResourcePolicy='same-origin'] cross-origin-resource-policy header
 * @returns {HandlerCb}
 */
export function csp(options?: {
    extensions?: string[] | undefined;
    csp?: false | CspOptions | undefined;
    hsts?: false | HstsOptions | undefined;
    referrerPolicy?: false | ReferrerPolicy | undefined;
    xContentTypeOptions?: boolean | undefined;
    xDnsPrefetchControl?: false | "on" | "off" | undefined;
    crossOriginEmbedderPolicy?: false | "require-corp" | "unsafe-none" | "credentialless" | undefined;
    crossOriginOpenerPolicy?: false | "same-origin" | "unsafe-none" | "same-origin-allow-popups" | undefined;
    crossOriginResourcePolicy?: false | "same-origin" | "same-site" | "cross-origin" | undefined;
} | undefined): HandlerCb;
/**
 * Parse and log csp violation
 * @param {{log: Log}} options
 * @returns {HandlerCb}
 */
export function cspReport(options: {
    log: Log;
}): HandlerCb;
export function buildHsts(options: HstsOptions | undefined): string | undefined;
export function buildCsp(options?: {} | CspOptions | undefined): string;
export type HandlerCb = typeof import("../../src/types").HandlerCb;
export type Log = import('../../src/types').Log;
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
