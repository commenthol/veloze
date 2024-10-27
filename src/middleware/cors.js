import { vary } from '../response/index.js'
import { isProdEnv } from '../utils/index.js'

/**
 * @typedef { import('#types.js').Request } Request
 * @typedef { import('#types.js').Response } Response
 * @typedef { import('#types.js').HandlerCb } HandlerCb
 *
 * @typedef {(string|RegExp|((req: Request) => boolean))} Origin
 *
 * @typedef {object} CorsOptions
 * @property {boolean} [preflightContinue=false] if `true` next middleware is called instead of responding the request
 * @property {Origin|Origin[]} [origin=/^http:\/\/(localhost|127\.0\.0\.1)(:\d{2,5}|)$/] list of allowed origins
 * @property {string} [methods='GET,HEAD,PUT,PATCH,POST,DELETE'] comma separated list of allowed methods
 * @property {boolean} [credentials=false] if `true` allow requests to send cookies, authorization headers, or TLS client certificates
 * @property {string} [headers] list any number of allowed headers, separated by commas
 * @property {string} [exposeHeaders] list of comma-separated header names that clients are allowed to access from a response.
 * @property {number} [maxAge] caching max-age in seconds. Is set to 7200 (2h) for NODE_ENV !== development
 */

const DEFAULTS = {
  origin: /^https?:\/\/(localhost|127\.0\.0\.1)(:\d{2,5}|)$/,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  credentials: false,
  maxAge: isProdEnv ? 7200 : undefined
}

/**
 * @param {any} any
 * @returns {string}
 */
const type = (any) => toString.call(any).slice(8, -1)

/**
 * @param {Request} req
 * @param {Origin|Origin[]} origin
 * @param {string} [reqOrigin]
 * @returns {boolean}
 */
const isOriginAllowed = (req, origin, reqOrigin) => {
  switch (type(origin)) {
    case 'String':
      return origin === reqOrigin
    case 'RegExp':
      // @ts-expect-error
      return origin.test(reqOrigin)
    case 'Function':
      // @ts-expect-error
      return !!origin(req)
    case 'Array':
      // @ts-expect-error
      for (let i = 0; i < origin.length; i += 1) {
        if (isOriginAllowed(req, origin[i], reqOrigin)) {
          return true
        }
      }
      return false
    default:
      return false
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {Origin|Origin[]} origin
 */
const accessControlAllowOriginHeader = (req, res, origin) => {
  const reqOrigin = req.headers.origin
  if (!origin || origin === '*') {
    res.setHeader('access-control-allow-origin', '*')
    return
  }
  if (reqOrigin && isOriginAllowed(req, origin, reqOrigin)) {
    res.setHeader('access-control-allow-origin', reqOrigin)
    vary(res, 'origin')
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {string} methods
 */
const accessControlAllowMethodsHeader = (req, res, methods) => {
  res.setHeader('access-control-allow-methods', methods)
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {boolean} credentials
 */
const accessControlAllowCredentialsHeader = (req, res, credentials) => {
  if (credentials === true) {
    res.setHeader('access-control-allow-credentials', 'true')
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {string} [allowedHeaders]
 */
const accessControlAllowHeaders = (req, res, allowedHeaders) => {
  let allowed = allowedHeaders
  if (!allowedHeaders) {
    allowed = req.headers['access-control-request-headers']
    if (allowed) {
      vary(res, 'access-control-request-headers')
    }
  }
  if (allowed) {
    res.setHeader('access-control-allow-headers', allowed)
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {string} [exposeHeaders]
 */
const accessControlExposedHeaders = (req, res, exposeHeaders) => {
  if (exposeHeaders) {
    res.setHeader('access-control-expose-headers', exposeHeaders)
  }
}

/**
 * @param {Request} req
 * @param {Response} res
 * @param {number} [maxAge]
 */
const accessControlMaxAgeHeader = (req, res, maxAge) => {
  if (typeof maxAge === 'number') {
    res.setHeader('access-control-max-age', maxAge)
  }
}

/**
 * Middleware to handle [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
 * preflight and CORS response headers for different origins.
 *
 * @param {CorsOptions} options
 * @returns {HandlerCb}
 */
export function cors(options = {}) {
  const {
    preflightContinue,
    origin,
    methods,
    credentials,
    headers,
    exposeHeaders,
    maxAge
  } = {
    ...DEFAULTS,
    ...options
  }

  return function corsMw(req, res, next) {
    if (req.method === 'OPTIONS') {
      accessControlAllowOriginHeader(req, res, origin)
      accessControlAllowMethodsHeader(req, res, methods)
      accessControlAllowCredentialsHeader(req, res, credentials)
      accessControlAllowHeaders(req, res, headers)
      accessControlExposedHeaders(req, res, exposeHeaders)
      accessControlMaxAgeHeader(req, res, maxAge)

      if (preflightContinue) {
        next()
      } else {
        // browsers want to see content-length=0 with status=204
        res.statusCode = 204
        res.setHeader('content-length', '0')
        res.end()
      }
      return
    }

    accessControlAllowOriginHeader(req, res, origin)
    accessControlAllowCredentialsHeader(req, res, credentials)
    accessControlExposedHeaders(req, res, exposeHeaders)

    next()
  }
}
