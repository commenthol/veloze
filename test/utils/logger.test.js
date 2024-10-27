import assert from 'node:assert/strict'
import supertest from 'supertest'
import { utils, Router } from '../../src/index.js'

describe('utils/logger', function () {
  let stack = []

  before(function () {
    const myLogger = (namespace) => {
      const log =
        (level) =>
        (...args) =>
          stack.push([level.toUpperCase(), namespace, ...args])
      return {
        debug: log('debug'),
        info: log('info'),
        warn: log('warn'),
        error: log('error')
      }
    }
    utils.setLogger(myLogger)
  })

  afterEach(function () {
    stack = []
  })

  it('shall log to custom logger', async function () {
    const app = new Router()

    await supertest(app.handle).get('/').expect(404)

    stack[0][2].id = null

    assert.deepEqual(stack, [
      [
        'WARN',
        'veloze:final',
        {
          id: null,
          method: 'GET',
          msg: 'Not Found',
          stack: undefined,
          status: 404,
          url: '/'
        }
      ]
    ])
  })
})
