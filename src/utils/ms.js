const SECOND = 1e3
const MINUTE = 6e4
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const YEAR = 365.25 * DAY
const MONTH = Math.floor(YEAR / 12)

const RE = /^(-?[\d.]+)\s?(y|mo|w|d|h|m|s)?/

/**
 * @param {number|string|undefined} value
 * @param {boolean} inSeconds if `true` convert `value` to seconds; Only valid if value is string
 * @returns {number|undefined}
 */
export function ms (value, inSeconds) {
  if (typeof value === 'string') {
    const m = RE.exec(value.toLowerCase())
    if (!m) return
    const count = Number(m[1])
    const unit = m[2]
    const num = unit === 'y'
      ? YEAR
      : unit === 'mo'
        ? MONTH
        : unit === 'w'
          ? WEEK
          : unit === 'd'
            ? DAY
            : unit === 'h'
              ? HOUR
              : unit === 'm'
                ? MINUTE
                : unit === 's'
                  ? SECOND
                  : 1
    return inSeconds
      ? Math.floor(count * num / SECOND)
      : count * num
  }
  return value
}
