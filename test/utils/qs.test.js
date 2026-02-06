import assert from 'assert'
import { qs } from '../../src/utils/index.js'

describe('utils/qs', function () {
  it('shall parse query parameters', function () {
    const obj = qs('query=1&foo=bar&hi=%F0%9F%8C%88%F0%9F%A6%84&__proto__=oops')
    assert.deepEqual(obj, { query: '1', foo: 'bar', hi: '🌈🦄' })
  })

  it('shall only serialize last query value', function () {
    const obj = qs('name=1&name=2&name=3&name=4')
    assert.deepEqual(obj, { name: '4' })
  })

  it('shall not pollute prototype', function () {
    const obj = qs(
      '__proto__=foo&constructor=bar&hasOwnProperty=baz&toString=qux&prototype=quux'
    )
    const proto = Object.getPrototypeOf(obj)
    assert.strictEqual(proto, null)
    assert.deepEqual(obj, {
      prototype: 'quux'
    })
  })
})
