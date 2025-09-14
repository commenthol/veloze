import { nanoid, HEX } from './random64.js'

const isHex = (str, len) => {
  const reHex = new RegExp(`^[0-9a-f]{${len}}$`)
  const reZero = new RegExp(`^[0]{${len}}$`)
  return reHex.test(str) && !reZero.test(str)
}

/**
 * @see https://www.w3.org/TR/trace-context/#traceparent-header
 */
export class TraceParent {
  static VERSION = '00'

  /**
   * @param {{traceId?:string, parentId?:string, sampled?:boolean}} param0
   */
  constructor({ traceId, parentId, sampled = false } = {}) {
    this.traceId = isHex(traceId, 32) ? traceId : nanoid(32, HEX)
    this.parentId = isHex(parentId, 16) ? parentId : nanoid(16, HEX)
    this.sampled = !!sampled
  }

  /**
   * parse header value
   * @param {string} value
   * @returns {TraceParent}
   */
  static parse(value) {
    if (!value || typeof value !== 'string' || value.length !== 55) {
      return new TraceParent()
    }
    const parts = value.split('-')
    if (
      parts.length === 4 &&
      parts[0] === TraceParent.VERSION &&
      isHex(parts[1], 32) &&
      isHex(parts[2], 16)
    ) {
      // always create a new parentId as id for this request
      return new TraceParent({ traceId: parts[1] })
    }
    return new TraceParent()
  }

  /**
   * @param {boolean} [sampled]
   * @returns {this} self
   */
  update(sampled) {
    this.sampled = !!sampled
    return this
  }

  toString() {
    const traceFlags = this.sampled ? '01' : '00'
    return `${TraceParent.VERSION}-${this.traceId}-${this.parentId}-${traceFlags}`
  }
}
