import supertest from 'supertest'
import express from 'express'
import { Router } from '../../src/index.js'

describe('interop/express', function () {
  it('express shall mount a router', async function () {
    const router = new Router()
    router.get('/', (req, res) => res.end('hi'))
    const app = express()
    app.use(router.handle)

    await supertest(app)
      .get('/')
      .expect(200, 'hi')
  })
})
