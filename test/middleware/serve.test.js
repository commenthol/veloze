import assert from 'node:assert/strict'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import supertest from 'supertest'
import { serve, Server, Router } from '../../src/index.js'
import { shouldHaveSomeHeaders } from '../support/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const ST_OPTS = { http2: true }

describe('middleware/serve', () => {
  const rootPath = path.join(__dirname, './fixtures')
  let app
  before(function () {
    app = new Router()
    app.use('/*', serve(rootPath))
  })

  it('should throw TypeError if root path is not provided', () => {
    assert.throws(() => {
      serve()
    }, TypeError)
  })

  it('should throw TypeError if root path is not a string', () => {
    assert.throws(() => {
      serve(123)
    }, TypeError)
  })

  it('should throw TypeError if index contains non-string items', () => {
    assert.throws(() => {
      serve(rootPath, { index: 123 })
    }, TypeError)
  })

  it('should serve a file if it exists in the root path', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/a.txt')
      .expect(200, 'a text\n')
      .expect(shouldHaveSomeHeaders({
        'content-type': 'text/plain; charset=utf-8',
        etag: /^W\/"/,
        'content-length': '7',
        vary: 'accept-encoding'
      }))
  })

  it('should serve a json file gzip compressed', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/test.json')
      .set({ 'accept-encoding': 'gzip, deflate' })
      .expect(200)
      // .then(console.log)
      .expect(({ text }) => {
        assert.equal(text.slice(0, 30), '{\n  "name": "veloze",\n  "versi')
      })
      .expect(shouldHaveSomeHeaders({
        etag: /^W\/"/,
        'content-type': 'application/json; charset=utf-8',
        'content-encoding': 'gzip',
        vary: 'accept-encoding'
      }))
  })

  it('should serve a json file deflate compressed', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/test.json')
      .set({ 'accept-encoding': 'deflate' })
      .expect(200)
      .expect(({ text }) => {
        assert.equal(text.slice(0, 30), '{\n  "name": "veloze",\n  "versi')
      })
      .expect(shouldHaveSomeHeaders({
        etag: /^W\/"/,
        'content-type': 'application/json; charset=utf-8',
        'content-encoding': 'deflate',
        vary: 'accept-encoding'
      }))
  })

  it('should not serve hidden files', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/.hidden')
      .expect(404)
  })

  it('should not serve unknown files', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/this-path/is-not-there')
      .expect(404)
  })

  it('should serve a file with 304', async () => {
    const { headers } = await supertest(app.handle, ST_OPTS)
      .get('/a.txt')
      .expect(200, 'a text\n')
      .expect(shouldHaveSomeHeaders({
        etag: /^W\/"/
      }))
    await supertest(app.handle, ST_OPTS)
      .get('/a.txt')
      .set('if-none-match', headers.etag)
      .expect(304)
  })

  it('should serve HEAD request', async () => {
    await supertest(app.handle, ST_OPTS)
      .head('/a.txt')
      .expect(200)
      .expect(shouldHaveSomeHeaders({
        etag: /^W\/"/
      }))
  })

  it('should serve a file by range "bytes=4-"', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/a.txt')
      .set({ range: 'bytes=4-' })
      .expect(206, 'xt\n')
      .expect(shouldHaveSomeHeaders({
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '3',
        'content-range': 'bytes 4-7/7',
        etag: /^W\/"/
      }))
  })

  it('should serve a file by range "bytes=-3"', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/a.txt')
      .set({ range: 'bytes=-3' })
      .expect(206, 'xt\n')
      .expect(shouldHaveSomeHeaders({
        'content-type': 'text/plain; charset=utf-8',
        'content-length': '3',
        'content-range': 'bytes 4-7/7',
        etag: /^W\/"/
      }))
  })

  it('should fail to serve a file by range "bytes=-10"', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/a.txt')
      .set({ range: 'bytes=-10' })
      .expect(416)
      .expect(shouldHaveSomeHeaders({
        'content-range': 'bytes */7'
      }))
  })

  it('should send 405 status if method is not GET or HEAD and fallthrough is false', async () => {
    await supertest(app.handle, ST_OPTS)
      .post('/a.txt')
      .expect(405)
      .expect(shouldHaveSomeHeaders({
        allow: 'GET, HEAD'
      }))
  })

  it('should disallow path traversal relative to root', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/../../a.txt')
      .expect(200)
  })

  it('should redirect to index.html', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/a')
      .redirects(2)
      .expect(200)
      .expect(shouldHaveSomeHeaders({
        'content-length': '47',
        'content-type': 'text/html; charset=utf-8'
      }))
  })

  it('should use an URL as root', async () => {
    const app = new Server({ onlyHTTP1: true, gracefulTimeout: 0 })
    app.use('/*', serve(new URL('./fixtures', import.meta.url)))
    await supertest(app.handle, ST_OPTS)
      .get('/a.txt')
      .expect(200, 'a text\n')
      .expect(shouldHaveSomeHeaders({
        'content-type': 'text/plain; charset=utf-8',
        etag: /^W\/"/,
        'content-length': '7'
      }))
  })

  it('should different index', async () => {
    const app = new Server({ onlyHTTP1: true, gracefulTimeout: 0 })
    app.use('/*', serve(new URL('./fixtures', import.meta.url), { index: 'a.txt' }))
    await supertest(app.handle, ST_OPTS)
      .get('/')
      .expect(200, 'a text\n')
      .expect(shouldHaveSomeHeaders({
        'content-type': 'text/plain; charset=utf-8',
        etag: /^W\/"/,
        'content-length': '7'
      }))
  })

  it('should strip path', async () => {
    const app = new Server({ onlyHTTP1: true, gracefulTimeout: 0 })
    app.use('/static/*', serve(new URL('./fixtures', import.meta.url), { strip: '/static' }))
    await supertest(app.handle, ST_OPTS)
      .get('/static/a.txt')
      .expect(200, 'a text\n')
      .expect(shouldHaveSomeHeaders({
        'content-type': 'text/plain; charset=utf-8',
        etag: /^W\/"/,
        'content-length': '7'
      }))
  })
})
