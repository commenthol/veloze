import supertest from 'supertest'
import { Router, send } from '../src/index.js'
import { handler, asyncHandler, preHandler } from './support/index.js'

const handleResBodyInit = (req, res, next) => {
  res.body = []
  next()
}

const handleSend = (req, res) => res.send(res.body)

const handleSendParams = (req, res) => res.send(req.params)

const handleName = (name) => async (req, res) => {
  const { method, url } = req
  res.body.push(`${name} ${method} ${url}`)
}

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
      .get('/wildcard/:wildcard/*', handler, handleSendParams)
      .all('/wildcard/*', handler)
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

  describe('wildcard', function () {
    it('GET /wildcard', function () {
      return supertest(app.handle)
        .get('/wildcard')
        .expect(['cb: GET /wildcard'])
    })

    it('GET /wildcard/anything', function () {
      return supertest(app.handle)
        .get('/wildcard/anything')
        .expect(['cb: GET /wildcard/anything'])
    })

    it('PUT /wildcard/anything', function () {
      return supertest(app.handle)
        .put('/wildcard/anything')
        .expect(['cb: PUT /wildcard/anything'])
    })

    it('GET /wildcard/anything/else', function () {
      return supertest(app.handle)
        .get('/wildcard/anything/else')
        .expect({ wildcard: 'anything' })
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
      const handler1 = handleName('#1st')
      const handler2 = handleName('#2nd')

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
      router.use('/one', router2.handle, handleName('#mnt1'))
      router.use('/two', router2.handle, handleName('#mnt2'))
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

  describe('mount router on /', function () {
    let app
    before(function () {
      app = new Router()
      app.preHook(handleResBodyInit, send)
      app.postHook(handleSend)
      const router = new Router()
      router.get('/', handleName('#0'))
      router.get('/:id', handleName('#1'))
      router.put('/:id', handleName('#2'))
      app.use('/', router.handle)
      // router.print()
    })

    it('GET /', function () {
      return supertest(app.handle)
        .get('/')
        .expect(['#0 GET /'])
    })

    it('GET /one', function () {
      return supertest(app.handle)
        .get('/one')
        .expect(['#1 GET /one'])
    })

    it('PUT /two', function () {
      return supertest(app.handle)
        .put('/two')
        .expect(['#2 PUT /two'])
    })
  })
})
