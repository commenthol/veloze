import assert from 'node:assert'
import supertest from 'supertest'
import { Http2Client } from '../support/Http2Client.js'
import { Router, request, response } from '../../src/index.js'
import { oneOf, stringFormatT } from '@veloze/validate'

describe('request/remoteAddress', function () {
  let app
  let httpsOptions

  const schemaIp = oneOf([stringFormatT().ipv6(), stringFormatT().ipv4()])

  before(function () {
    app = new Router()
    app.get('/*', (req, res) => {
      const remote = request.remoteAddress(req, true)
      response.send(res, { remote })
    })
    app.get('/local', (req, res) => {
      const remote = request.remoteAddress(req)
      response.send(res, { remote })
    })
  })

  it('for http connections', function () {
    return supertest(app.handle)
      .get('/local')
      .then(res => {
        assert.equal(schemaIp.validate(res.body.remote), true)
      })
  })

  it('for http connections behind proxy', function () {
    return supertest(app.handle)
      .get('/')
      .set({
        'x-forwarded-for':
        '203.0.113.195, 2001:db8:85a3:8d3:1319:8a2e:370:7348'
      })
      .expect({ remote: '203.0.113.195' })
  })

  it('for http connections behind proxy without x-forwarded-for', function () {
    return supertest(app.handle).get('/').expect({ remote: '::ffff:127.0.0.1' })
  })

  it('for http/2 connections', function () {
    const client = new Http2Client(app.handle, httpsOptions)
    return client
      .get('/local')
      .disableTLSCerts()
      .then((res) => {
        assert.equal(res.status, 200)
        assert.equal(schemaIp.validate(res.body.remote), true)
      })
  })

  it('for http/2 connections behind proxy', function () {
    const client = new Http2Client(app.handle, httpsOptions)
    return client
      .get('/')
      .set({
        'x-forwarded-for':
        '203.0.113.195, 2001:db8:85a3:8d3:1319:8a2e:370:7348'
      })
      .disableTLSCerts()
      .then((res) => {
        assert.equal(res.status, 200)
        assert.deepEqual(res.body, { remote: '203.0.113.195' })
      })
  })
})
