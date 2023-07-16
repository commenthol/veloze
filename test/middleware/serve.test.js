import assert from 'node:assert/strict'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import supertest from 'supertest'
import { serve, Server } from '../../src/index.js'
import { shouldHaveSomeHeaders } from '../support/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('middleware/serve', () => {
  const rootPath = path.join(__dirname, './fixtures')
  let app
  before(function () {
    app = new Server({ onlyHTTP1: true, gracefulTimeout: 0 })
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
    await supertest(app)
      .get('/a.txt')
      .expect(200, 'a text\n')
      .expect(shouldHaveSomeHeaders({
        'content-type': 'text/plain; charset=utf-8',
        etag: /^W\/"/,
        'content-length': '7'
      }))
  })

  it('should not serve hidden files', async () => {
    await supertest(app)
      .get('/.hidden')
      .expect(404)
  })

  it('should not serve unknown files', async () => {
    await supertest(app)
      .get('/this-path/is-not-there')
      .expect(404)
  })

  it('should serve a file with 304', async () => {
    const { headers } = await supertest(app)
      .get('/a.txt')
      .expect(200, 'a text\n')
      .expect(shouldHaveSomeHeaders({
        etag: /^W\/"/
      }))
    console.log(headers)
    await supertest(app)
      .get('/a.txt')
      .set('if-none-match', headers.etag)
      .expect(304)
  })

  it('should serve HEAD request', async () => {
    await supertest(app)
      .head('/a.txt')
      .expect(200)
      .expect(shouldHaveSomeHeaders({
        etag: /^W\/"/
      }))
  })

  it('should serve a file by range "bytes=4-"', async () => {
    await supertest(app)
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
    await supertest(app)
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
    await supertest(app)
      .get('/a.txt')
      .set({ range: 'bytes=-10' })
      .expect(416)
      .expect(shouldHaveSomeHeaders({
        'content-range': 'bytes */7'
      }))
  })

  it('should send 405 status if method is not GET or HEAD and fallthrough is false', async () => {
    await supertest(app)
      .post('/a.txt')
      .expect(405)
      .expect(shouldHaveSomeHeaders({
        allow: 'GET, HEAD'
      }))
  })

  it('should disallow path traversal relative to root', async () => {
    await supertest(app)
      .get('/../../a.txt')
      .expect(200)
  })

  it('should redirect to index.html', async () => {
    await supertest(app)
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
    await supertest(app)
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
    await supertest(app)
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
    await supertest(app)
      .get('/static/a.txt')
      .expect(200, 'a text\n')
      .expect(shouldHaveSomeHeaders({
        'content-type': 'text/plain; charset=utf-8',
        etag: /^W\/"/,
        'content-length': '7'
      }))
  })
})
