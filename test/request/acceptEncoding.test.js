import assert from 'node:assert'
import { acceptEncoding } from '../../src/request/index.js'

class Request {
  constructor (acceptLanguage) {
    this.headers = {}
    this.headers['accept-encoding'] = acceptLanguage
  }
}

describe('request/acceptEncoding', function () {
  it('no header', function () {
    const req = new Request()
    assert.deepEqual(acceptEncoding(req), [])
  })

  it('wildcard', function () {
    const req = new Request('*')
    assert.deepEqual(acceptEncoding(req), ['*'])
  })

  it('single value', function () {
    const req = new Request('deflate')
    assert.deepEqual(acceptEncoding(req), ['deflate'])
  })

  it('multiple values', function () {
    const req = new Request('deflate, gzip;q=1.0, *;q=0.5')
    assert.deepEqual(acceptEncoding(req), ['deflate', 'gzip', '*'])
  })

  it('single value with weight', function () {
    const req = new Request('deflate')
    assert.deepEqual(acceptEncoding(req, true), [['deflate', 1]])
  })

  it('multiple values with weight', function () {
    const req = new Request('deflate, gzip;q=0.9, *;q=0.5')
    assert.deepEqual(acceptEncoding(req, true), [['deflate', 1], ['gzip', 0.9], ['*', 0.5]])
  })

  it('only first item used on multiple headers', function () {
    const req = new Request(['*', 'deflate, gzip;q=0.9, *;q=0.5'])
    assert.deepEqual(acceptEncoding(req), ['*'])
  })
})
