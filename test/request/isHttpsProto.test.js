import assert from 'node:assert'
import https from 'node:https'
import supertest from 'supertest'
import { Http2Client } from '../support/Http2Client.js'
import { shouldHaveHeaders, certs } from '../support/index.js'
import { Router, request, response } from '../../src/index.js'

describe('request/isHttpsProto', function () {
  let app
  let httpsOptions
  before(function () {
    app = new Router()
    app.get('/*', (req, res) => {
      const isSsl = request.isHttpsProto(req)
      response.send(res, { isSsl })
    })
  })
  before(function () {
    httpsOptions = certs()
  })

  it('isSsl=false for http connections', function () {
    return supertest(app.handle)
      .get('/')
      .expect({ isSsl: false })
  })

  it('isSsl=true for x-forwarded-proto=https', function () {
    return supertest(app.handle)
      .get('/')
      .set({ 'x-forwarded-proto': 'https' })
      .expect({ isSsl: true })
  })

  it('isSsl=true for https connections', function () {
    const server = https.createServer(httpsOptions, app.handle)
    return supertest(server)
      .get('/')
      .disableTLSCerts()
      .expect({ isSsl: true })
  })

  it('isSsl=false for http/2 unsecure connections', function () {
    const client = new Http2Client(app.handle)
    return client.get('/')
      .then(res => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { isSsl: false })
        shouldHaveHeaders({
          'content-type': 'application/json; charset=utf-8'
        })(res)
      })
  })

  it('isSsl=true for http/2 connections', function () {
    const client = new Http2Client(app.handle, httpsOptions)
    return client.get('/')
      .disableTLSCerts()
      .then(res => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { isSsl: true })
        shouldHaveHeaders({
          'content-type': 'application/json; charset=utf-8'
        })(res)
      })
  })
})
