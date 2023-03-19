import assert from 'assert'
import supertest from 'supertest'
import { Router, Server, send } from '../src/index.js'
import { Http2Client } from './support/Http2Client.js'

describe('Server', function () {
  let app

  const key = new URL('./support/certs/foo.bar.key', import.meta.url)
  const cert = new URL('./support/certs/foo.bar.crt', import.meta.url)
  const pfx = new URL('./support/certs/foo.bar.pfx', import.meta.url)
  const passphrase = new URL('./support/certs/foo.bar.pass', import.meta.url)

  before(function () {
    app = new Router()
    app.use(send)
    app.get('/', (req, res) => {
      const { httpVersion } = req
      const isHttps = req.socket?.encrypted || false
      res.send({ httpVersion, isHttps })
    })
  })

  it('shall start a http1 server', async function () {
    const server = new Server({ onlyHTTP1: true })
    server.use('/', app.handle)
    server.listen()
    const { port } = server.address()

    await supertest(`http://localhost:${port}`)
      .get('/')
      .expect(200)
      .expect({ httpVersion: '1.1', isHttps: false })

    server.close()
  })

  it('shall start a http1 secure server', async function () {
    const server = new Server({ onlyHTTP1: true, key, cert })
    server.use('/', app.handle)
    server.listen()
    const { port } = server.address()

    await supertest(`https://localhost:${port}`)
      .get('/')
      .disableTLSCerts()
      .expect(200)
      .expect({ httpVersion: '1.1', isHttps: true })

    server.close()
  })

  it('shall start a http1 secure server using pfx and passphrase', async function () {
    const server = new Server({ onlyHTTP1: true, pfx, passphrase })
    server.use('/', app.handle)
    server.listen()
    const { port } = server.address()

    await supertest(`https://localhost:${port}`)
      .get('/')
      .disableTLSCerts()
      .expect(200)
      .expect({ httpVersion: '1.1', isHttps: true })

    server.close()
  })

  it('shall start a http2 server', async function () {
    const server = new Server()
    server.use('/', app.handle)
    server.listen()
    const { port } = server.address()

    const res = await new Http2Client(`http://localhost:${port}`)
      .get('/')
      .disableTLSCerts()
      .then(res => res)
    assert.deepEqual(res.body, { httpVersion: '2.0', isHttps: false })

    server.close()
  })

  it('shall start a http2 secure server', async function () {
    const server = new Server({ key, cert })
    server.use('/', app.handle)
    server.listen()
    const { port } = server.address()

    const res = await new Http2Client(`https://localhost:${port}`)
      .get('/')
      .disableTLSCerts()
      .then(res => res)
    assert.deepEqual(res.body, { httpVersion: '2.0', isHttps: true })

    server.close()
  })
})
