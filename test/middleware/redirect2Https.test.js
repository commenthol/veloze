import assert from 'node:assert'
import { Router, redirect2Https } from '../../src/index.js'
import { Http2Client } from '../support/Http2Client.js'
import { Request, Response } from '../support/index.js'

describe('middleware/redirect2Https', function () {
  it('using http server', function () {
    const app = new Router()
    app.use(redirect2Https({ redirectUrl: 'https://localhost' }))
    app.all('/*', (req, res) => res.end())

    return new Http2Client(app.handle)
      .get('/test')
      .then((res) => {
        assert.equal(res.headers.location, 'https://localhost/test')
        assert.equal(res.status, 308)
      })
  })

  it('shall pass https traffic', function (done) {
    const req = new Request()
    const res = new Response()
    req.socket = { encrypted: true }
    redirect2Https({ redirectUrl: 'https://localhost:8443' })(req, res, () => {
      done()
    })
  })

  it('shall pass https traffic if x-forwarded-proto is set', function (done) {
    const req = new Request('GET', '/', { host: 'localhost', 'x-forwarded-proto': 'https' })
    const res = new Response()
    redirect2Https({ redirectUrl: 'https://localhost:8443' })(req, res, () => {
      done()
    })
  })

  it('shall redirect to https', function () {
    const req = new Request('GET', '/', { host: 'localhost' })
    const res = new Response()
    redirect2Https({ redirectUrl: 'https://localhost:8443' })(req, res)
    assert.strictEqual(res.headers.location, 'https://localhost:8443')
    assert.strictEqual(res.statusCode, 308)
  })

  it('shall redirect to host and url', function () {
    const req = new Request('POST', '/test', { host: 'example.com' })
    const res = new Response()
    redirect2Https({ redirectUrl: 'https://example.com' })(req, res)
    assert.strictEqual(res.headers.location, 'https://example.com/test')
    assert.strictEqual(res.statusCode, 308)
  })

  it('shall always redirect to a defined url', function () {
    const req = new Request('POST', '/test', { host: 'example.com' })
    const res = new Response()
    redirect2Https({ redirectUrl: 'https://foo.bar/other' })(req, res)
    assert.strictEqual(res.headers.location, 'https://foo.bar/other/test')
    assert.strictEqual(res.statusCode, 308)
  })

  it('shall allow to redirect to a known vhost', function () {
    const req = new Request('POST', '/test', { host: 'example.com' })
    const res = new Response()
    redirect2Https({ redirectUrl: 'https://foo.bar/other', allowedHosts: ['example.com'] })(req, res)
    assert.strictEqual(res.headers.location, 'https://example.com/other/test')
    assert.strictEqual(res.statusCode, 308)
  })

  it('shall always redirect to a defined url with 301', function () {
    const req = new Request('GET', '/test', { host: 'example.com' })
    const res = new Response()
    redirect2Https({ redirectUrl: 'https://foo.bar', status: 301 })(req, res)
    assert.strictEqual(res.headers.location, 'https://foo.bar/test')
    assert.strictEqual(res.statusCode, 301)
  })

  it('shall throw if redirect is set to http', function () {
    assert.throws(() => {
      const req = new Request('GET', '/', { host: 'example.com' })
      const res = new Response()
      redirect2Https({ redirectUrl: 'http://foo.bar' })(req, res)
    }, /^Error: redirectUrl needs to use https:\/\/ as protocol/)
  })
})
