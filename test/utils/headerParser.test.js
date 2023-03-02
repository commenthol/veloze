import assert from 'node:assert'
import { headerParser } from '../../src/utils/headerParser.js'

describe('utils/headerParser', function () {
  it('empty value', function () {
    assert.deepEqual(headerParser(), [])
  })

  it('0 value', function () {
    assert.deepEqual(headerParser('0'), ['0'])
  })

  it('with weight: text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8', function () {
    const values = headerParser('text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8', { weight: true })
    assert.deepEqual(values, [
      ['text/html', 1], ['application/xhtml+xml', 1], ['application/xml', 0.9], ['image/webp', 1], ['*/*', 0.8]
    ])
  })

  it('with weight: fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5', function () {
    const values = headerParser('fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5', { weight: true })
    assert.deepEqual(values, [
      ['fr-CH', 1], ['fr', 0.9], ['en', 0.8], ['de', 0.7], ['*', 0.5]
    ])
  })

  it('fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5', function () {
    const values = headerParser('fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5')
    assert.deepEqual(values, ['fr-CH', 'fr', 'en', 'de', '*'])
  })

  it('bad weight', function () {
    const values = headerParser('fr-CH, de;foobar, enq=bad, *  ;a=0.5', { weight: true })
    assert.deepEqual(values, [['fr-CH', 1], ['de', 0], ['enq=bad', 1], ['*', 0]])
  })

  it('with weight and custom function', function () {
    const fn = (value) => {
      const [main] = value.split('-')
      return [value, main]
    }
    const values = headerParser('fr-CH, fr;q=0.9, en-US;q=0.8, de-CH;q=0.7, *;q=0.5', { fn, weight: true })
    assert.deepEqual(values, [
      ['fr-CH', 1], ['fr', 1], ['en-US', 0.8], ['en', 0.8], ['de-CH', 0.7], ['de', 0.7], ['*', 0.5]
    ])
  })

  it('custom function', function () {
    const fn = (value) => {
      const [main] = value.split('-')
      return [value, main]
    }
    const values = headerParser('fr-CH, fr;q=0.9, en-US;q=0.8, de-CH;q=0.7, *;q=0.5', { fn })
    assert.deepEqual(values, ['fr-CH', 'fr', 'en-US', 'en', 'de-CH', 'de', '*'])
  })
})
