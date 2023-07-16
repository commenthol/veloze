import assert from 'node:assert/strict'
import { rangeParser } from '../../src/utils/rangeParser.js'

describe('utils/rangeParser', function () {
  it('header does not start with bytes=', function () {
    assert.deepStrictEqual(rangeParser('Content-Range: bytes=0-100/1000', 1000), [])
  })

  it('multi ranges are not supported', function () {
    assert.deepStrictEqual(rangeParser('bytes=0-99,102-109', 1000), [])
  })

  it('size must be available', function () {
    assert.deepStrictEqual(rangeParser('bytes=0-99'), [])
  })

  it("header starts with 'bytes=' and contains a single range", function () {
    assert.deepStrictEqual(rangeParser('bytes=0-99', 1000), [0, 99])
  })

  it('header contains bad range', function () {
    assert.deepStrictEqual(rangeParser('bytes=a-b', 1000), [])
  })

  it('header exceeds size', function () {
    assert.deepStrictEqual(rangeParser('bytes=100-1100', 1000), [-1])
  })

  it('header contains multiple ranges', function () {
    assert.deepStrictEqual(rangeParser('bytes=0-100,200-300'), [])
  })

  it('header contains an empty range', function () {
    assert.deepStrictEqual(rangeParser('bytes=0-99,', 1000), [])
  })

  it('header contains a range with empty start and end', function () {
    assert.deepStrictEqual(rangeParser('bytes='), [])
  })

  it('header contains a range with empty start', function () {
    assert.deepStrictEqual(rangeParser('bytes=-100', 1000), [900, 1000])
  })

  it('header contains a range with empty end', function () {
    assert.deepStrictEqual(rangeParser('bytes=100-', 1000), [100, 1000])
  })
})
