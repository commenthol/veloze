import assert from 'node:assert'
import { vary } from '../../src/response/vary.js'

class Response {
  constructor(vary) {
    this.vary = vary
  }

  // eslint-disable-next-line no-unused-vars
  getHeader(header) {
    return this.vary
  }

  setHeader(header, value) {
    this.vary = value
  }
}

describe('utils/vary', function () {
  it('should set value', function () {
    const res = new Response()
    vary(res, 'Origin')
    assert.equal(res.vary, 'origin')
  })

  it('should throw in invalid value', function () {
    const res = new Response()
    let err
    try {
      vary(res, 'Orig,%in')
    } catch (e) {
      err = e
    }
    assert.equal(err.message, 'vary value contains invalid characters')
  })

  it('should set value with multiple calls', function () {
    const res = new Response()
    vary(res, 'Origin')
    vary(res, 'User-Agent')
    assert.equal(res.vary, 'origin, user-agent')
  })

  it('with existing header of type array', function () {
    const res = new Response(['Origin, User-Agent', 'Accepts'])
    vary(res, 'Accept-Encoding')
    assert.equal(res.vary, 'origin, user-agent, accepts, accept-encoding')
  })

  it('should not duplicate existing value', function () {
    const res = new Response()
    vary(res, 'Origin')
    vary(res, 'oriGin')
    vary(res, 'OrIgin')
    assert.equal(res.vary, 'origin')
  })

  it('all values set', function () {
    const res = new Response()
    vary(res, 'Origin')
    vary(res, '*')
    vary(res, 'Accept')
    assert.equal(res.vary, '*')
  })
})
