import supertest from 'supertest'
import express from 'express'
import { Router } from '../../src/index.js'

describe('interop/express', function () {
  it('express shall mount a router', async function () {
    const router = new Router()
    router.get('/', (_req, res) => res.end('hi from veloze'))

    const app = express()
    app.use(router.handle)

    await supertest(app).get('/').expect(200, 'hi from veloze')
  })

  it('shall mount and express router', async function () {
    const router = express.Router()
    router.get('/', (_req, res) => res.end('hi from express'))

    const app = new Router()
    // need a path here, otherwise router handler is only a preHook
    app.use('/', router)

    await supertest(app.handle).get('/').expect(200, 'hi from express')
  })
})
