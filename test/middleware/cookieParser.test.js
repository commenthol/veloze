import assert from 'assert'
import supertest from 'supertest'
import sinon from 'sinon'
import { Router, cookieParser, send } from '../../src/index.js'

describe('middleware/cookieParser', function () {
  let app
  before(function () {
    app = new Router()
    app.use(send)
    app.get('/cookie',
      cookieParser,
      (req, res) => {
        res.send(req.cookies)
      }
    )
    app.get('/*',
      cookieParser,
      (req, res) => {
        res.cookie('wat', 'man', { domain: '*.foo.bar', path: '/folder' })
        res.cookie('ho', 'ho', { maxAge: 3600e3 })
        res.clearCookie('foo')
        res.send(req.cookies)
      })
  })

  before(function () {
    this.clock = sinon.useFakeTimers(new Date('2020-12-25T00:00:00Z'))
  })
  after(function () {
    this.clock.restore()
  })

  it('shall parse cookies, set and clear cookie in response', function () {
    return supertest(app.handle)
      .get('/')
      .set({ cookie: 'foo=bar; test=1' })
      .expect({ foo: 'bar', test: '1' })
      .then(({ headers, body }) => {
        // console.log({ headers, body })
        assert.deepEqual(headers['set-cookie'], [
          'wat=man; Domain=*.foo.bar; Path=/folder; HttpOnly; SameSite=Lax',
          'ho=ho; Max-Age=3600; Path=/; Expires=Fri, 25 Dec 2020 01:00:00 GMT; HttpOnly; SameSite=Lax',
          'foo=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax'
        ])
        assert.deepEqual(body, { foo: 'bar', test: '1' })
      })
  })

  it('shall add req.cookies object', function () {
    return supertest(app.handle)
      .get('/cookie')
      .expect(200, {})
  })
})
