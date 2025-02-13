// SPDX-License-Identifier: WTFPL OR Unlicense
/**
 * @credits https://github.com/STRML/node-toobusy
 * @license WTFPL
 */

import assert from 'node:assert'
import { tooBusy } from '../../src/utils/index.js'
import { makeLoad } from '../support/makeLoad.js'

const defaultValues = {
  intervalMs: 500,
  maxLagMs: 70,
  smoothingFactor: 1 / 3
}

describe('utils/tooBusy', function () {
  beforeEach(function () {
    tooBusy.reset()
  })
  after(function () {
    tooBusy.reset()
  })

  describe('set, get settings', function () {
    before(function () {
      tooBusy.reset()
    })

    it('should get default values', function () {
      assert.deepEqual(tooBusy.get(), defaultValues)
    })

    it('should set new values', function () {
      const change = {
        intervalMs: 100,
        maxLagMs: 35,
        smoothingFactor: 1 / 4
      }
      tooBusy.set(change)
      assert.deepEqual(tooBusy.get(), change)
    })

    it('should not set values below allowed thresholds', function () {
      const change = {
        intervalMs: 49,
        maxLagMs: 15,
        smoothingFactor: 0
      }
      tooBusy.reset()
      tooBusy.set(change)
      assert.deepEqual(tooBusy.get(), defaultValues)
    })
  })

  describe('with load', function () {
    beforeEach(function () {
      tooBusy.set({
        intervalMs: 50,
        maxLagMs: 16,
        smoothingFactor: 0.5
      })
    })

    it('shall return true with load', function (done) {
      function repeat() {
        if (tooBusy()) {
          const lag = tooBusy.lag()
          assert.ok(lag < 50, `lag ${lag} shall be less than 50ms`)
          assert.ok(lag > 16, `lag ${lag} shall be greater than 16ms`)
          done()
          return
        }
        makeLoad(100)
        setTimeout(repeat, 0)
      }
      repeat()
    })
  })

  describe('smoothing factor', function () {
    beforeEach(function (done) {
      tooBusy.set({
        intervalMs: 50,
        maxLagMs: 20,
        smoothingFactor: 0.2
      })
      setTimeout(done, 50)
    })

    it('low smoothing factor', function (done) {
      tooBusy.set({ smoothingFactor: 0.2 })
      let cycle = 0
      function repeat() {
        cycle++
        if (tooBusy()) {
          assert.ok(cycle >= 2, `cycle ${cycle} is less then 2`)
          done()
          return
        }
        makeLoad(100)
        setTimeout(repeat, 0)
      }
      repeat()
    })

    it('high smoothing factor', function (done) {
      tooBusy.set({ smoothingFactor: 0.9 })
      let cycle = 0
      function repeat() {
        cycle++
        if (tooBusy()) {
          assert.ok(cycle < 3, cycle)
          done()
          return
        }
        makeLoad(100)
        setTimeout(repeat, 0)
      }
      repeat()
    })
  })
})
