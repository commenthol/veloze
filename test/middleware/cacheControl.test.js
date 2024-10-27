import assert from 'node:assert'
import { cacheControl, cacheControlByMethod } from '../../src/index.js'
import { Request, Response } from '../support/index.js'

const next = () => {}

describe('middleware/cacheControl', function () {
  const req = {}

  describe('cacheControl()', function () {
    it('shall set header with defaults', function () {
      const res = new Response()
      cacheControl()(req, res, next)
      assert.equal(
        res.getHeader('cache-control'),
        'no-cache, no-store, max-age=0'
      )
    })

    it('shall set no-cache, private', function () {
      const res = new Response()
      cacheControl({ private: true, noCache: true })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'no-cache, private')
    })

    it('shall set maxAge with ms', function () {
      const res = new Response()
      cacheControl({ maxAge: '5m' })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'max-age=300')
    })

    it('shall fix negative maxAge', function () {
      const res = new Response()
      cacheControl({ maxAge: '-5m' })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'max-age=0')
    })

    it('shall set maxAge with ms', function () {
      const res = new Response()
      cacheControl({ public: true, sMaxAge: '1d' })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'public, s-maxage=86400')
    })

    it('shall fix negative sMaxAge', function () {
      const res = new Response()
      cacheControl({ sMaxAge: '-5m' })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 's-maxage=0')
    })

    it('shall set noTransform', function () {
      const res = new Response()
      cacheControl({ noTransform: true })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'no-transform')
    })

    it('shall set mustRevalidate', function () {
      const res = new Response()
      cacheControl({ mustRevalidate: true })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'must-revalidate')
    })

    it('shall set proxyRevalidate', function () {
      const res = new Response()
      cacheControl({ proxyRevalidate: true })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'proxy-revalidate')
    })

    it('shall set mustUnderstand', function () {
      const res = new Response()
      cacheControl({ mustUnderstand: true })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'must-understand')
    })

    it('shall set immutable', function () {
      const res = new Response()
      cacheControl({ immutable: true })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'immutable')
    })

    it('shall set staleWhileRevalidate', function () {
      const res = new Response()
      cacheControl({ staleWhileRevalidate: true })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'stale-while-revalidate')
    })

    it('shall set staleIfError', function () {
      const res = new Response()
      cacheControl({ staleIfError: true })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'stale-if-error')
    })
  })

  describe('cacheControlByMethod', function () {
    it('shall set default cache-control for GET', function () {
      const req = new Request()
      const res = new Response()
      cacheControlByMethod()(req, res, next)
      assert.equal(
        res.getHeader('cache-control'),
        'no-cache, no-store, max-age=0'
      )
    })

    it('shall set default cache-control for POST', function () {
      const req = new Request('POST')
      const res = new Response()
      cacheControlByMethod()(req, res, next)
      assert.equal(
        res.getHeader('cache-control'),
        'no-cache, no-store, max-age=0'
      )
    })

    it('with options shall set  cache-control for GET  ', function () {
      const req = new Request()
      const res = new Response()
      cacheControlByMethod({ public: true, maxAge: '1h' })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'public, max-age=3600')
    })

    it('with options shall set no-cache for POST', function () {
      const req = new Request('POST')
      const res = new Response()
      cacheControlByMethod({ public: true, maxAge: '1h' })(req, res, next)
      assert.equal(
        res.getHeader('cache-control'),
        'no-cache, no-store, max-age=0'
      )
    })

    it('with options shall disable no-cache for POST but enable for TRACE', function () {
      const req = new Request('POST')
      const res = new Response()
      cacheControlByMethod({
        public: true,
        maxAge: '2h',
        noCacheMethods: ['TRACE']
      })(req, res, next)
      assert.equal(res.getHeader('cache-control'), 'public, max-age=7200')
    })

    it('with options shall enable no-cache for TRACE', function () {
      const req = new Request('TRACE')
      const res = new Response()
      cacheControlByMethod({
        public: true,
        maxAge: '2h',
        noCacheMethods: ['TRACE']
      })(req, res, next)
      assert.equal(
        res.getHeader('cache-control'),
        'no-cache, no-store, max-age=0'
      )
    })
  })
})
