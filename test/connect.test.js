/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "^(req|res|next)$" }] */

import assert from 'assert'
import { connect } from '../src/index.js'
import {
  Request,
  Response,
  handler,
  asyncHandler
} from './support/index.js'

const handlerPush = (str) => (req, res, next) => { res.body.push(str); next() }

describe('connect', function () {
  it('no handlers shall not throw', function (done) {
    const req = new Request()
    const res = new Response()
    connect()(req, res, (err) => {
      try {
        assert.deepEqual(res, { body: [] })
        done(err)
      } catch (e) {
        done(e)
      }
    })
  })

  it('handlers with wrong type shall throw', function () {
    const req = new Request()
    const res = new Response()
    let err
    try {
      connect(() => {}, 'one')(req, res, () => {})
    } catch (e) {
      err = e
    }
    assert.equal(err.message, 'handler must be of type function')
  })

  it('async handlers with next shall not throw', function (done) {
    const req = new Request()
    const res = new Response()
    const handler = async (req, res, next) => { next() }
    connect(handler)(req, res, (err) => {
      try {
        assert.deepEqual(res, { body: [] })
        done(err)
      } catch (e) {
        done(e)
      }
    })
  })

  it('only supports first error handler per route', function (done) {
    const req = new Request()
    const res = new Response()

    const errorHandler = (num) => (_err, req, res, next) => {
      res.body.push(`err#${num}`)
      next()
    }

    connect(
      handlerPush(0),
      errorHandler(1),
      handlerPush(1),
      (req, res, next) => { next(new Error()) },
      errorHandler(2),
      handlerPush(2)
    )(req, res, () => {
      try {
        assert.deepEqual(res, {
          body: [
            0,
            1,
            'err#1'
          ]
        })
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('ignores all error handlers in route', function (done) {
    const req = new Request()
    const res = new Response()

    const errorHandler = (num) => (_err, req, res, next) => {
      res.body.push(`err#${num}`)
      next()
    }

    connect(
      handlerPush(0),
      errorHandler(1),
      handlerPush(1),
      errorHandler(2),
      handlerPush(2)
    )(req, res, () => {
      try {
        assert.deepEqual(res, {
          body: [0, 1, 2]
        })
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('shall connect cb handlers', function (done) {
    const req = new Request()
    const res = new Response()
    connect(handler, handler)(req, res, (err) => {
      try {
        assert.deepEqual(res, { body: ['cb: GET /', 'cb: GET /'] })
        done(err)
      } catch (e) {
        done(e)
      }
    })
  })

  it('shall connect async handlers', function (done) {
    const req = new Request()
    const res = new Response()
    connect(asyncHandler, asyncHandler)(req, res, (err) => {
      try {
        assert.deepEqual(res, { body: ['async: GET /', 'async: GET /'] })
        done(err)
      } catch (e) {
        done(e)
      }
    })
  })

  it('mix cb with async handlers', function (done) {
    const req = new Request()
    const res = new Response()
    connect(handler, [asyncHandler, asyncHandler])(req, res, (err) => {
      try {
        assert.deepEqual(res, {
          body: ['cb: GET /', 'async: GET /', 'async: GET /']
        })
        done(err)
      } catch (e) {
        done(e)
      }
    })
  })

  it('set custom final handler', function () {
    const req = new Request()
    const res = new Response()
    const finalHandler = (err, req, res, next) => {
      res.body.push(err.message)
      res.end()
    }
    const handlerThrows = (req, res, next) => {
      next(new Error('drop it'))
    }
    connect(handler, handlerThrows, handler, finalHandler, handler)(req, res)
    assert.deepEqual(res.body, ['cb: GET /', 'drop it'])
  })

  it('shall pass error', function (done) {
    const req = new Request()
    const res = new Response()
    const errHandler = (req, res, next) => {
      next(new Error('boom'))
    }
    connect(errHandler)(req, res, (err) => {
      try {
        assert.equal(err.message, 'boom')
        assert.deepEqual(res, { body: [] })
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('shall catch error', function (done) {
    const req = new Request()
    const res = new Response()
    const errHandler = (req, res, next) => {
      throw new Error('boom')
    }
    connect(errHandler)(req, res, (err) => {
      try {
        assert.equal(err.message, 'boom')
        assert.deepEqual(res, { body: [] })
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('shall catch error from async handler', function (done) {
    const req = new Request()
    const res = new Response()
    const errHandler = async (req, res) => {
      throw new Error('boom')
    }
    connect(errHandler)(req, res, (err) => {
      try {
        assert.equal(err.message, 'boom')
        assert.deepEqual(res, { body: [] })
        done()
      } catch (e) {
        done(e)
      }
    })
  })

  it('shall finish stack processing if request was ended', function (done) {
    const req = new Request()
    const res = new Response()

    connect(
      handlerPush(0),
      handlerPush(1),
      async (req, res) => { res.end() },
      handlerPush(2)
    )(req, res, () => {
      throw new Error('assertion')
    })
    setTimeout(() => {
      assert.deepEqual(res.body, [0, 1])
      done()
    })
  })

  it('shall conditionally exclude middleware', function (done) {
    const req = new Request()
    const res = new Response()

    connect(
      handlerPush(0),
      false && handlerPush(1),
      handlerPush(2)
    )(req, res, () => {
      assert.deepEqual(res.body, [0, 2])
      done()
    })
  })

  it('shall break a synchronous chain after 100 handlers', function (done) {
    const req = new Request()
    const res = new Response()

    const handler = (req, res, next) => {
      res.locals = (res.locals || 0) + 1
      next()
    }
    const handlers = new Array(101).fill(handler)

    connect(handlers)(req, res, (err) => {
      try {
        assert.equal(err?.message, undefined)
        assert.deepEqual(res, { body: [], locals: 101 })
        done()
      } catch (e) {
        done(e)
      }
    })
  })
})
