import supertest from 'supertest'
import { send, sendEtag, connect, Router } from '../../src/index.js'
import { shouldHaveSomeHeaders } from '../support/index.js'

// eslint-disable-next-line no-unused-vars
const printHeaders = ({ headers }) => console.log(headers)

const ST_OPTS = { http2: true }

describe('middleware/send', function () {
  describe('send', function () {
    it('res.send', function () {
      const handle = connect(send, (req, res) => {
        res.send('<h1>works</h1>')
      })

      return supertest(handle, ST_OPTS)
        .get('/')
        .expect(200, '<h1>works</h1>')
        .expect('content-type', 'text/html; charset=utf-8')
        // .expect('content-length', '14') // HTTP2 does not send content-length
    })
  })

  describe('sendEtag', function () {
    let handle
    before(function () {
      const app = new Router()
      handle = app.handle
      app.use(sendEtag())
      app.get('/', (req, res) => {
        res.send('<h1>works</h1>')
      })
      app.get('/404', (req, res) => {
        res.send('<h1>ouch</h1>', 404)
      })
    })

    it('shall set etag', function () {
      return supertest(handle, ST_OPTS)
        .get('/')
        .expect(200, '<h1>works</h1>')
        .expect(shouldHaveSomeHeaders({
          // 'content-length': '14',
          'content-type': 'text/html; charset=utf-8',
          etag: '"KbHPF47xLpMM9by5ECjxj4W2xpg="'
        }))
    })

    it('shall not set etag on status != 200', function () {
      return supertest(handle, ST_OPTS)
        .get('/404')
        .expect(404, '<h1>ouch</h1>')
        .expect(shouldHaveSomeHeaders({
          // 'content-length': '13',
          'content-type': 'text/html; charset=utf-8'
        }))
    })

    it('shall return 304', function () {
      return supertest(handle, ST_OPTS)
        .get('/')
        .set({
          'If-None-Match': '"KbHPF47xLpMM9by5ECjxj4W2xpg="'
        })
        .expect(304, '')
        .expect(shouldHaveSomeHeaders({
          etag: '"KbHPF47xLpMM9by5ECjxj4W2xpg="'
        }))
    })
  })
})
