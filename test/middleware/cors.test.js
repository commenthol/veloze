import supertest from 'supertest'
import { cors, connect } from '../../src/index.js'
import { shouldHaveHeaders } from '../support/index.js'

const handleEnd = (req, res) => res.end('<h1>hi</h1>')

describe('middleware/cors', function () {
  describe('origin unset', function () {
    // origin=* is unsafe and need to be set explicitly
    const handler = connect(cors(), handleEnd)

    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'http://localhost:3000' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'http://localhost:3000',
          'content-length': '0',
          vary: 'origin'
        }))
    })

    it('request', function () {
      return supertest(handler)
        .get('/')
        .set({ origin: 'http://localhost:3000' })
        .expect(200)
        .expect(shouldHaveHeaders({
          'access-control-allow-origin': 'http://localhost:3000',
          'content-length': '11',
          vary: 'origin'
        }))
    })
  })

  describe('origin=*', function () {
    // origin=* is unsafe and need to be set explicitly
    const handler = connect(cors({ origin: '*' }), handleEnd)

    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': '*',
          'content-length': '0'
        }))
    })

    it('request', function () {
      return supertest(handler)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaders({
          'access-control-allow-origin': '*',
          'content-length': '11'
        }))
    })
  })

  describe('origin=https://foo.bar', function () {
    const handler = connect(
      cors({ origin: 'https://foo.bar' }),
      handleEnd
    )
    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'https://foo.bar' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'https://foo.bar',
          'content-length': '0',
          vary: 'origin'
        }))
    })

    it('preflight fails', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'http://foo.bar' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'content-length': '0'
        }))
    })

    it('request', function () {
      return supertest(handler)
        .get('/')
        .set({ origin: 'https://foo.bar' })
        .expect(200)
        .expect(shouldHaveHeaders({
          'access-control-allow-origin': 'https://foo.bar',
          'content-length': '11',
          vary: 'origin'
        }))
    })

    it('request with wrong origin fails', function () {
      return supertest(handler)
        .get('/')
        .set({ origin: 'http://foo.bar' })
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '11'
        }))
    })

    it('request without origin fails', function () {
      return supertest(handler)
        .get('/')
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '11'
        }))
    })
  })

  describe("origin=['https://foo.bar', 'http://localhost']", function () {
    const handler = connect(
      cors({ origin: ['https://foo.bar', 'http://localhost'] }),
      handleEnd
    )

    it('preflight http://localhost', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'http://localhost' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'http://localhost',
          'content-length': '0',
          vary: 'origin'
        }))
    })

    it('preflight https://foo.bar', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'https://foo.bar' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'https://foo.bar',
          'content-length': '0',
          vary: 'origin'
        }))
    })

    it('preflight fails http://foo.bar', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'http://foo.bar' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'content-length': '0'
        }))
    })

    it('request https://foo.bar ok', function () {
      return supertest(handler)
        .get('/')
        .set({ origin: 'https://foo.bar' })
        .expect(200)
        .expect(shouldHaveHeaders({
          'access-control-allow-origin': 'https://foo.bar',
          'content-length': '11',
          vary: 'origin'
        }))
    })

    it('request http://foo.bar fails', function () {
      return supertest(handler)
        .get('/')
        .set({ origin: 'http://foo.bar' })
        .expect(200)
        .expect(shouldHaveHeaders({
          'content-length': '11'
        }))
    })
  })

  describe('origin=/^https?://localhost$/', function () {
    const handler = connect(
      cors({ origin: /^https?:\/\/localhost$/ }),
      handleEnd
    )

    it('preflight http://localhost', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'http://localhost' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'http://localhost',
          'content-length': '0',
          vary: 'origin'
        }))
    })

    it('preflight https://localhost', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'https://localhost' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'https://localhost',
          'content-length': '0',
          vary: 'origin'
        }))
    })

    it('preflight http://localhost:3000 fails', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'http://localhost:3000' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'content-length': '0'
        }))
    })

    it('request http://localhost', function () {
      return supertest(handler)
        .get('/')
        .set({ origin: 'http://localhost' })
        .expect(200)
        .expect(shouldHaveHeaders({
          'access-control-allow-origin': 'http://localhost',
          'content-length': '11',
          vary: 'origin'
        }))
    })
  })

  describe('origin=/^https?://localhost$/', function () {
    const handler = connect(
      cors({ origin: (req) => req.headers?.origin === 'https://localhost' }),
      handleEnd
    )

    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'https://localhost' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'https://localhost',
          'content-length': '0',
          vary: 'origin'
        }))
    })

    it('preflight fails', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'http://localhost' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'content-length': '0'
        }))
    })
  })

  describe('origin=number', function () {
    const handler = connect(
      cors({ origin: 100 }),
      handleEnd
    )

    it('preflight fails', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'https://localhost' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'content-length': '0'
        }))
    })
  })
  describe('preflightContinue=true', function () {
    const handler = connect(
      cors({ preflightContinue: true }),
      handleEnd
    )
    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'http://localhost' })
        .expect(200)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'http://localhost',
          'content-length': '11',
          vary: 'origin'
        }))
    })
  })

  describe('methods=GET,POST', function () {
    const handler = connect(
      cors({ methods: 'GET,POST' }),
      handleEnd
    )
    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .set({ origin: 'http://localhost' })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,POST',
          'access-control-allow-origin': 'http://localhost',
          'content-length': '0',
          vary: 'origin'
        }))
    })
  })

  describe('access-control-request-headers without allowedHeaders', function () {
    const handler = connect(
      cors(),
      handleEnd
    )
    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .set({
          origin: 'http://localhost',
          'access-control-request-headers': 'x-custom'
        })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-headers': 'x-custom',
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'http://localhost',
          'content-length': '0',
          vary: 'origin, access-control-request-headers'
        }))
    })
  })

  describe('access-control-request-headers with allowedHeaders', function () {
    const handler = connect(
      cors({ headers: 'x-custom' }),
      handleEnd
    )
    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .set({
          origin: 'http://localhost'
        })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-headers': 'x-custom',
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'http://localhost',
          'content-length': '0',
          vary: 'origin'
        }))
    })
  })

  describe('maxAge=86400 in seconds', function () {
    const handler = connect(
      cors({ maxAge: 86400 }),
      handleEnd
    )
    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .set({
          origin: 'http://localhost'
        })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'http://localhost',
          'access-control-max-age': '86400',
          'content-length': '0',
          vary: 'origin'
        }))
    })
  })

  describe('credentials=true', function () {
    const handler = connect(
      cors({ credentials: true }),
      handleEnd
    )
    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .set({
          origin: 'http://localhost'
        })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-credentials': 'true',
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'http://localhost',
          'content-length': '0',
          vary: 'origin'
        }))
    })
  })

  describe('exposeHeaders=content-encoding,accept', function () {
    const handler = connect(
      cors({ exposeHeaders: 'content-encoding,accept' }),
      handleEnd
    )
    it('preflight', function () {
      return supertest(handler)
        .options('/')
        .set({
          origin: 'http://localhost'
        })
        .expect(204)
        .expect(shouldHaveHeaders({
          'access-control-allow-methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'access-control-allow-origin': 'http://localhost',
          'access-control-expose-headers': 'content-encoding,accept',
          'content-length': '0',
          vary: 'origin'
        }))
    })
  })
})
