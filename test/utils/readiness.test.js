import assert from 'assert'
import { describe, it, beforeEach, afterEach } from 'mocha'
import { nap, Readiness } from '../../src/utils/readiness.js'

describe('utils/Readiness', function () {
  let readiness

  beforeEach(function () {
    readiness = new Readiness()
  })

  afterEach(function () {
    readiness.stop()
  })

  describe('constructor', function () {
    it('should use default options', function () {
      assert.strictEqual(readiness._options.name, 'readiness')
      assert.strictEqual(readiness._options.intervalMs, 5000)
      assert.strictEqual(readiness._options.abortTimeoutMs, 5000)
    })

    it('should merge custom options', function () {
      const custom = new Readiness({
        name: 'custom',
        intervalMs: 10000,
        abortTimeoutMs: 2000
      })
      assert.strictEqual(custom._options.name, 'custom')
      assert.strictEqual(custom._options.intervalMs, 10000)
      assert.strictEqual(custom._options.abortTimeoutMs, 2000)
    })
  })

  describe('register', function () {
    it('should register a check', function () {
      const fn = async () => true
      readiness.register('test', fn)
      assert(readiness._map.has('test'))
      const check = readiness._map.get('test')
      assert.strictEqual(check.asyncFn, fn)
      assert.strictEqual(check.result, false)
    })

    it('should initialize checkAt to epoch', function () {
      readiness.register('test', async () => true)
      const check = readiness._map.get('test')
      assert.strictEqual(check.checkAt.getTime(), 0)
    })

    it('should register multiple checks', function () {
      readiness.register('check1', async () => true)
      readiness.register('check2', async () => false)
      assert.strictEqual(readiness._map.size, 2)
    })
  })

  describe('start stop', function () {
    it('should stop the checks', async function () {
      let cnt = 0
      readiness._options.intervalMs = 20
      readiness.register('test', async function () {
        cnt += 1
        return true
      })
      while (cnt < 2) {
        await nap(30)
      }
      readiness.stop()
      let lastCnt = cnt
      await nap(30)
      assert.strictEqual(lastCnt, cnt)
    })

    it('shall abort a long running check', async function () {
      const readiness = new Readiness({ intervalMs: 50, abortTimeoutMs: 50 })
      let ran = false
      readiness.register('long', async function () {
        ran = true
        await nap(100)
        return true
      })
      const check = readiness._map.get('long')
      await readiness._runCheck('long', check)
      assert.strictEqual(ran, true)
      assert.strictEqual(check.result, false)
    })
  })

  describe('getResults', function () {
    it('should return 200 status code when all checks pass', function () {
      readiness.register('check1', async () => true)
      readiness.register('check2', async () => true)
      readiness._map.get('check1').result = true
      readiness._map.get('check2').result = true
      const { statusCode, results } = readiness.getResults()
      assert.strictEqual(statusCode, 200)
      assert.deepStrictEqual(results, {
        check1: {
          result: true,
          checkAt: readiness._map.get('check1').checkAt
        },
        check2: {
          result: true,
          checkAt: readiness._map.get('check2').checkAt
        }
      })
    })

    it('should return 500 status code when any check fails', function () {
      readiness.register('pass', async () => true)
      readiness.register('fail', async () => false)
      readiness._map.get('pass').result = true
      readiness._map.get('fail').result = false
      const { statusCode } = readiness.getResults()
      assert.strictEqual(statusCode, 500)
    })

    it('should include all registered checks in results', function () {
      readiness.register('check1', async () => true)
      readiness.register('check2', async () => false)
      readiness.register('check3', async () => true)
      const { results } = readiness.getResults()
      assert(results.check1)
      assert(results.check2)
      assert(results.check3)
    })

    it('should include result and checkAt for each check', function () {
      readiness.register('test', async () => true)
      const check = readiness._map.get('test')
      check.result = true
      check.checkAt = new Date('2024-01-01T12:00:00Z')
      const { results } = readiness.getResults()
      assert.strictEqual(results.test.result, true)
      assert.strictEqual(
        results.test.checkAt.getTime(),
        new Date('2024-01-01T12:00:00Z').getTime()
      )
    })

    it('should return empty results when no checks registered', function () {
      const { statusCode, results } = readiness.getResults()
      assert.strictEqual(statusCode, 200)
      assert.deepStrictEqual(results, {})
    })

    it('should return 500 if any single check fails', function () {
      readiness.register('check1', async () => true)
      readiness.register('check2', async () => true)
      readiness.register('check3', async () => false)
      readiness._map.get('check1').result = true
      readiness._map.get('check2').result = true
      readiness._map.get('check3').result = false
      const { statusCode } = readiness.getResults()
      assert.strictEqual(statusCode, 500)
    })
  })

  describe('_runCheck', function () {
    it('should execute the check function and store result', async function () {
      readiness.register('test', async () => true)
      const check = readiness._map.get('test')
      await readiness._runCheck('test', check)
      assert.strictEqual(check.result, true)
      assert(check.checkAt.getTime() > 0)
    })

    it('should mark false results', async function () {
      readiness.register('test', async () => false)
      const check = readiness._map.get('test')
      await readiness._runCheck('test', check)
      assert.strictEqual(check.result, false)
    })

    it('should handle non-boolean results as false', async function () {
      readiness.register('test', async () => 'not a boolean')
      const check = readiness._map.get('test')
      await readiness._runCheck('test', check)
      assert.strictEqual(check.result, false)
    })

    it('should catch exceptions and mark as failed', async function () {
      readiness.register('test', async function () {
        throw new Error('Test error')
      })
      const check = readiness._map.get('test')
      await readiness._runCheck('test', check)
      assert.strictEqual(check.result, false)
    })

    it('should timeout if check takes too long', async function () {
      readiness = new Readiness({ abortTimeoutMs: 50 })
      readiness.register('slow', async function () {
        await new Promise((resolve) => setTimeout(resolve, 200))
        return true
      })
      const check = readiness._map.get('slow')
      await readiness._runCheck('slow', check)
      assert.strictEqual(check.result, false)
    }).timeout(5000)

    it('should update checkAt timestamp', async function () {
      readiness.register('test', async () => true)
      const check = readiness._map.get('test')
      const beforeTime = Date.now()
      await readiness._runCheck('test', check)
      assert(check.checkAt.getTime() >= beforeTime)
    })
  })

  describe('_runAllChecks', function () {
    it('should run all registered checks', async function () {
      let check1Run = false
      let check2Run = false
      readiness.register('check1', async function () {
        check1Run = true
        return true
      })
      readiness.register('check2', async function () {
        check2Run = true
        return true
      })
      await readiness._runAllChecks()
      assert(check1Run)
      assert(check2Run)
    })

    it('should not fail if one check fails', async function () {
      readiness.register('pass', async () => true)
      readiness.register('fail', async function () {
        throw new Error('fail')
      })
      await readiness._runAllChecks()
      assert.strictEqual(readiness._map.get('pass').result, true)
      assert.strictEqual(readiness._map.get('fail').result, false)
    })

    it('should run checks in parallel', async function () {
      const times = []
      const delay = 100
      readiness.register('check1', async function () {
        times.push('start1')
        await new Promise((resolve) => setTimeout(resolve, delay))
        times.push('end1')
        return true
      })
      readiness.register('check2', async function () {
        times.push('start2')
        await new Promise((resolve) => setTimeout(resolve, delay))
        times.push('end2')
        return true
      })
      const startTime = Date.now()
      await readiness._runAllChecks()
      const duration = Date.now() - startTime
      // If running in parallel, should take ~delay ms, not 2*delay
      assert(duration < delay * 1.5)
    }).timeout(5000)
  })
})
