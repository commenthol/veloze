import { safeDecodeUriComponent } from './utils/safeDecode.js'

const METHODS = Symbol('methods')
const PARAM = Symbol('param')
const PARAM_PART = Symbol('paramPart')
const WILDCARD = Symbol('*')

/**
 * @typedef {import('../src/types').Method} Method
 */

/**
 * Radix Tree Router
 *
 * - Case-sensitive router according to RFC3986.
 * - Duplicate slashes are NOT ignored.
 * - No regular expressions.
 * - Tailing slash resolves to a different route. E.g. `/path !== /path/`
 *
 * Supports:
 * - wildcard routes `/path/*`.
 * - parameters `/users/:user`, e.g. `/users/andi` resolves to `params = { user: 'andi' }`
 */
export class FindRoute {
  #tree = {}

  /**
   * add handler by method and pathname to routing tree
   * @param {Method} method
   * @param {string} pathname
   * @param {Function} handler
   */
  add (method, pathname, handler) {
    const parts = pathname.replace(/[/]+$/, '/').split('/')
    let tmp = this.#tree
    for (const part of parts) {
      if (part === '*') {
        tmp = tmp[WILDCARD] = {}
      } else if (part.startsWith(':')) {
        tmp[PARAM] = part.slice(1)
        tmp = tmp[PARAM_PART] = {}
      } else {
        tmp = tmp[part] = tmp[part] || {}
      }
    }
    tmp[METHODS] = tmp[METHODS] || {}
    tmp[METHODS][method] = handler
  }

  /**
   * print routing tree on console
   */
  print () {
    console.dir(this.#tree, { depth: null })
  }

  /**
   * find route handlers by method and url
   * @param {object} param0
   * @param {Method} param0.method
   * @param {string} param0.url
   * @returns {{
   *  handler: Function
   *  params: object
   * }|undefined}
   */
  find ({ method, url }) {
    const [pathname] = url.split('?')
    const parts = pathname.split('/')
    const params = {}
    let wildcard
    let tmp = this.#tree
    for (let i = 0; i < parts.length; i += 1) {
      const part = parts[i]
      let next = tmp?.[part]
      if (tmp[PARAM_PART]) {
        const param = tmp[PARAM]
        params[param] = safeDecodeUriComponent(part)
        next = tmp[PARAM_PART]
      } else if (tmp[WILDCARD]) {
        wildcard = tmp[WILDCARD]
      }
      if (!next) {
        tmp = wildcard
        break
      }
      tmp = next
    }
    const handler = getHandler(tmp, method) || getHandler(wildcard, method)

    if (!handler) {
      return
    }
    return { handler, params }
  }
}

const getHandler = (tmp, method) => tmp && tmp[METHODS] && (tmp[METHODS][method] || tmp[METHODS].ALL)
