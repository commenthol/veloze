import assert from 'node:assert/strict'
import supertest from 'supertest'
import { basicAuth } from '../../src/middleware/basicAuth.js'
import { connect } from '../../src/index.js'

const ST_OPTS = { http2: true }

describe('middleware/basicAuth', function () {
  let app
  before(function () {
    const users = { foo: 'bar', '🌈': '👏🏽', valid: 'in:val:id' }
    app = connect(
      basicAuth({ users }),
      (req, res) => {
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify(req.auth))
      },
      (err, req, res, _next) => {
        res.statusCode = err.status || 500
        res.end(err.message)
      }
    )
  })

  it('shall throw if no users are provided', function () {
    assert.throws(() => {
      basicAuth()
    }, /^Error: need at least one user$/)
  })

  it('shall fail for un-authenticated request', async function () {
    await supertest(app, ST_OPTS)
      .get('/')
      .expect(401)
      .expect('www-authenticate', 'Basic realm="Secure", charset="UTF-8"')
  })

  it('shall fail for un-authenticated unknown user', async function () {
    await supertest(app, ST_OPTS)
      .get('/')
      .auth('john', '123')
      .expect(401)
  })

  it('shall authenticate user foo', async function () {
    await supertest(app, ST_OPTS)
      .get('/')
      .auth('foo', 'bar')
      .expect(200)
      .expect({ username: 'foo' })
  })

  it('shall authenticate user 🌈', async function () {
    await supertest(app, ST_OPTS)
      .get('/')
      .auth('🌈', '👏🏽')
      .expect(200)
      .expect({ username: '🌈' })
  })

  it('shall authenticate user with colon in password', async function () {
    await supertest(app, ST_OPTS)
      .get('/')
      .auth('valid', 'in:val:id')
      .expect(200)
      .expect({ username: 'valid' })
  })
})
