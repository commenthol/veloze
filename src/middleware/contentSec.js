import { extname } from 'node:path'
import { logger } from '../utils/logger.js'
import { ms, random64 } from '../utils/index.js'
import { isHttpsProto } from '../request/isHttpsProto.js'
import { send } from '../response/send.js'
import { setPath } from '../request/setPath.js'
import { bodyParser } from './bodyParser.js'
import { connect } from '../connect.js'

/**
 * @typedef {import('#types.js').HandlerCb} HandlerCb
 * @typedef {import('#types.js').Log} Log
 */

/**
 * @typedef {object} HstsOptions
 * @property {number|string} [maxAge='180d'] max-age in seconds (defaults to 180days) or ms string
 * @property {boolean} [includeSubDomains=true]
 * @property {boolean} [preload=false]
 */

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
 * @param {HstsOptions|boolean|undefined} options
 * @returns {string|undefined}
 */
export const buildHsts = (options) => {
  if (options === false) return
  if (!options || options === true) {
    options = { maxAge: '180days', includeSubDomains: true }
  }
  const { maxAge: _maxAge, includeSubDomains, preload } = options

  const maxAge = ms(_maxAge, true)
  if (!maxAge || maxAge < 0) {
    return
  }
  const parts = [`max-age=${maxAge}`]
  if (includeSubDomains) {
    parts.push('includeSubDomains')
  }
  if (preload) {
    parts.push('preload')
  }
  return parts.join('; ')
}

/**
 * @typedef {'no-referrer'|'no-referrer-when-downgrade'|'origin'|'origin-when-cross-origin'|'same-origin'|'strict-origin'|'strict-origin-when-cross-origin'|'unsafe-url'} ReferrerPolicy
 */

const REFERRER_POLICY = [
  'no-referrer',
  'no-referrer-when-downgrade',
  'origin',
  'origin-when-cross-origin',
  'same-origin',
  'strict-origin',
  'strict-origin-when-cross-origin',
  'unsafe-url'
]

const X_DNS_PREFETCH_CONTROL = ['off', 'on']
const CROSS_ORIGIN_EMBEDDER_POLICY = [
  'require-corp',
  'unsafe-none',
  'credentialless'
]
const CROSS_ORIGIN_OPENER_POLICY = [
  'same-origin',
  'same-origin-allow-popups',
  'unsafe-none'
]
const CROSS_ORIGIN_RESOURCE_POLICY = [
  'same-origin',
  'same-site',
  'cross-origin'
]

const includes = (allowed, value) => value && allowed.includes(value)

/**
 * @typedef {object} CspOptions
 * @property {boolean} [omitDefaults] if `true` CspOptions are not patched with CSP_DEFAULTS
 * @property {boolean} [reportOnly] if `true` csp is only reported but not blocked
 * @property {string|string[]} [connect-src]
 * @property {string|string[]} [default-src]
 * @property {string|string[]} [font-src]
 * @property {string|string[]} [frame-src]
 * @property {string|string[]} [img-src]
 * @property {string|string[]} [manifest-src]
 * @property {string|string[]} [media-src]
 * @property {string|string[]} [object-src]
 * @property {string|string[]} [prefetch-src]
 * @property {string|string[]} [script-src]
 * @property {string|string[]} [script-src-elem]
 * @property {string|string[]} [script-src-attr]
 * @property {string|string[]} [style-src]
 * @property {string|string[]} [style-src-elem]
 * @property {string|string[]} [style-src-attr]
 * @property {string|string[]} [worker-src]
 * @property {string|string[]} [base-uri]
 * @property {string|string[]} [sandbox]
 * @property {string|string[]} [form-action]
 * @property {string|string[]} [frame-ancestors]
 * @property {string|string[]} [navigate-to]
 * @property {string} [report-to]
 * @property {string} [report-uri]
 * @property {string|string[]} [require-trusted-types-for]
 * @property {string|string[]} [trusted-types]
 * @property {boolean} [upgrade-insecure-requests]
 */

const CSP_KEYWORDS = [
  'none',
  'self',
  'nonce',
  'strict-dynamic',
  'report-sample',
  'unsafe-inline',
  'unsafe-eval',
  'unsafe-hashes',
  'unsafe-allow-redirects'
]

const CSP_DIRECTIVES = {
  // fetch directives
  'default-src': ['self'],
  'connect-src': [],
  'font-src': ['self', 'https:', 'data:'],
  'frame-src': [],
  'img-src': ['self', 'data:'],
  'manifest-src': [],
  'media-src': [],
  'object-src': ['none'],
  'prefetch-src': [], // experimental
  'script-src': ['self'],
  'script-src-elem': [],
  'script-src-attr': ['none'],
  'style-src': ['self', 'unsafe-inline', 'https:'],
  'style-src-elem': [],
  'style-src-attr': [],
  'worker-src': [],
  // document directives
  'base-uri': ['self'],
  sandbox: [],
  // navigation directives
  'form-action': ['self'],
  'frame-ancestors': ['self'],
  'navigate-to': '', // experimental
  // reporting directives
  'report-to': '',
  'report-uri': '',
  // other directives
  'require-trusted-types-for': [], // experimental
  'trusted-types': [], // experimental
  'upgrade-insecure-requests': true
}

const quoteKeyword = (value) =>
  CSP_KEYWORDS.includes(value) ? `'${value}'` : value

/**
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy
 * @see https://report-uri.com/home/generate
 * @param {CspOptions|{}} [options]
 * @returns {string}
 */
export const buildCsp = (options = {}) => {
  const builder = []
  for (const [directive, defaults] of Object.entries(CSP_DIRECTIVES)) {
    const parts = []
    let values =
      // @ts-expect-error
      options[directive] ?? (options?.omitDefaults ? undefined : defaults)
    // default-src must be present
    if (directive === 'default-src' && !values) {
      values = "'self'"
    }
    const isArray = Array.isArray(values)
    if (isArray && values.length) {
      parts.push(directive)
      values.forEach((value) => {
        parts.push(quoteKeyword(value))
      })
    } else if (!isArray && values) {
      parts.push(directive)
      if (typeof values === 'string') {
        parts.push(quoteKeyword(values))
      }
    }
    if (parts.length) {
      builder.push(parts.join(' '))
    }
  }
  return builder.join('; ')
}

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
export function contentSec(options) {
  const {
    extensions = ['', '.html', '.htm'],
    csp = { reportOnly: false },
    referrerPolicy = 'no-referrer',
    xContentTypeOptions = true,
    xDnsPrefetchControl = 'off',
    crossOriginEmbedderPolicy = 'require-corp',
    crossOriginOpenerPolicy = 'same-origin',
    crossOriginResourcePolicy = 'same-origin',
    hsts
  } = options || {}

  const cspReportOnly = csp && csp.reportOnly
  if (cspReportOnly && !csp['report-uri']) {
    throw new Error('cspReportOnly needs report-uri')
  }

  let cspNonce

  const headers = {}
  if (csp) {
    const cspHeaderValue = buildCsp(csp)

    const cspHeaderName = cspReportOnly
      ? 'content-security-policy-report-only'
      : 'content-security-policy'

    if (cspHeaderValue.includes("'nonce'")) {
      cspNonce = setCspNonce(cspHeaderName, cspHeaderValue)
    } else {
      headers[cspHeaderName] = cspHeaderValue
    }
  }

  if (includes(REFERRER_POLICY, referrerPolicy)) {
    headers['referrer-policy'] = referrerPolicy
  }
  if (xContentTypeOptions) {
    headers['x-content-type-options'] = 'nosniff'
  }
  if (includes(X_DNS_PREFETCH_CONTROL, xDnsPrefetchControl)) {
    headers['x-dns-prefetch-control'] = xDnsPrefetchControl
  }
  if (includes(CROSS_ORIGIN_EMBEDDER_POLICY, crossOriginEmbedderPolicy)) {
    headers['cross-origin-embedder-policy'] = crossOriginEmbedderPolicy
  }
  if (includes(CROSS_ORIGIN_OPENER_POLICY, crossOriginOpenerPolicy)) {
    headers['cross-origin-opener-policy'] = crossOriginOpenerPolicy
  }
  if (includes(CROSS_ORIGIN_RESOURCE_POLICY, crossOriginResourcePolicy)) {
    headers['cross-origin-resource-policy'] = crossOriginResourcePolicy
  }

  const strictTransportSecurity = buildHsts(hsts)

  return function cspMw(req, res, next) {
    setPath(req, req.path || new URL(req.url, 'local://').pathname)
    const ext = extname(req.path || '')

    if (extensions.includes(ext)) {
      for (const [name, value] of Object.entries(headers)) {
        res.setHeader(name, value)
      }
      cspNonce && cspNonce(res)
    }
    if (strictTransportSecurity && isHttpsProto(req)) {
      res.setHeader('strict-transport-security', strictTransportSecurity)
    }

    next()
  }
}

/**
 * Middleware adding various security headers to json responses.
 * @see https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#security-headers
 * @param {CspMiddlewareOptions} [options]
 * @returns {HandlerCb}
 */
export function contentSecJson(options) {
  const _options = {
    extensions: ['', '.json'],
    csp: {
      omitDefaults: true,
      'frame-ancestors': ['none'],
      'upgrade-insecure-requests': true
    },
    referrerPolicy: false,
    xDnsPrefetchControl: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: false,
    ...options
  }
  // @ts-expect-error
  return contentSec(_options)
}

const log = logger(':csp-violation')

/**
 * Parse and log csp violation
 * @returns {HandlerCb}
 */
export function cspReport() {
  return connect(
    bodyParser.json({ typeJson: 'application/csp-report' }),
    (req, res) => {
      log.warn(req.body)
      send(res, '', 204)
    }
  )
}

const setCspNonce = (headerName, headerValue) => (res) => {
  const nonce = random64(16, true)
  res.locals = res.locals || {}
  res.locals.nonce = nonce
  const value = headerValue.replaceAll("'nonce'", `'nonce-${nonce}'`)
  res.setHeader(headerName, value)
}
