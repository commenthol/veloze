import assert from 'assert'
import { finalHandler, HttpError } from '../../src/index.js'
import { escapeHtmlLit } from '../../src/utils/escapeHtml.js'
import { Request, Response } from '../support/index.js'

const removeFields = (args) => args.map(item => {
  // eslint-disable-next-line no-unused-vars
  const { id, ...other } = item
  return other
})
class Log {
  info (...args) {
    this._info = removeFields(args)
  }

  warn (...args) {
    this._warn = removeFields(args)
  }

  error (...args) {
    this._error = removeFields(args)
  }
}

describe('middleware/finalHandler', function () {
  it('HttpError 400', function () {
    const log = new Log()
    const req = new Request()
    const res = new Response()
    const err = new HttpError(400)
    finalHandler({ log })(err, req, res)
    assert.deepEqual(log, {
      _warn: [
        {
          level: 'warn',
          cause: undefined,
          method: 'GET',
          msg: 'Bad Request',
          stack: undefined,
          status: 400,
          url: '/'
        }
      ]
    })
  })

  it('HttpError 200', function () {
    const log = new Log()
    const req = new Request()
    const res = new Response()
    const err = new HttpError(200, 'Strange Code')
    finalHandler({ log })(err, req, res)
    assert.deepEqual(log, {
      _info: [
        {
          level: 'info',
          cause: undefined,
          method: 'GET',
          msg: 'Strange Code',
          stack: undefined,
          status: 200,
          url: '/'
        }
      ]
    })
  })

  it('HttpError 500 with cause', function () {
    const log = new Log()
    const req = new Request('DELETE', '/error')
    const res = new Response()
    const err = new HttpError(500, '', new Error('boom'))
    finalHandler({ log })(err, req, res)

    const fixStack = stack => stack ? stack.substring(0, 40) : undefined
    const strip = (item) => ({
      ...item,
      stack: fixStack(item.stack),
      cause: fixStack(item.cause)
    })
    log._error[0] = strip(log._error[0])
    assert.deepEqual(log, {
      _error: [
        {
          level: 'error',
          cause: 'Error: boom\n    at Context.<anonymous> (',
          method: 'DELETE',
          msg: 'Internal Server Error',
          stack: 'Error: Internal Server Error\n    at Cont',
          status: 500,
          url: '/error'
        }
      ]
    })
  })

  it('HttpError 404 as html', function () {
    const log = new Log()
    const req = new Request('GET', '/something')
    const res = new Response()
    const err = new HttpError(404)
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.body = undefined

    finalHandler({ log })(err, req, res)

    assert.equal(res.end[0].replace(/<head>[^]*<\/head>/mg, ''),
      '<!DOCTYPE html>\n' +
      '<html lang="en">\n' +
      '\n' +
      '<body>\n' +
      '  <section>\n' +
      '    <h1>404</h1>\n' +
      '    <h2>Not Found</h2>\n' +
      '    <p><a href="/">Homepage</a></p>\n' +
      '  </section>\n' +
      '</body>\n' +
      '</html>\n'
    )
  })

  it('Error', function () {
    const log = new Log()
    const req = new Request('GET', '/something', { 'accept-language': '*' })
    const res = new Response()
    const err = new Error()
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.body = undefined

    finalHandler({ log })(err, req, res)
    assert.ok(/<h2>Oops! That should not have happened!<\/h2>/.test(res.end[0]), res.end[0])
  })

  it('with custom html template', function () {
    const log = new Log()
    const req = new Request('GET', '/something')
    const res = new Response()
    const err = new HttpError(401)
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.body = undefined

    const htmlTemplate = ({ status, message }) => escapeHtmlLit`<h1>${status}</h1><h2>${message}</h2>`

    finalHandler({ log, htmlTemplate })(err, req, res)

    assert.equal(res.end[0], '<h1>401</h1><h2>Unauthorized</h2>')
  })

  it('shall call res.end() if headers are sent', function () {
    class ResponseHeadersSent {
      headersSent = true
      end () {
        this._end = true
      }
    }
    const log = new Log()
    const req = new Request()
    const res = new ResponseHeadersSent()
    const err = new HttpError(401)
    finalHandler({ log })(err, req, res)
    assert.equal(res._end, true)
  })
})
