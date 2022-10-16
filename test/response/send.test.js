import supertest from 'supertest'
import { METHOD_HEAD, send } from '../../src/response/send.js'
import { shouldNotHaveHeader } from '../support/index.js'

describe('middleware/send', function () {
  describe('send(res)', function () {
    it('should set body to ""', async function () {
      const handle = (req, res) => send(res)

      await supertest(handle)
        .get('/')
        .expect(200, '')
        .expect('content-length', '0')
        .expect(shouldNotHaveHeader('content-type'))
    })
  })

  describe('send(res, null)', function () {
    it('should set body to ""', async function () {
      const handle = (req, res) => send(res, null)

      await supertest(handle)
        .get('/')
        .expect(200, '')
        .expect('content-length', '0')
        .expect(shouldNotHaveHeader('content-type'))
    })
  })

  describe('send(res, "")', function () {
    it('should set content-type to text/html', async function () {
      const handle = (req, res) => send(res, '')

      await supertest(handle)
        .get('/')
        .expect(200, '')
        .expect('content-length', '0')
        .expect('content-type', 'text/html; charset=utf-8')
    })
  })

  describe('send(res, body)', function () {
    it('should send string as html', async function () {
      const body = '<h1>works</h1>'
      const handle = (req, res) => send(res, body)

      await supertest(handle)
        .get('/')
        .expect(200, body)
        .expect('content-length', '' + body.length)
        .expect('content-type', 'text/html; charset=utf-8')
    })

    it('should send number as json', async function () {
      const handle = (req, res) => send(res, 3.14)

      await supertest(handle)
        .post('/')
        .expect(200, '3.14')
        .expect('content-length', '4')
        .expect('content-type', 'application/json; charset=utf-8')
    })

    it('should send boolean as json', async function () {
      const handle = (req, res) => send(res, false)

      await supertest(handle)
        .post('/')
        .expect(200, 'false')
        .expect('content-length', '5')
        .expect('content-type', 'application/json; charset=utf-8')
    })

    it('should send object as json', async function () {
      const handle = (req, res) => send(res, { foo: 'bar' })

      await supertest(handle)
        .post('/')
        .expect(200, '{"foo":"bar"}')
        .expect('content-length', '13')
        .expect('content-type', 'application/json; charset=utf-8')
    })

    it('should send buffer as object-stream', async function () {
      const handle = (req, res) => send(res, Buffer.from('foobar'))

      await supertest(handle)
        .get('/')
        .expect(200, Buffer.from('foobar'))
        .expect('content-length', '6')
        .expect('content-type', 'application/octet-stream')
    })

    it('should not overwrite content-type', async function () {
      const handle = (req, res) => {
        send(res, 'foobar', 200, {
          'content-type': 'text/plain'
        })
      }

      await supertest(handle)
        .post('/')
        .expect(200, 'foobar')
        .expect('content-length', '6')
        .expect('content-type', 'text/plain')
    })

    it('should not overwrite content-type for buffers', async function () {
      const handle = (req, res) => {
        send(res, Buffer.from('foobar'), 200, {
          'content-type': 'text/plain; charset=iso-8859-1'
        })
      }

      await supertest(handle)
        .post('/')
        .expect(200, 'foobar')
        .expect('content-length', '6')
        .expect('content-type', 'text/plain; charset=iso-8859-1')
    })

    it('should not overwrite .statusCode', async function () {
      const handle = (req, res) => {
        res.statusCode = 401
        send(res, 'foobar')
      }

      await supertest(handle)
        .post('/')
        .expect(401, 'foobar')
        .expect('content-length', '6')
        .expect('content-type', 'text/html; charset=utf-8')
    })
  })

  describe('send(res, body, code)', function () {
    it('should set .statusCode and body', async function () {
      const handle = (req, res) => send(res, null, 201)

      await supertest(handle)
        .post('/')
        .expect(201, '')
        .expect('content-length', '0')
        .expect(shouldNotHaveHeader('content-type'))
    })
  })

  describe('request method is HEAD', function () {
    it('should ignore the body', async function () {
      const handle = (req, res) => {
        res[METHOD_HEAD] = true
        send(res, 'foobar')
      }

      await supertest(handle)
        .head('/')
        .expect(200, undefined)
        .expect('content-length', '6')
        .expect('content-type', 'text/html; charset=utf-8')
    })
  })

  describe('for statuscode 204', function () {
    it('should strip content-*, transfer-encoding and body', async function () {
      const handle = (req, res) => {
        send(res, 'foobar', 204, {
          'transfer-encoding': 'chunked'
        })
      }

      await supertest(handle)
        .get('/')
        .expect(204, '')
        .expect(shouldNotHaveHeader('content-length'))
        .expect(shouldNotHaveHeader('content-type'))
        .expect(shouldNotHaveHeader('transfer-encoding'))
    })
  })

  describe('for statuscode 205', function () {
    it('should strip transfer-encoding and body and set content-length', async function () {
      const handle = (req, res) => {
        send(res, 'foobar', 205, {
          'transfer-encoding': 'chunked'
        })
      }

      await supertest(handle)
        .get('/')
        .expect(205, '')
        .expect('content-length', '0')
        .expect('content-type', 'text/html; charset=utf-8')
        .expect(shouldNotHaveHeader('transfer-encoding'))
    })
  })

  describe('for statuscode 304', function () {
    it('should strip content-*, transfer-encoding and body', async function () {
      const handle = (req, res) => {
        send(res, 'foobar', 304, {
          'transfer-encoding': 'chunked'
        })
      }

      await supertest(handle)
        .get('/')
        .expect(304, '')
        .expect(shouldNotHaveHeader('content-length'))
        .expect(shouldNotHaveHeader('content-type'))
        .expect(shouldNotHaveHeader('transfer-encoding'))
    })
  })

  describe('send(res, "", 301, { location })', function () {
    it('should send a redirect', async function () {
      const handle = (req, res) => {
        send(res, undefined, 301, { location: 'https://redirect.me/there' })
      }

      await supertest(handle)
        .get('/')
        .expect(301, '')
        .expect('location', 'https://redirect.me/there')
        .expect('content-length', '0')
        .expect(shouldNotHaveHeader('content-type'))
    })
  })
})
