import assert from 'node:assert'
import zlib from 'node:zlib'
import crypto from 'node:crypto'
import { Transform } from 'node:stream'
import supertest from 'supertest'
import { Router } from '../../src/index.js'
import { compress } from '../../src/middleware/compress.js'
import { bytes } from '../../src/utils/index.js'
import { nap, shouldHaveSomeHeaders } from '../support/index.js'
import { HttpClient } from '../support/HttpClient.js'
import { Http2Client } from '../support/Http2Client.js'

// eslint-disable-next-line no-unused-vars
const printHeaders = ({ headers }) => console.log(headers)

const ST_OPTS = { http2: true }

const after = (cnt, done) => () => {
  if (--cnt <= 0) {
    done()
  }
}

describe('middleware/compress', function () {
  let app
  before(function () {
    app = createApp({ threshold: 0 })
  })

  it('shall gzip compress HTTP/1', async function () {
    await supertest(app.handle)
      .get('/')
      .set('accept-encoding', 'gzip')
      .expect(200, 'hi, there')
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-encoding': 'gzip',
          'content-length': false,
          'transfer-encoding': 'chunked',
          vary: 'accept-encoding'
        })
      )
  })

  it('shall gzip compress HTTP/2', async function () {
    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip')
      .expect(200, 'hi, there')
      // .expect(printHeaders)
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-encoding': 'gzip',
          'content-length': false,
          'transfer-encoding': false,
          vary: 'accept-encoding'
        })
      )
  })

  it('shall deflate compress', async function () {
    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'deflate')
      .expect(200, 'hi, there')
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-encoding': 'deflate',
          'content-length': false,
          vary: 'accept-encoding'
        })
      )
  })

  it('shall compress using write()', async function () {
    const large = (fill = 'a', len = 100) =>
      Array(len).fill(fill).join('') + '\n'

    const exp = '012345678abcdefghi'
      .split('')
      .map((c) => large(c))
      .join('')

    const app = createApp(undefined, (req, res) => {
      res.setHeader('content-type', 'text/plain')
      for (const char of '012345678abcdefgh'.split('')) {
        res.write(large(char))
      }
      res.end(large('i'))
    })
    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip, deflate')
      .expect(200, exp)
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-encoding': 'gzip',
          'content-length': false,
          vary: 'accept-encoding'
        })
      )
  })

  it('shall compress large response', async function () {
    const len = bytes('1Mb')
    const buf = Buffer.alloc(len, '-')
    const app = createApp({}, (req, res) => {
      res.setHeader('content-type', 'text/plain')
      res.end(buf)
    })

    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip')
      .expect(200, buf.toString())
      // .expect(printHeaders)
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-encoding': 'gzip'
        })
      )
  })

  it('shall compress large response in multiple writes', async function () {
    const len = bytes('100kb')
    const buf = Buffer.alloc(len, '-')
    const app = createApp({}, (req, res) => {
      res.setHeader('content-type', 'text/plain')
      for (let i = 0; i < 9; i++) {
        res.write(buf)
      }
      res.end(buf)
    })

    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip')
      .expect(200)
      .expect(({ text }) => {
        assert.equal(text.length, buf.length * 10)
      })
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-encoding': 'gzip'
        })
      )
  })

  it('shall not compress HEAD requests', async function () {
    await supertest(app.handle, ST_OPTS)
      .head('/')
      .set('accept-encoding', 'gzip, deflate')
      .expect(200)
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-encoding': false,
          'transfer-encoding': false,
          vary: 'accept-encoding'
        })
      )
  })

  it('shall not compress below threshold', async function () {
    const app = createApp({ threshold: '1kb' }, (req, res) => {
      res.setHeader('content-type', 'text/plain')
      res.end('hi, there')
    })

    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip, deflate')
      .expect(200)
      // .expect(printHeaders)
      .expect(
        shouldHaveSomeHeaders({
          // 'content-length': '9',
          'content-type': 'text/plain',
          'content-encoding': false,
          vary: 'accept-encoding'
        })
      )
  })

  it('shall not compress for zero length response', async function () {
    const app = createApp({ threshold: '1kb' }, (req, res) => {
      res.setHeader('content-type', 'text/plain')
      res.end()
    })

    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip, deflate')
      .expect(200)
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-length': '0',
          'content-encoding': false,
          'transfer-encoding': false,
          vary: 'accept-encoding'
        })
      )
  })

  it('shall not compress on cache-control no-transform', async function () {
    const app = createApp({ threshold: 0 }, (req, res) => {
      res.setHeader('content-type', 'text/plain')
      res.setHeader('cache-control', 'no-transform')
      res.end('hi, there')
    })

    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip, deflate')
      .expect(200)
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-length': '9',
          'cache-control': 'no-transform',
          'content-encoding': false,
          vary: false
        })
      )
  })

  it('shall not compress with variable length to prevent the BREACH attack', async function () {
    const page = htmlPage()

    const app = createApp({ threshold: 0 }, (req, res) => {
      res.setHeader('content-type', 'text/html')
      res.end(page)
    })

    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip')
      .expect(200)
      .expect(({ text }) => {
        // console.log('%j', text)
        assert.ok(
          text.length > page.length,
          'shall have random spaces appended'
        )
        assert.ok(/^\s+$/.test(text.slice(page.length)))
      })
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/html',
          'content-length': false,
          'content-encoding': 'gzip',
          vary: 'accept-encoding'
        })
      )
  })

  it('shall flush partially written data HTTP/1', function (done) {
    const tx = []
    const rx = []

    const app = createApp({ threshold: 0 }, async (req, res) => {
      res.setHeader('content-type', 'text/event-stream')
      res.setHeader('cache-control', 'no-store')
      for (let i = 0; i < 10; i++) {
        const str = `${i} hello there.`
        tx.push(str)
        res.write(str)
        res.flush()
        await nap(5)
      }
      res.end()
    })

    const onResponse = (res) => {
      const transform = new Transform({
        transform: function (chunk, _encoding, done) {
          rx.push(chunk.toString())
          done()
        }
      })

      let stream = transform
      if (res.headers['content-encoding'] === 'gzip') {
        stream = zlib.createGunzip()
        stream.pipe(transform)
      }

      res.on('data', (chunk) => {
        stream.write(chunk)
      })
      res.on('end', () => {
        assert.deepEqual(rx, tx)
        done()
      })
      res.on('error', (err) => {
        done(err)
      })
    }

    new HttpClient(app.handle)
      .get('/')
      .set({ 'accept-encoding': 'gzip' })
      .response(onResponse)
      .end()
  })

  it('shall flush partially written data HTTP/2', async function () {
    const tx = []

    const app = createApp({ threshold: 0 }, async (req, res) => {
      res.setHeader('content-type', 'text/event-stream')
      res.setHeader('cache-control', 'no-store')
      for (let i = 0; i < 10; i++) {
        const str = `${i} hello there.`
        tx.push(str)
        res.write(str)
        res.flush()
        await nap(5)
      }
      res.end()
    })

    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip')
      .expect(200)
      .expect(({ text }) => {
        assert.equal(text, tx.join(''))
      })
  })

  it('shall always set vary header encoding HTTP/1', async function () {
    const app = createApp()
    await supertest(app.handle)
      .get('/')
      .set('accept-encoding', '') // supertest sets gzip, deflate by default
      .expect(200, 'hi, there')
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-encoding': false,
          'content-length': '9',
          vary: 'accept-encoding'
        })
      )
  })

  it('shall ignore unknown accept encoding HTTP/1', async function () {
    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'fictitious')
      .expect(200, 'hi, there')
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-encoding': false,
          vary: 'accept-encoding'
        })
      )
  })

  it('shall not compress if content encoding is already set', async function () {
    const app = createApp({ threshold: 0 }, (req, res) => {
      res.setHeader('content-encoding', 'x-foo')
      res.setHeader('content-type', 'text/plain')
      res.end('hi, there')
    })

    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip')
      .expect(200, 'hi, there')
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'text/plain',
          'content-encoding': 'x-foo',
          vary: false
        })
      )
  })

  it('should not set vary if content-type does not pass filter', async function () {
    const app = createApp({ threshold: 0 }, (req, res) => {
      res.setHeader('content-type', 'image/png')
      res.end()
    })

    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set('accept-encoding', 'gzip')
      .expect(200)
      .expect(
        shouldHaveSomeHeaders({
          'content-type': 'image/png',
          vary: false
        })
      )
  })

  it('should back-pressure HTTP/1', function (done) {
    let clientRes
    let serverRes
    const cb = after(2, done)
    const getRandomBytes = () => {
      const buf = new Uint8Array(65535)
      crypto.getRandomValues(buf)
      return buf
    }

    function pressure() {
      if (!clientRes || !serverRes) {
        return
      }
      while (serverRes.write(getRandomBytes()) !== false) {
        serverRes.flush()
      }
      clientRes.resume()
    }

    const app = createApp({ threshold: 0 }, (req, res) => {
      serverRes = res
      res.setHeader('content-type', 'text/plain')
      res.write('start')
      res.on('drain', function () {
        assert.ok(res.write('end') !== false)
        res.end()
      })
      res.on('finish', cb)
      pressure()
    })

    const onResponse = (res) => {
      clientRes = res
      res.on('end', cb)
      res.on('error', done)
      res.pause()
      pressure()
    }

    new HttpClient(app.handle).get('/').response(onResponse).end()
  })

  it('should back-pressure with gzip HTTP/1', function (done) {
    let clientRes
    let serverRes
    const cb = after(2, done)
    const getRandomBytes = () => {
      const buf = new Uint8Array(65535)
      crypto.getRandomValues(buf)
      return buf
    }

    function pressure() {
      if (!clientRes || !serverRes) {
        return
      }
      while (serverRes.write(getRandomBytes()) !== false) {
        serverRes.flush()
      }
      clientRes.resume()
    }

    const app = createApp({ threshold: 0 }, (req, res) => {
      serverRes = res
      res.setHeader('content-type', 'text/plain')
      res.on('drain', function () {
        assert.ok(res.write('end') !== false)
        res.end()
      })
      res.on('finish', cb)
      res.write('start')
      pressure()
    })

    const onResponse = (res) => {
      clientRes = res
      res.on('end', cb)
      res.on('error', done)
      res.pause()
      pressure()
    }

    new HttpClient(app.handle)
      .get('/')
      .set({ 'accept-encoding': 'gzip' })
      .response(onResponse)
      .end()
  })

  it('should back-pressure HTTP/2', function (done) {
    let serverRes
    const cb = after(2, done)
    const getRandomBytes = () => {
      const buf = new Uint8Array(65535)
      crypto.getRandomValues(buf)
      return buf
    }

    function pressure() {
      if (!clientRes || !serverRes) {
        return
      }
      while (serverRes.write(getRandomBytes()) !== false) {
        serverRes.flush()
      }
      clientRes.resume()
    }

    const app = createApp({ threshold: 0 }, (req, res) => {
      serverRes = res
      res.setHeader('content-type', 'text/plain')
      res.on('drain', function () {
        assert.ok(res.write('end') !== false)
        res.end()
      })
      res.on('finish', cb)
      res.write('start')
      pressure()
    })

    const res = new Http2Client(app.handle)
      .get('/')
      .set({ 'accept-encoding': 'br' })
      .request()
      .end()

    const clientRes = res
    // res.on('data', (_chunk) => {
    //   console.log('data:rx', _chunk)
    // })
    res.on('end', cb)
    res.on('error', done)
    res.pause()
    pressure()
  })
})

function createApp(options, fn) {
  const app = new Router()
  app.use(compress(options))
  app.postHook((err, req, res, _next) => {
    console.error(err)
    res.statusCode = 500
    res.end()
  })
  app.all(
    '/',
    fn ||
      ((req, res) => {
        // console.log(req.headers)
        res.setHeader('content-type', 'text/plain')
        res.end('hi, there')
      })
  )
  return app
}

const htmlPage = ({ canary = '' } = {}) => `<!doctype html>
<html class="no-js" lang="">

<head>
  <meta charset="utf-8">
  <title></title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <meta property="og:title" content="">
  <meta property="og:type" content="">
  <meta property="og:url" content="">
  <meta property="og:image" content="">

  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/icon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="icon.png">

  <link rel="stylesheet" href="css/normalize.css">
  <link rel="stylesheet" href="css/style.css">

  <meta name="theme-color" content="#fafafa">
</head>

<body>

  <h1>Works</h1>

  <form>
    <input type="text" name="token" value="b3782f08-f4e2-4769-a740-666b70ba0f7e">
    <input type="text" name="canary" value="${canary}">
  </form>

</body>

</html>
`
