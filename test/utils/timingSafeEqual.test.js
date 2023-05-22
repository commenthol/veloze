import assert from 'node:assert'
import { bench } from '../support/bench.js'
import { timingSafeEqual } from '../../src/utils/timingSafeEqual.js'

const fill = (char = 'a', count = 100) => new Array(count).fill(char).join('')

describe('string/timingSafeEqual', function () {
  it('a === a', function () {
    assert.ok(timingSafeEqual('a', 'a'))
  })
  it('empty string is false', function () {
    assert.ok(!timingSafeEqual('', 'b'))
  })
  it('empty string is false', function () {
    assert.ok(!timingSafeEqual('a', ''))
  })
  it('a !== b', function () {
    assert.ok(!timingSafeEqual('a', 'b'))
  })
  it('1 !== b', function () {
    assert.ok(!timingSafeEqual(1, 'b'))
  })
  it('a(100) === a(100)', function () {
    assert.ok(timingSafeEqual(fill('a', 100), fill('a', 100)))
  })
  it('a(100) !== a(99)b', function () {
    assert.ok(!timingSafeEqual(fill('a', 100), fill('a', 99) + 'b'))
  })
  it('a(100) !== a(99)', function () {
    assert.ok(!timingSafeEqual(fill('a', 100), fill('a', 99)))
  })
  it('is timing safe', function () {
    const a1 = fill('a', 100)
    const b1 = fill('a', 1)
    const a2 = fill('a', 100)
    const b2 = fill('a', 101)
    let diff1 = 0n
    let diff2 = 0n

    for (let i = 0; i < 100; i++) {
      diff1 += bench(() => timingSafeEqual(a1, b1))
      diff2 += bench(() => timingSafeEqual(a2, b2))
    }

    const d1 = Number(diff1)
    const d2 = Number(diff2)
    const perc = Math.max(d1, d2) * 3 / 100
    const difference = Math.abs(d1 - d2)
    assert.ok(difference < perc, 'shall not differ by more than 3%')
  })
})
