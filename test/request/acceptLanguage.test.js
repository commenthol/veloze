import assert from 'node:assert'
import { acceptLanguage } from '../../src/request/index.js'

class Request {
  constructor (acceptLanguage) {
    this.headers = {}
    this.headers['accept-language'] = acceptLanguage
  }
}

describe('request/acceptLanguage', function () {
  it('no header', function () {
    const req = new Request()
    assert.deepEqual(acceptLanguage(req), [])
  })

  it('wildcard', function () {
    const req = new Request('*')
    assert.deepEqual(acceptLanguage(req), [])
  })

  it('fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5', function () {
    const req = new Request('fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5')
    assert.deepEqual(acceptLanguage(req), ['fr-CH', 'fr', 'en', 'de'])
  })

  it('en-US,en;q=0.5', function () {
    const req = new Request('en-US,en;q=0.5')
    assert.deepEqual(acceptLanguage(req), ['en-US', 'en'])
  })

  it('en-US should add main language "en"', function () {
    const req = new Request('en-US,en;q=0.5')
    assert.deepEqual(acceptLanguage(req), ['en-US', 'en'])
  })

  it('only first item used on multiple headers', function () {
    const req = new Request(['fr-FR', 'en-US,en;q=0.5'])
    assert.deepEqual(acceptLanguage(req), ['fr-FR', 'fr'])
  })

  it('this-is-not-a-language', function () {
    const req = new Request('this-is-not-a-language')
    assert.deepEqual(acceptLanguage(req), [
      'this-is-not-a-language',
      'this'
    ])
  })

  it('11-22-33 should be filtered out', function () {
    const req = new Request('11-22-33')
    assert.deepEqual(acceptLanguage(req), [])
  })
})
