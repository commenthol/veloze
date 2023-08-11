import assert from 'assert'

export { certs } from './certs.js'

export const nap = (ms = 1) => new Promise((resolve) => setTimeout(() => resolve(ms), ms))

export class Request {
  constructor (method, url, headers) {
    this.headers = headers || {}
    this.method = method || 'GET'
    this.url = url || '/'
  }
}

export class Response {
  constructor () {
    this.body = []
  }

  setHeader (header, value) {
    this.headers = this.headers || {}
    this.headers[header] = value
  }

  getHeader (header) {
    return this.headers?.[header]
  }

  removeHeader (header) {
    if (this.headers?.[header]) {
      delete this.headers[header]
    }
  }

  end (...args) {
    this.writableEnded = true
    this.end = args
  }
}

export const handler = (req, res, next) => {
  const { method, url } = req
  res.body.push(`cb: ${method} ${url}`)
  next()
}

export const asyncHandler = async (req, res) => {
  const { method, url } = req
  res.body.push(`async: ${method} ${url}`)
}

export const preHandler = (name) => async (req, res) => {
  await nap()
  res.body.push(name)
}

export const shouldNotHaveHeader = (header) => (res) => {
  assert.ok(!(header in res.headers), `should not have header ${header}`)
}

export const shouldHaveHeaders = (expected) => ({ headers }) => {
  // eslint-disable-next-line no-unused-vars
  const { date, connection, ...other } = headers
  assert.deepEqual(other, expected)
}

export const shouldHaveSomeHeaders = exp => ({ headers }) => {
  Object.entries(exp).forEach(([header, value]) => {
    if (value instanceof RegExp) {
      assert.ok(value.test(headers[header]), `${header} ${value} !== ${headers[header]}`)
    } else if (typeof value === 'boolean' && value === true) {
      assert.ok(header in headers, `${header} : ${headers[header]}`)
    } else if (typeof value === 'boolean' && value === false) {
      assert.ok(!(header in headers), `${header} : ${headers[header]}`)
    } else {
      assert.strictEqual(headers[header], value)
    }
  })
}
