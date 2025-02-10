import assert from 'assert'
import { finalHandler, HttpError } from '../../src/index.js'
import { escapeHtmlLit } from '../../src/utils/escapeHtml.js'
import { Request, Response } from '../support/index.js'
import { EVENT_PROC_LOG } from 'debug-level'

const removeFields = (args) =>
  args.map((item) => {
    // eslint-disable-next-line no-unused-vars
    const { id, stack, ...other } = item
    if (stack) {
      const [line] = stack.split(/\n/)
      other.stack = line
    }
    return other
  })

const initProcLog = () => {
  const logs = []
  const logger = (level, namespace, fmt, args) =>
    logs.push([level, namespace, removeFields([fmt, ...args])])
  const off = () => {
    process.off(EVENT_PROC_LOG, logger)
  }
  process.on(EVENT_PROC_LOG, logger)
  return { logs, off }
}

describe('middleware/finalHandler', function () {
  let log
  beforeEach(function () {
    log = initProcLog()
  })
  afterEach(function () {
    log.off()
  })

  it('HttpError 400', function () {
    const req = new Request()
    const res = new Response()
    const err = new HttpError(400)
    finalHandler()(err, req, res)
    assert.deepEqual(log.logs, [
      [
        'WARN',
        'veloze:final',
        [
          {
            method: 'GET',
            msg: 'Bad Request',
            status: 400,
            url: '/'
          }
        ]
      ]
    ])
  })

  it('HttpError 200', function () {
    const req = new Request()
    const res = new Response()
    const err = new HttpError(200, 'Strange Code')
    finalHandler()(err, req, res)
    assert.deepEqual(log.logs, [
      [
        'INFO',
        'veloze:final',
        [
          {
            method: 'GET',
            msg: 'Strange Code',
            status: 200,
            url: '/'
          }
        ]
      ]
    ])
  })

  it('HttpError 500 with cause', function () {
    const req = new Request('DELETE', '/error')
    const res = new Response()
    const err = new HttpError(500, '', new Error('boom'))
    finalHandler()(err, req, res)
    assert.deepEqual(log.logs, [
      [
        'ERROR',
        'veloze:final',
        [
          {
            method: 'DELETE',
            msg: 'Internal Server Error',
            stack: 'Error: boom',
            status: 500,
            url: '/error'
          }
        ]
      ]
    ])
  })

  it('HttpError 404 as html', function () {
    const req = new Request('GET', '/something')
    const res = new Response()
    const err = new HttpError(404)
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.body = undefined

    finalHandler()(err, req, res)

    assert.equal(
      res.end[0].replace(/<head>[^]*<\/head>/gm, ''),
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

    /// shall set content-security-headers here
    assert.deepEqual(res.headers, {
      'content-type': 'text/html; charset=utf-8',
      'content-security-policy':
        "default-src 'self'; font-src 'self' https: data:; img-src 'self' data:; object-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline' https:; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests"
    })
  })

  it('Error', function () {
    const req = new Request('GET', '/something', { 'accept-language': '*' })
    const res = new Response()
    const err = new Error()
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.body = undefined

    finalHandler()(err, req, res)
    assert.ok(
      /<h2>Oops! That should not have happened!<\/h2>/.test(res.end[0]),
      res.end[0]
    )
  })

  it('not an error at all...', function () {
    const req = new Request('GET', '/something', { 'accept-language': '*' })
    const res = new Response()
    const err = null
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.body = undefined

    finalHandler()(err, req, res)
    assert.ok(
      /<h2>Oops! That should not have happened!<\/h2>/.test(res.end[0]),
      res.end[0]
    )
  })

  it('with custom html template', function () {
    const req = new Request('GET', '/something')
    const res = new Response()
    const err = new HttpError(401)
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.body = undefined

    const htmlTemplate = ({ status, message }) =>
      escapeHtmlLit`<h1>${status}</h1><h2>${message}</h2>`

    finalHandler({ htmlTemplate })(err, req, res)

    assert.equal(res.end[0], '<h1>401</h1><h2>Unauthorized</h2>')
  })

  it('shall call res.end() if headers are sent', function () {
    class ResponseHeadersSent {
      headersSent = true
      end() {
        this._end = true
      }
    }
    const req = new Request()
    const res = new ResponseHeadersSent()
    const err = new HttpError(401)
    finalHandler()(err, req, res)
    assert.equal(res._end, true)
  })
})
