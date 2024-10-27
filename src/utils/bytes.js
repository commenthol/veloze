const RE = /^([\d.]+)\s?(b|k|m|g|t|p)?/

/**
 * convert string to byte value
 *
 * - b for bytes
 * - kb for kilobytes
 * - mb for megabytes
 * - gb for gigabytes
 * - tb for terabytes
 * - pb for petabytes
 * @param {string|number|undefined} val
 * @returns {number|undefined}
 * @example
 * bytes('100kB') = 102400
 * bytes('2.5MB') = 2621440
 */
export function bytes(val) {
  if (typeof val === 'number') {
    return val
  }
  if (typeof val === 'string') {
    const m = RE.exec(val.toLowerCase())
    if (!m) return
    const count = Number(m[1])
    const unit = m[2]
    const num =
      unit === 'p'
        ? 2 ** 50
        : unit === 't'
          ? 2 ** 40
          : unit === 'g'
            ? 2 ** 30
            : unit === 'm'
              ? 2 ** 20
              : unit === 'k'
                ? 2 ** 10
                : 1
    return Math.floor(count * num)
  }
}
