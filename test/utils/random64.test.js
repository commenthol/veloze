import assert from 'assert'
import { random64 } from '../../src/utils/random64.js'

const RE = /^[0-9a-zA-Z_-]+$/
const RE_NO_DASH = /^[0-9a-zA-Z]+$/

describe('string/random64', function () {
  it('shall generate a random Id', function () {
    const id = random64()
    assert.strictEqual(id.length, 21)
    assert(RE.test(id))
  })

  it('shall generate a random Id with length 256', function () {
    const id = random64(256)
    assert.strictEqual(id.length, 256)
    assert(RE.test(id))
  })

  it('shall generate a random Id without dashes and length 256', function () {
    const id = random64(256, true)
    assert.strictEqual(id.length, 256)
    assert(RE_NO_DASH.test(id))
  })
})
