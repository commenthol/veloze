import supertest from 'supertest'
import { send, sendEtag, connect, Router } from '../../src/index.js'
import { shouldHaveHeaders } from '../support/index.js'

describe('middleware/send', function () {
  describe('send', function () {
    it('res.send', function () {
      const handle = connect(send, (req, res) => {
        res.send('<h1>works</h1>')
      })

      return supertest(handle)
        .get('/')
        .expect(200, '<h1>works</h1>')
        .expect('content-length', '14')
        .expect('content-type', 'text/html; charset=utf-8')
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
      return supertest(handle)
        .get('/')
        .expect(200, '<h1>works</h1>')
        .expect(shouldHaveHeaders({
          'content-length': '14',
          'content-type': 'text/html; charset=utf-8',
          etag: '"KbHPF47xLpMM9by5ECjxj4W2xpg="'
        }))
    })

    it('shall not set etag on status != 200', function () {
      return supertest(handle)
        .get('/404')
        .expect(404, '<h1>ouch</h1>')
        .expect(shouldHaveHeaders({
          'content-length': '13',
          'content-type': 'text/html; charset=utf-8'
        }))
    })

    it('shall return 304', function () {
      return supertest(handle)
        .get('/')
        .set({
          'If-None-Match': '"KbHPF47xLpMM9by5ECjxj4W2xpg="'
        })
        .expect(304, '')
        .expect(shouldHaveHeaders({
          etag: '"KbHPF47xLpMM9by5ECjxj4W2xpg="'
        }))
    })
  })
})
