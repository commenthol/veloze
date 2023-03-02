import assert from 'node:assert'
import { accept } from '../../src/request/index.js'

class Request {
  constructor (accept) {
    this.headers = {}
    this.headers.accept = accept
  }
}

describe('request/accept', function () {
  it('no header', function () {
    const req = new Request()
    assert.deepEqual(accept(req), [])
  })

  it('wildcard', function () {
    const req = new Request('*/*')
    assert.deepEqual(accept(req), ['*/*'])
  })

  it('only first item used on multiple headers', function () {
    const req = new Request(['text/html', 'application/json'])
    assert.deepEqual(accept(req), ['text/html'])
  })

  it('single value', function () {
    const req = new Request('text/html')
    assert.deepEqual(accept(req), ['text/html'])
  })

  it('multiple values', function () {
    const req = new Request('text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8')
    assert.deepEqual(accept(req), [
      'text/html',
      'application/xhtml+xml',
      'application/xml',
      'image/webp',
      '*/*'
    ])
  })

  it('single value with weight', function () {
    const req = new Request('text/html')
    assert.deepEqual(accept(req, true), [['text/html', 1]])
  })

  it('multiple values', function () {
    const req = new Request('text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8')
    assert.deepEqual(accept(req, true), [
      ['text/html', 1],
      ['application/xhtml+xml', 1],
      ['application/xml', 0.9],
      ['image/webp', 1],
      ['*/*', 0.8]
    ])
  })
})
