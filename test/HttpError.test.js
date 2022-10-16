import assert from 'assert'
import { HttpError } from '../src/HttpError.js'

describe('HttpError', function () {
  it('no status', function () {
    const err = new HttpError()
    assert.equal(err.message, 'general error')
    assert.equal(err.status, 500)
  })

  it('only status', function () {
    const err = new HttpError(400)
    assert.equal(err.message, 'Bad Request')
    assert.equal(err.status, 400)
  })

  it('with message', function () {
    const err = new HttpError(401, 'Missing Authentication')
    assert.equal(err.message, 'Missing Authentication')
    assert.equal(err.status, 401)
  })

  it('with error cause', function () {
    const cause = new Error('boom')
    const err = new HttpError(402, 'Uh oh', cause)
    assert.equal(err.message, 'Uh oh')
    assert.equal(err.status, 402)
    assert.equal(err.cause.message, 'boom')
  })
})
