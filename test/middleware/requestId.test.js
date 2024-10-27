import assert from 'node:assert'
import { requestId } from '../../src/middleware/index.js'
import { Request, Response } from '../support/index.js'

const X_REQUEST_ID = 'x-request-id'

describe('middleware/requestId', function () {
  it('shall set request id on req and header', function () {
    const req = new Request()
    const res = new Response()
    requestId()(req, res, () => {})

    assert.equal(typeof req.id, 'string', 'has req.id')
    assert.equal(
      typeof req.headers[X_REQUEST_ID],
      'string',
      'has x-request-id header'
    )
    assert.equal(
      req.id,
      req.headers[X_REQUEST_ID],
      'req.id == x-request-id header'
    )
    assert.equal(res.headers, undefined)
  })

  it('shall set request id only if header is present', function () {
    const req = new Request()
    req.headers[X_REQUEST_ID] = 'foobar'
    requestId()(req, {}, () => {})

    assert.equal(req.id, 'foobar')
    assert.equal(
      req.id,
      req.headers[X_REQUEST_ID],
      'req.id == x-request-id header'
    )
  })

  it('shall force set request id only if header is present', function () {
    const req = new Request()
    req.headers[X_REQUEST_ID] = 'foobar'
    requestId({ force: true })(req, {}, () => {})

    assert.notEqual(req.id, 'foobar')
    assert.equal(typeof req.id, 'string', 'has req.id')
    assert.equal(
      typeof req.headers[X_REQUEST_ID],
      'string',
      'has x-request-id header'
    )
    assert.equal(
      req.id,
      req.headers[X_REQUEST_ID],
      'req.id == x-request-id header'
    )
  })

  it('shall set request id on response', function () {
    const req = new Request()
    const res = new Response()
    req.headers[X_REQUEST_ID] = 'foobar'
    requestId({ setResponseHeader: true })(req, res, () => {})

    assert.equal(req.id, 'foobar')
    assert.deepEqual(res.headers, { 'x-request-id': 'foobar' })
  })
})
