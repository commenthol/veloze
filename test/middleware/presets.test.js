import supertest from 'supertest'
import { Router, presetHtml, presetJson } from '../../src/index.js'
import { escapeHtmlLit } from '../../src/utils/escapeHtml.js'
import { shouldHaveSomeHeaders } from '../support/index.js'

const ST_OPTS = { http2: true }

describe('middleware/presets', function () {
  describe('presetHtml()', function () {
    let app
    before(function () {
      app = new Router()
      app.use(
        presetHtml({
          cacheControlOpts: {
            public: true,
            maxAge: '1d',
            staleWhileRevalidate: '8h'
          }
        })
      )
      app.all('/', (req, res) => {
        const { method, url, cookies, query, body } = req
        const html = escapeHtmlLit`<h1>works</h1><pre>${JSON.stringify({
          method,
          url,
          cookies,
          query,
          body
        })}</pre>`
        res.send(html)
      })
    })

    it('GET request', function () {
      return supertest(app.handle, ST_OPTS)
        .get('/?foo=bar&test=1')
        .set({ cookie: 'wat=baz' })
        .expect(200)
        .expect(
          '<h1>works</h1><pre>{&quot;method&quot;:&quot;GET&quot;,&quot;url&quot;:&quot;/?foo=bar&amp;test=1&quot;,&quot;cookies&quot;:{&quot;wat&quot;:&quot;baz&quot;},&quot;query&quot;:{&quot;foo&quot;:&quot;bar&quot;,&quot;test&quot;:&quot;1&quot;}}</pre>'
        )
        .expect(
          shouldHaveSomeHeaders({
            // 'content-length': '247',
            'cache-control': 'public, stale-while-revalidate, max-age=86400',
            'content-security-policy':
              "default-src 'self'; font-src 'self' https: data:; img-src 'self' data:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https:; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests",
            'content-type': 'text/html; charset=utf-8',
            'cross-origin-embedder-policy': 'require-corp',
            'cross-origin-opener-policy': 'same-origin',
            'cross-origin-resource-policy': 'same-origin',
            'referrer-policy': 'no-referrer',
            'x-content-type-options': 'nosniff',
            'x-dns-prefetch-control': 'off'
          })
        )
    })

    it('POST request', function () {
      return supertest(app.handle, ST_OPTS)
        .post('/?foo=bar&test=1')
        .set({ cookie: 'wat=baz' })
        .type('form')
        .send({ name: 'alice', age: '23' })
        .expect(200)
        .expect(
          '<h1>works</h1><pre>{&quot;method&quot;:&quot;POST&quot;,&quot;url&quot;:&quot;/?foo=bar&amp;test=1&quot;,&quot;cookies&quot;:{&quot;wat&quot;:&quot;baz&quot;},&quot;query&quot;:{&quot;foo&quot;:&quot;bar&quot;,&quot;test&quot;:&quot;1&quot;},&quot;body&quot;:{&quot;name&quot;:&quot;alice&quot;,&quot;age&quot;:&quot;23&quot;}}</pre>'
        )
        .expect(
          shouldHaveSomeHeaders({
            // 'content-length': '333',
            'cache-control': 'no-cache, no-store, max-age=0',
            'content-security-policy':
              "default-src 'self'; font-src 'self' https: data:; img-src 'self' data:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https:; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests",
            'content-type': 'text/html; charset=utf-8',
            'cross-origin-embedder-policy': 'require-corp',
            'cross-origin-opener-policy': 'same-origin',
            'cross-origin-resource-policy': 'same-origin',
            'referrer-policy': 'no-referrer',
            'x-content-type-options': 'nosniff',
            'x-dns-prefetch-control': 'off'
          })
        )
    })
  })

  describe('presetJson()', function () {
    let app
    before(function () {
      app = new Router()
      app.use(presetJson({ cacheControlOpts: { private: true, maxAge: '5m' } }))
      app.all('/', (req, res) => {
        const { method, url, cookies, query, body } = req
        res.send({ method, url, cookies, query, body })
      })
    })

    it('GET request', function () {
      return supertest(app.handle, ST_OPTS)
        .get('/?foo=bar&test=1')
        .set({ cookie: 'wat=baz' })
        .expect(200)
        .expect({
          method: 'GET',
          url: '/?foo=bar&test=1',
          query: { foo: 'bar', test: '1' }
        })
        .expect(
          shouldHaveSomeHeaders({
            // 'content-length': '74',
            'cache-control': 'private, max-age=300',
            'content-security-policy':
              "default-src 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
            'content-type': 'application/json; charset=utf-8',
            'x-content-type-options': 'nosniff'
          })
        )
    })

    it('POST request', function () {
      return supertest(app.handle, ST_OPTS)
        .post('/?foo=bar&test=1')
        .set({ cookie: 'wat=baz' })
        .type('json')
        .send({ name: 'alice', age: '23' })
        .expect(200)
        .expect({
          method: 'POST',
          url: '/?foo=bar&test=1',
          query: { foo: 'bar', test: '1' },
          body: { name: 'alice', age: '23' }
        })
        .expect(
          shouldHaveSomeHeaders({
            // 'content-length': '110',
            'cache-control': 'no-cache, no-store, max-age=0',
            'content-security-policy':
              "default-src 'self'; frame-ancestors 'none'; upgrade-insecure-requests",
            'content-type': 'application/json; charset=utf-8',
            'x-content-type-options': 'nosniff'
          })
        )
    })
  })
})
