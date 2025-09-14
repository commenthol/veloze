import assert from 'node:assert/strict'
import supertest from 'supertest'
import { traceContext, Router } from '#index.js'

const ST_OPTS = { http2: true }

describe('middleware/traceContext', () => {
  let app
  before(function () {
    app = new Router()
    app.use('/*', traceContext(), (req, res) => {
      res.setHeader('traceparent', req.traceparent.update(true).toString())
      res.end()
    })
  })

  it('should always set a traceparent header', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/')
      .expect(200)
      .expect(({ headers }) => {
        assert.match(headers.traceparent, /^00-[0-9a-f]{32}-[0-9a-f]{16}-01$/)
      })
  })

  it('should return the traceId', async () => {
    await supertest(app.handle, ST_OPTS)
      .get('/')
      .set({
        traceparent: '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-00'
      })
      .expect(200)
      .expect(({ headers }) => {
        assert.match(
          headers.traceparent,
          /^00-4bf92f3577b34da6a3ce929d0e0e4736-[0-9a-f]{16}-01$/
        )
      })
  })
})
