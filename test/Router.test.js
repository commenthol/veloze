import assert from 'assert'
import supertest from 'supertest'
import { Router, send } from '../src/index.js'
import { Request, Response, handler, asyncHandler, preHandler } from './support/index.js'

const handleResBodyInit = (req, res, next) => {
  res.body = []
  next()
}

const handleSend = (req, res) => res.send(res.body)

const handleSendParams = (req, res) => res.send(req.params)

describe('Router', function () {
  let app
  before(function () {
    app = new Router()
    app.use(handleResBodyInit, send)
    app.postHook(handleSend)
    app.get('/', handler)
      .get('/async', asyncHandler)
      .post('/', handler)
      .post('/mix', handler, asyncHandler)
      .get('/users', handler, handleSendParams)
      .get('/users/:user', handler, handleSendParams)
      .get('/topics/:topic/books/:book', handleSendParams)
      .all('/wildcard/*', [handler, asyncHandler])
      .get('/wildcard', handler)

    app.print()
  })

  describe('with paths', function () {
    it('shall call callback handler', function () {
      return supertest(app.handle)
        .get('/')
        .expect(200, ['cb: GET /'])
    })

    it('shall call async handler', function () {
      return supertest(app.handle)
        .get('/async')
        .expect(200, ['async: GET /async'])
    })

    it('different method shall resolve to different handlers', function () {
      return supertest(app.handle)
        .post('/')
        .expect(200, ['cb: POST /'])
    })

    it('shall cope with mix of callback and async handlers', function () {
      return supertest(app.handle)
        .post('/mix')
        .expect(200, ['cb: POST /mix', 'async: POST /mix'])
    })

    it('unknown route shall return 404', function () {
      return supertest(app.handle)
        .get('/404')
        .expect(404, /<h1>404<\/h1>/)
        .expect('content-type', 'text/html; charset=utf-8')
    })
  })

  describe('obtain params', function () {
    it('/users', function () {
      return supertest(app.handle)
        .get('/users')
        .expect(200, {})
    })

    it('/users/andi', function () {
      return supertest(app.handle)
        .get('/users/andi')
        .expect(200, { user: 'andi' })
    })

    it('/users/3.12', function () {
      return supertest(app.handle)
        .get('/users/3.12')
        .expect(200, { user: '3.12' })
    })

    it('malformed URI', function () {
      return supertest(app.handle)
        .get('/users/bad%%uri')
        .expect(200, {})
    })

    it('/users/404/ shall not find route', function () {
      return supertest(app.handle)
        .get('/users/404/')
        .expect(404)
    })

    it('/topics/programming/books/easy%20javascript', function () {
      return supertest(app.handle)
        .get('/topics/programming/books/easy%20javascript')
        .expect(200, { topic: 'programming', book: 'easy javascript' })
    })
  })

  describe('.head()', function () {
    it('GET returns a body', function () {
      return supertest(app.handle)
        .get('/')
        .expect(200, '["cb: GET /"]')
        .expect('content-length', '13')
        .expect('content-type', 'application/json; charset=utf-8')
        // .then(({ body, headers }) => console.log({ headers, body }))
    })

    it('where HEAD does not', function () {
      return supertest(app.handle)
        .head('/')
        .expect(200, undefined)
        .expect('content-length', '13')
        .expect('content-type', 'application/json; charset=utf-8')
    })
  })

  describe('preHook and postHook', function () {
    let router
    before(function () {
      router = new Router()
      router.preHook(handleResBodyInit, send)
      router.postHook(handleSend)
      router.use(preHandler('first'), preHandler('second'))
      router.get('/', asyncHandler)
      router.preHook(preHandler('third'))
      router.get('/path', handler)
    })

    it('shall apply hooks', function () {
      return supertest(router.handle)
        .get('/')
        .expect(200, ['first', 'second', 'async: GET /'])
    })

    it('shall apply hooks for /path', function () {
      return supertest(router.handle)
        .get('/path')
        .expect(200, ['first', 'second', 'third', 'cb: GET /path'])
        // .then(({ body, headers }) => console.log({ headers, body }))
    })
  })

  describe('mount router', function () {
    let router
    before(function () {
      const handlerName = (name) => async (req, res) => {
        const { method, url } = req
        res.body.push(`${name} ${method} ${url}`)
      }
      const handler1 = handlerName('#1st')
      const handler2 = handlerName('#2nd')

      router = new Router()
      router.preHook(handleResBodyInit, send)
      router.postHook(handleSend)
      router.get('/', handler1)
      router.get('/one', handler1)
      router.get('/one/main', handler1)

      const router2 = new Router()
      router2.get('/two', handler2)
      router2.get('/', handler2)
      router2.get('/*', handler2)

      // mount router with `use`
      router.use('/one', router2.handle, handlerName('#mnt1'))
      router.use('/two', router2.handle, handlerName('#mnt2'))
      // router.print()
    })

    it('/ is from main router', function () {
      return supertest(router.handle)
        .get('/')
        .expect(200, ['#1st GET /'])
    })

    it('/one is from main router', function () {
      return supertest(router.handle)
        .get('/one')
        .expect(200, ['#1st GET /one'])
    })

    it('/one/main is from main router', function () {
      return supertest(router.handle)
        .get('/one/main')
        .expect(200, ['#1st GET /one/main'])
    })

    it('/one/two uses mounted router', function () {
      return supertest(router.handle)
        .get('/one/two?foo=bar')
        .expect(200, ['#2nd GET /two?foo=bar', '#mnt1 GET /two?foo=bar'])
    })

    it('/one/any is from mounted router', function () {
      return supertest(router.handle)
        .get('/one/any')
        .expect(200, ['#2nd GET /any', '#mnt1 GET /any'])
    })

    it('/two is from mounted router', function () {
      return supertest(router.handle)
        .get('/two')
        .expect(200, ['#2nd GET /', '#mnt2 GET /'])
    })

    it('PUT /one/any gives a 404', function () {
      return supertest(router.handle)
        .put('/one/any')
        .expect(404, [])
    })
  })

  describe.skip('todo', function () {
    describe('preHandlers', function () {
      let router
      before(function () {
        router = new Router()
        router.use(preHandler('first'), preHandler('second'))
        router.get('/', asyncHandler)
        router.use(preHandler('third'))
        router.get('/path', handler)
      })

      it('shall apply prehandlers', function (done) {
        const req = new Request('GET', '/')
        const res = new Response()
        router.handle(req, res, (err) => {
          try {
            assert.equal(err.status, 404)
            assert.deepEqual(res, { locals: ['first', 'second', 'async: GET /'] })
            done()
          } catch (e) {
            done(e)
          }
        })
      })

      it('shall apply intermediary prehandler third', function (done) {
        const req = new Request('GET', '/path')
        const res = new Response()
        router.handle(req, res, (err) => {
          try {
            assert.equal(err.status, 404)
            assert.deepEqual(res, { locals: ['first', 'second', 'third', 'cb: GET /path'] })
            done()
          } catch (e) {
            done(e)
          }
        })
      })
    })
  })
})
