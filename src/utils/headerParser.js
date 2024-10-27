/**
 * @typedef {[value: string, weight?: number]|string} HeaderParserResult
 */

/**
 * header parser for weighted values;
 * no weighted numbers are considered
 * @param {string} value
 * @param {object} [options]
 * @param {(value: string) => string|string[]|undefined} [options.fn]
 * @param {boolean} [options.weight] return only values with weight
 * @returns {HeaderParserResult[]}
 */
export function headerParser(value = '', options) {
  const { weight: optWeight, fn } = options || {}

  const order = new Set()
  const values = new Map()
  const splitted = value.split(',')

  for (const valWeight of splitted) {
    const [_value = '', _weight] = valWeight.trim().split(';')
    const value = _value.trim()
    const weight = extractWeight(_weight)

    // @ts-expect-error
    const results = [].concat(fn ? fn(value) : value)

    for (const result of results) {
      if (!result || order.has(result)) {
        continue
      }
      order.add(result)
      values.set(result, weight)
    }
  }

  if (!optWeight) {
    return [...order]
  }

  /** @type {[value: string, weight?: number][]} */
  const out = []
  for (const value of order) {
    out.push([value, values.get(value)])
  }
  return out
}

const RE_WEIGHT = /^\s*q=(0\.\d{1,3})\s*$/

function extractWeight(weight) {
  if (!weight) {
    return 1
  }
  const [_, num] = RE_WEIGHT.exec(weight) || []
  if (num) {
    return Number(num)
  }
  return 0
}
