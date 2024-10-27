import assert from 'assert'
import http from 'http'
import https from 'https'
import http2 from 'http2'
import supertest from 'supertest'
import { safeServerShutdown } from '../../src/utils/safeServerShutdown.js'
import { certs } from '../support/index.js'
import { Http2Client } from '../support/Http2Client.js'
import { describeBool } from '../support/describeBool.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms))

const METHODS = [
  'CONNECT',
  'DELETE',
  'GET',
  'HEAD',
  'OPTIONS',
  'PATCH',
  'POST',
  'PUT',
  'SEARCH',
  'TRACE'
]

describeBool(!process.env.CI)('utils/safeServerShutdown', function () {
  describe('http', function () {
    let server
    let start
    let port
    let connectCnt = 0

    const diffTime = () => String(Date.now() - start)

    before(function (done) {
      server = http.createServer((req, res) => {
        connectCnt++
        setTimeout(() => {
          res.end(diffTime())
        }, 50)
      })
      start = Date.now()
      server._log = (...args) => console.log(diffTime(), ...args)
      safeServerShutdown(server, { gracefulTimeout: 50 })
      server.listen(done)
      port = server.address().port
    })

    it('shall gracefully shutdown', async function () {
      const out = []
      const max = 50
      let hasClosed = false

      let _resolve
      const p = new Promise((resolve) => {
        _resolve = resolve
      })

      const pushIt = (value) => {
        if (value instanceof Error) {
          out.push({
            i: out.length,
            value: diffTime(),
            message: value.message
          })
        } else {
          out.push({ i: out.length, value })
        }
        if (out.length === max) {
          _resolve()
        }
      }

      for (let i = 0; i < max; i++) {
        const method = METHODS[i % METHODS.length].toLowerCase()
        supertest('http://localhost:' + port)
          [method]('/')
          .disableTLSCerts()
          .then((res) => res.text)
          .then(pushIt)
          .catch(pushIt)
        await sleep(3)
        // console.log(i, diffTime())
        if (i === 25) {
          server
            .closeAsync()
            .then(() => {
              // console.log(diffTime())
              hasClosed = true
            })
            .catch((err) => {
              assert.ok(!err)
            })
        }
      }

      await p

      // console.log(out)
      assert.ok(hasClosed)
      assert.ok(connectCnt >= 23, connectCnt)
    })
  })

  describe('https', function () {
    let server
    let start
    let port
    let connectCnt = 0

    const diffTime = () => String(Date.now() - start)

    before(function (done) {
      const httpsOptions = certs()
      server = https.createServer(httpsOptions, (req, res) => {
        connectCnt++
        setTimeout(() => {
          res.end(diffTime())
        }, 50)
      })
      start = Date.now()
      server._log = (...args) => console.log(diffTime(), ...args)
      safeServerShutdown(server, { gracefulTimeout: 50 })
      server.listen(done)
      port = server.address().port
    })

    it('shall gracefully shutdown', async function () {
      const out = []
      const max = 50
      let hasClosed = false

      let _resolve
      const p = new Promise((resolve) => {
        _resolve = resolve
      })

      const pushIt = (value) => {
        if (value instanceof Error) {
          out.push({
            i: out.length,
            value: diffTime(),
            message: value.message
          })
        } else {
          out.push({ i: out.length, value })
        }
        if (out.length === max) {
          _resolve()
        }
      }

      for (let i = 0; i < max; i++) {
        const method = METHODS[i % METHODS.length].toLowerCase()
        supertest('https://localhost:' + port)
          [method]('/')
          .disableTLSCerts()
          .then((res) => res.text)
          .then(pushIt)
          .catch(pushIt)

        await sleep(3)
        // console.log(i, diffTime())
        if (i === 25) {
          server.close((err) => {
            // console.log(diffTime())
            hasClosed = true
            assert.ok(!err)
          })
        }
      }

      await p

      // console.log(out)
      assert.ok(hasClosed)
      assert.ok(connectCnt >= 21, connectCnt)
    })
  })

  describe('http2', function () {
    let server
    let start
    let port
    let connectCnt = 0

    const diffTime = () => String(Date.now() - start)

    before(function (done) {
      const httpsOptions = certs()
      server = http2.createSecureServer(httpsOptions, (req, res) => {
        connectCnt++
        setTimeout(() => {
          res.end(diffTime())
        }, 50)
      })
      start = Date.now()
      server._log = (...args) => console.log(diffTime(), ...args)
      safeServerShutdown(server, { gracefulTimeout: 50 })
      server.listen(done)
      port = server.address().port
    })

    it('shall gracefully shutdown', async function () {
      const out = []
      const max = 50
      let hasClosed = false

      let _resolve
      const p = new Promise((resolve) => {
        _resolve = resolve
      })

      const pushIt = (value) => {
        if (value instanceof Error) {
          out.push({
            i: out.length,
            value: diffTime(),
            message: value.message
          })
        } else {
          out.push({ i: out.length, value })
        }
        if (out.length === max) {
          _resolve()
        }
      }

      for (let i = 0; i < max; i++) {
        const method = METHODS[i % METHODS.length]
        new Http2Client('https://localhost:' + port)
          .method(method, '/')
          .disableTLSCerts()
          .then((res) => res.raw.toString())
          .then(pushIt)
          .catch(pushIt)
        await sleep(3)
        // console.log(i, diffTime())
        if (i === 25) {
          server.close((err) => {
            // console.log(diffTime())
            hasClosed = true
            assert.ok(!err)
          })
        }
      }

      await p

      // console.log(out)
      assert.ok(hasClosed)
      assert.ok(connectCnt >= 21, connectCnt)
    })
  })
})
