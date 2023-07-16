/**
 * @typedef {object} Range
 * @property {number} start
 * @property {number} end
 */

/**
 * Parses the "Range" header and returns an the first range object.
 * @param {string} rangeHeader The "range" header value.
 * @param {number} size
 * @returns {[start: number, end: number]|[-1]|[]}
 */
export function rangeParser (rangeHeader = '', size) {
  if (!rangeHeader.startsWith('bytes=') || !size) {
    return []
  }

  const rangeValues = rangeHeader.slice(6).split(',', 2)
  // deliver full content if multi-range detected
  if (rangeValues.length > 1) {
    return []
  }

  const [_start, _end] = rangeValues[0].split('-')
  const start = parseInt(_start)
  const end = parseInt(_end)

  if (isNaN(start) && isNaN(end)) {
    return []
  }
  if (isNaN(end)) {
    return [start, size]
  }
  if (size - end < 0) {
    return [-1]
  }
  if (isNaN(start)) {
    return [size - end, size]
  }
  return [start, end]
}
