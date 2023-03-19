import assert from 'node:assert'
import supertest from 'supertest'
import { buildCsp } from '../../src/middleware/contentSec.js'
import { Router, contentSec, contentSecJson, cspReport, response } from '../../src/index.js'
import { shouldHaveHeaders } from '../support/index.js'

const { send } = response

describe('middleware/csp', function () {
  describe('buildCsp', function () {
    it('shall build csp header value with defaults', function () {
      const result = buildCsp()
      assert.equal(result, "default-src 'self'; font-src 'self' https: data:; img-src 'self' data:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https:; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests")
    })

    it('shall build csp header value from options', function () {
      const result = buildCsp({
        'default-src': '*',
        'script-src': '*',
        'script-src-elem': '*',
        'style-src': '*',
        'img-src': '*',
        'font-src': '*',
        'connect-src': '*',
        'media-src': '*',
        'object-src': '*',
        'prefetch-src': '*',
        'child-src': '*',
        'frame-src': '*',
        'worker-src': '*',
        'frame-ancestors': '*',
        'form-action': '*',
        'block-all-mixed-content': true, // deprecated
        sandbox: ['allow-forms', 'allow-same-origin', 'allow-scripts', 'allow-top-navigation', 'allow-popups', 'allow-pointer-lock'],
        'base-uri': '*',
        'manifest-src': '*',
        'report-uri': '/csp-report',
        'report-to': 'abcd',
        'upgrade-insecure-requests': false
      })
      assert.equal(result, "default-src *; connect-src *; font-src *; frame-src *; img-src *; manifest-src *; media-src *; object-src *; prefetch-src *; script-src *; script-src-elem *; script-src-attr 'none'; style-src *; worker-src *; base-uri *; sandbox allow-forms allow-same-origin allow-scripts allow-top-navigation allow-popups allow-pointer-lock; form-action *; frame-ancestors *; report-to abcd; report-uri /csp-report")
    })

    it('shall force default-src being set', function () {
      const result = buildCsp({
        'default-src': '',
        'font-src': '',
        'img-src': '',
        'object-src': '',
        'script-src': '',
        'script-src-attr': '',
        'style-src': '',
        'base-uri': '',
        'form-action': '',
        'frame-ancestors': '',
        'upgrade-insecure-requests': false
      })
      assert.equal(result, "default-src 'self'")
    })
  })

  describe('contentSec', function () {
    const end = (req, res) => send(res)

    it('should apply default security headers', function () {
      const app = new Router()
      app.get('/', contentSec(), end)
      return supertest(app.handle)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '0',
          'content-security-policy': "default-src 'self'; font-src 'self' https: data:; img-src 'self' data:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https:; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests",
          'cross-origin-embedder-policy': 'require-corp',
          'cross-origin-opener-policy': 'same-origin',
          'cross-origin-resource-policy': 'same-origin',
          'referrer-policy': 'no-referrer',
          'x-content-type-options': 'nosniff',
          'x-dns-prefetch-control': 'off'
        }))
    })

    it('should not apply default security headers for .js files', function () {
      const app = new Router()
      app.get('/*', contentSec(), end)
      return supertest(app.handle)
        .get('/index.js')
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '0'
        }))
    })

    it('should apply default security headers if used with TLS', function () {
      const app = new Router()
      app.get('/',
        (req, res, next) => {
          req.headers['x-forwarded-proto'] = 'https'
          next()
        },
        contentSec(),
        end)
      return supertest(app.handle)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '0',
          'content-security-policy': "default-src 'self'; font-src 'self' https: data:; img-src 'self' data:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https:; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests",
          'cross-origin-embedder-policy': 'require-corp',
          'cross-origin-opener-policy': 'same-origin',
          'cross-origin-resource-policy': 'same-origin',
          'referrer-policy': 'no-referrer',
          'strict-transport-security': 'max-age=15552000; includeSubDomains',
          'x-content-type-options': 'nosniff',
          'x-dns-prefetch-control': 'off'
        }))
    })

    it('should disable all headers', function () {
      const app = new Router()
      app.get('/',
        (req, res, next) => {
          req.headers['x-forwarded-proto'] = 'https'
          next()
        },
        contentSec({
          csp: false,
          hsts: false,
          referrerPolicy: false,
          crossOriginEmbedderPolicy: false,
          crossOriginOpenerPolicy: false,
          crossOriginResourcePolicy: false,
          xContentTypeOptions: false,
          xDnsPrefetchControl: false
        }),
        end)
      return supertest(app.handle)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '0'
        }))
    })

    it('should omit csp defaults', function () {
      const app = new Router()
      app.get('/',
        (req, res, next) => {
          req.headers['x-forwarded-proto'] = 'https'
          next()
        },
        contentSec({
          csp: {
            omitDefaults: true,
            'frame-ancestors': 'none'
          }
        }),
        end)
      return supertest(app.handle)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '0',
          'content-security-policy': "default-src 'self'; frame-ancestors 'none'",
          'cross-origin-embedder-policy': 'require-corp',
          'cross-origin-opener-policy': 'same-origin',
          'cross-origin-resource-policy': 'same-origin',
          'referrer-policy': 'no-referrer',
          'strict-transport-security': 'max-age=15552000; includeSubDomains',
          'x-content-type-options': 'nosniff',
          'x-dns-prefetch-control': 'off'
        }))
    })

    it('should throw if cspReportOnly=true and missing report-uri', function () {
      try {
        contentSec({ csp: { reportOnly: true } })
        assert.ok(false)
      } catch (e) {
        assert.equal(e.message, 'cspReportOnly needs report-uri')
      }
    })

    it('should return content-security-policy-report-only header', function () {
      const app = new Router()
      app.get('/', contentSec({ csp: { reportOnly: true, 'report-uri': '/report-url' } }), end)
      return supertest(app.handle)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '0',
          'content-security-policy-report-only': "default-src 'self'; font-src 'self' https: data:; img-src 'self' data:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https:; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; report-uri /report-url; upgrade-insecure-requests",
          'cross-origin-embedder-policy': 'require-corp',
          'cross-origin-opener-policy': 'same-origin',
          'cross-origin-resource-policy': 'same-origin',
          'referrer-policy': 'no-referrer',
          'x-content-type-options': 'nosniff',
          'x-dns-prefetch-control': 'off'
        }))
    })

    it('shall apply script nonces', function () {
      const app = new Router()
      app.get('/*',
        contentSec({
          csp: {
            omitDefaults: true,
            'script-src': ['nonce', 'strict-dynamic']
          }
        }),
        (req, res) => send(res, res.locals)
      )
      return supertest(app.handle)
        .get('/')
        .expect(200)
        .then(({ body, headers }) => {
          assert.equal(typeof body.nonce, 'string')
          assert.equal(
            headers['content-security-policy'].replaceAll(body.nonce, '***'),
            "default-src 'self'; script-src 'nonce-***' 'strict-dynamic'"
          )
        })
    })
  })

  describe('contentSecJson', function () {
    const end = (req, res) => send(res)

    it('should apply default security headers', function () {
      const app = new Router()
      app.get('/', contentSecJson(), end)
      return supertest(app.handle)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '0',
          'content-security-policy': "default-src 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
          'x-content-type-options': 'nosniff'
        }))
    })
  })

  describe('hsts', function () {
    const end = (req, res) => send(res)

    it('should apply HSTS security headers for .js files', function () {
      const app = new Router()
      app.get('/*', contentSec(), end)
      return supertest(app.handle)
        .get('/index.js?v=1')
        .set({ 'x-forwarded-proto': 'https' })
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '0',
          'strict-transport-security': 'max-age=15552000; includeSubDomains'
        }))
    })

    it('should not set HSTS if maxAge=0', function () {
      const app = new Router()
      app.get('/',
        (req, res, next) => {
          req.headers['x-forwarded-proto'] = 'https'
          next()
        },
        contentSec({
          csp: false,
          hsts: { maxAge: 0 },
          referrerPolicy: false,
          crossOriginEmbedderPolicy: false,
          crossOriginOpenerPolicy: false,
          crossOriginResourcePolicy: false,
          xContentTypeOptions: false,
          xDnsPrefetchControl: false
        }),
        end)
      return supertest(app.handle)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '0'
        }))
    })

    it('should set HSTS maxAge and preload', function () {
      const app = new Router()
      app.get('/',
        (req, res, next) => {
          req.headers['x-forwarded-proto'] = 'https'
          next()
        },
        contentSec({
          csp: false,
          hsts: { maxAge: 7200, preload: true },
          referrerPolicy: false,
          crossOriginEmbedderPolicy: false,
          crossOriginOpenerPolicy: false,
          crossOriginResourcePolicy: false,
          xContentTypeOptions: false,
          xDnsPrefetchControl: false
        }),
        end)
      return supertest(app.handle)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '0',
          'strict-transport-security': 'max-age=7200; preload'
        }))
    })
  })

  describe('cspReport', function () {
    it('shall report a csp violation', function (done) {
      class Log {
        warn (arg) {
          this._log = arg
        }
      }
      const log = new Log()
      const app = new Router()
      app.post('/csp-report', cspReport({ log }))

      const cspViolation = {
        'csp-report': {
          'blocked-uri': 'http://localhost/css/style.css',
          disposition: 'enforce',
          'document-uri': 'http://localhost/',
          'effective-directive': 'style-src-elem',
          'original-policy': "default-src 'self'; script-src-elem 'unsafe-inline'; style-src 'unsafe-inline'; report-uri http://localhost/csp-report",
          referrer: '',
          'status-code': 200,
          'violated-directive': 'style-src-elem'
        }
      }

      supertest(app.handle)
        .post('/csp-report')
        .set('content-type', 'application/csp-report')
        .send(JSON.stringify(cspViolation))
        .expect(204, '')
        .then(() => {
          assert.deepEqual(log._log, cspViolation)
          done()
        })
    })
  })
})
