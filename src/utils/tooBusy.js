// SPDX-License-Identifier: WTFPL OR Unlicense
/**
 * @credits https://github.com/STRML/node-toobusy
 * @license WTFPL
 */

const INTERVAL_MS = 500
const MAX_LAG_MS = 70
const SMOOTHING_FACTOR = 1 / 3

let lastTime
let intervalId
let lag = 0
let intervalMs = INTERVAL_MS
let maxLagMs = MAX_LAG_MS
let smoothingFactor = SMOOTHING_FACTOR

const isNumber = num => isNaN(Number(num)) ? undefined : Number(num)

/**
 * @typedef {object} TooBusyOptions
 * @property {number} [intervalMs=500] interval to check lag (ms); shall be greater 50ms
 * @property {number} [maxLagMs=70] max tolerable lag (ms); shall be greater 16ms
 * @property {number} [smoothingFactor=1/3] damping factor with range [0..1]; high values cause faster blocking than low values; see https://en.wikipedia.org/wiki/Exponential_smoothing
 */

/**
 * @returns {boolean}
 */
export function tooBusy () {
  const blockPercent = Math.max(0, (lag - maxLagMs) / maxLagMs)
  return Math.random() < blockPercent
}

/**
 * set settings
 * @param {TooBusyOptions} [options]
 */
tooBusy.set = (options) => {
  const {
    intervalMs: _intervalMs,
    maxLagMs: _maxLagMs,
    smoothingFactor: _smoothingFactor
  } = options || {}
  let doRestart = false

  if (_intervalMs && isNumber(_intervalMs) && _intervalMs >= 50) {
    intervalMs = _intervalMs
    doRestart = true
  }
  if (_maxLagMs && isNumber(_maxLagMs) && _maxLagMs >= 16) {
    maxLagMs = _maxLagMs
    doRestart = true
  }
  if (_smoothingFactor && isNumber(_smoothingFactor) && _smoothingFactor > 0 && _smoothingFactor < 1) {
    smoothingFactor = _smoothingFactor
    doRestart = true
  }
  if (doRestart) {
    // restart interval timer
    checkLag()
  }
}

/**
 * get settings
 * @returns {TooBusyOptions}
 */
tooBusy.get = () => ({ intervalMs, maxLagMs, smoothingFactor })

/**
 * @returns {number} current lag in ms
 */
tooBusy.lag = () => lag

/**
 * reset function for testing
 */
tooBusy.reset = () => {
  lag = 0
  intervalMs = INTERVAL_MS
  maxLagMs = MAX_LAG_MS
  smoothingFactor = SMOOTHING_FACTOR
  checkLag()
}

/**
 * start periodically checking the event-loop lag
 */
function checkLag () {
  lastTime = Date.now()

  clearInterval(intervalId)
  intervalId = setInterval(() => {
    const now = Date.now()
    const realLag = Math.max(0, now - lastTime - intervalMs)
    lastTime = now
    lag = smoothingFactor * realLag + (1 - smoothingFactor) * lag
  }, intervalMs)

  intervalId.unref()
}

checkLag()
