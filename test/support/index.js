import assert from 'assert'

export const nap = (ms = 1) => new Promise((resolve) => setTimeout(() => resolve(ms), ms))

export class Request {
  constructor (method, url) {
    this.headers = {}
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
