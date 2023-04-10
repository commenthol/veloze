import supertest from 'supertest'
import { etagHash, json, jsonEtag, bodyParser, connect, HttpError, Router } from '../../src/index.js'
import { shouldHaveHeaders } from '../support/index.js'

describe('middleware/json', function () {
  describe('json', function () {
    it('res.json', function () {
      const handle = connect(json, (req, res) => {
        res.json({ works: true })
      })

      return supertest(handle)
        .get('/')
        .expect(200, { works: true })
        .expect('content-length', '14')
        .expect('content-type', 'application/json; charset=utf-8')
    })
  })

  describe('jsonEtag', function () {
    let handle
    before(function () {
      const app = new Router()
      handle = app.handle
      app.use(jsonEtag())
      app.get('/', (req, res) => {
        res.json({ works: true })
      })
      app.put('/', bodyParser.json(), (req, res, next) => {
        // fetch current resource (e.g. from db) and process etag
        const currEtag = etagHash(JSON.stringify({ works: true }))

        if (req.headers['if-match'] !== currEtag) {
          next(new HttpError(412))
          return
        }
        // send back and generate a new
        res.json({ ...req.body, version: 2 })
      })
      app.get('/404', (req, res) => {
        res.json({ status: 404 }, 404)
      })
    })

    it('shall set etag', function () {
      return supertest(handle)
        .get('/')
        .expect(200, { works: true })
        .expect(shouldHaveHeaders({
          'content-length': '14',
          'content-type': 'application/json; charset=utf-8',
          etag: '"Sud87NRIoVsyWABYdgYlIekbv0I="'
        }))
    })

    it('shall not set etag on status != 200', function () {
      return supertest(handle)
        .get('/404')
        .expect(404, { status: 404 })
        .expect(shouldHaveHeaders({
          'content-length': '14',
          'content-type': 'application/json; charset=utf-8'
        }))
    })

    it('shall return 304', function () {
      return supertest(handle)
        .get('/')
        .set({
          'if-none-match': '"Sud87NRIoVsyWABYdgYlIekbv0I="'
        })
        .expect(304, '')
        .expect(shouldHaveHeaders({
          etag: '"Sud87NRIoVsyWABYdgYlIekbv0I="'
        }))
    })

    it('shall refuse to update if-match is wrong', function () {
      return supertest(handle)
        .put('/')
        .set({
          'if-match': '"Rud87NRIoVsyWABYdgYlIekbv0I="'
        })
        .send({ works: true, updated: true })
        .expect(412)
        .expect(shouldHaveHeaders({
          'content-length': '93',
          'content-type': 'application/json; charset=utf-8'
        }))
    })

    it('shall update if-match is correct', function () {
      return supertest(handle)
        .put('/')
        .set({
          'if-match': '"Sud87NRIoVsyWABYdgYlIekbv0I="'
        })
        .send({ works: true, updated: true })
        .expect(200, {
          updated: true,
          works: true,
          version: 2
        })
        .expect(shouldHaveHeaders({
          'content-length': '41',
          'content-type': 'application/json; charset=utf-8',
          etag: '"FVnrNA4ro3Fdhrf96QGMyx/qy0w="'
        }))
    })
  })
})
