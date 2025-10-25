import { logger } from './logger.js'

const log = logger(':readiness')

export const nap = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms).unref())

/**
 * @typedef {Promise<never> & {abort: () => void}} AbortPromise
 */
/**
 * @param {number} [ms=1000]
 * @returns {AbortPromise}
 */
export const abort = (ms = 1e3) => {
  let timeoutId
  /** @type {AbortPromise} */
  // @ts-ignore
  const p = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('TimeoutError')), ms).unref()
  })
  p.abort = () => {
    clearTimeout(timeoutId)
  }
  return p
}

/**
 * @typedef {Object} Check
 * @property {() => Promise<boolean>} asyncFn
 * @property {boolean} result
 * @property {Date} checkAt
 */

/**
 * Run readiness checks at regular intervals
 */
export class Readiness {
  /** @type {Map<string, Check>} */
  _map = new Map()
  /** @type {boolean} */
  _isRunning = false

  /**
   * @param {{
   *  name?: string,
   *  intervalMs?: number,
   *  abortTimeoutMs?: number,
   * }} options
   */
  constructor(options) {
    this._options = {
      name: 'readiness',
      intervalMs: 5000,
      abortTimeoutMs: 5000,
      ...options
    }
  }

  /**
   * register a readiness check
   * @param {string} name
   * @param {() => Promise<boolean> } asyncFn
   * @param {boolean} [initialResult=false]
   */
  register(name, asyncFn, initialResult = false) {
    this._map.set(name, {
      asyncFn,
      result: initialResult,
      checkAt: new Date(0)
    })
    this.start()
  }

  /**
   * @returns {{statusCode: number, results: {}|Record<string, {result: boolean, checkAt: Date}>}}
   */
  getResults() {
    const results = {}
    let statusCode = 200
    for (const [name, check] of this._map.entries()) {
      results[name] = {
        result: check.result,
        checkAt: check.checkAt
      }
      if (!check.result) {
        statusCode = 500
      }
    }
    return { statusCode, results }
  }

  async start() {
    if (this._isRunning) return
    this._isRunning = true
    while (this._isRunning) {
      await Promise.allSettled([
        this._runAllChecks(),
        nap(this._options.intervalMs)
      ])
    }
  }

  stop() {
    this._isRunning = false
  }

  /**
   * @private
   * @param {string} name
   * @param {Check} check
   */
  async _runCheck(name, check) {
    const abortSignal = abort(this._options.abortTimeoutMs)
    try {
      // allow aborting long running checks
      const result = await Promise.race([check.asyncFn(), abortSignal])
      check.result = result === true
      log.debug(`%s: check=%s finished=%s`, this._options.name, name, result)
    } catch (/** @type {any} */ err) {
      check.result = false
      log.warn('%s: check=%s failed=%s', this._options.name, name, err.message)
    } finally {
      abortSignal.abort()
    }
    check.checkAt = new Date()
  }

  async _runAllChecks() {
    const checks = Array.from(this._map.entries()).map(([name, check]) =>
      this._runCheck(name, check)
    )
    await Promise.allSettled(checks)
  }
}
