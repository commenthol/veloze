import supertest from 'supertest'
import assert from 'node:assert/strict'
import { onWriteHead } from '../../src/response/onWriteHead.js'
import { shouldHaveSomeHeaders } from '../support/index.js'

describe('response/onWriteHead', function () {
  it('should set header on write', async function () {
    const handle = (req, res) => {
      onWriteHead(res, (res) => {
        res.setHeader('x-test', '1')
      })
      res.setHeader('x-test', '0')
      res.setHeader('x-foo', 'bar')
      res.end()
    }

    await supertest(handle)
      .get('/')
      .expect(200)
      .expect(shouldHaveSomeHeaders({
        'x-foo': 'bar',
        'x-test': '1'
      }))
  })

  it('should set statuscode on write', async function () {
    const handle = (req, res) => {
      onWriteHead(res, (res) => {
        res.statusCode = 401
      })
      res.end()
    }

    await supertest(handle)
      .get('/')
      .expect(401)
  })

  it('shall give res.writeHead headers precedence', async function () {
    const handle = (req, res) => {
      onWriteHead(res, (res) => {
        res.setHeader('x-test', '0')
      })
      res.writeHead(201, { 'x-test': '1', 'x-foo': 'bar' })
      res.end()
    }

    await supertest(handle)
      .get('/')
      .expect(201)
      .expect(shouldHaveSomeHeaders({
        'x-foo': 'bar',
        'x-test': '1'
      }))
      .then((res) => {
        assert.equal(res.res.statusMessage, 'Created')
      })
  })

  it('shall give res.writeHead array headers precedence', async function () {
    const handle = (req, res) => {
      onWriteHead(res, (res) => {
        res.setHeader('x-test', '0')
        res.setHeader('x-wat', 'man')
      })
      res.writeHead(201, [['x-test', '1'], ['x-foo', 'bar']])
      res.end()
    }

    await supertest(handle)
      .get('/')
      .expect(201)
      .expect(shouldHaveSomeHeaders({
        'x-foo': 'bar',
        'x-wat': 'man',
        'x-test': '1'
      }))
      .then((res) => {
        assert.equal(res.res.statusMessage, 'Created')
      })
  })

  it('shall pass statusMessage', async function () {
    const handle = (req, res) => {
      onWriteHead(res, (res) => {
        res.setHeader('x-test', '0')
        res.setHeader('x-wat', 'man')
      })
      res.writeHead(201, 'Yes created', { 'x-test': '1', 'x-foo': 'bar' })
      res.end()
    }

    await supertest(handle)
      .get('/')
      .expect(201)
      .expect(shouldHaveSomeHeaders({
        'x-foo': 'bar',
        'x-wat': 'man',
        'x-test': '1'
      }))
      .then((res) => {
        assert.equal(res.res.statusMessage, 'Yes created')
      })
  })

  it('should throw if onWriteHead was called without response object', async function () {
    const handle = (req, res) => {
      try {
        onWriteHead()
        res.end()
      } catch (err) {
        res.statusCode = 500
        res.end(err.message)
      }
    }

    await supertest(handle)
      .get('/')
      .expect(500, 'need request')
  })

  it('should throw if onWriteHead has no listener', async function () {
    const handle = (req, res) => {
      try {
        onWriteHead(res)
        res.end()
      } catch (err) {
        res.statusCode = 500
        res.end(err.message)
      }
    }

    await supertest(handle)
      .get('/')
      .expect(500, 'listener must be a function')
  })
})
