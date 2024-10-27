import assert from 'assert'
import { qs } from '../../src/utils/index.js'

describe('utils/qs', function () {
  it('shall parse query parameters', function () {
    const obj = qs('query=1&foo=bar&hi=%F0%9F%8C%88%F0%9F%A6%84&__proto__=oops')
    assert.deepStrictEqual(obj, { query: '1', foo: 'bar', hi: '🌈🦄' })
  })

  it('shall only serialize last query value', function () {
    const obj = qs('name=1&name=2&name=3&name=4')
    assert.deepStrictEqual(obj, { name: '4' })
  })
})
