import supertest from 'supertest'
import { Router, queryParser, response } from '../../src/index.js'
import { shouldHaveHeaders } from '../support/index.js'

const { redirect } = response

describe('response/redirect', function () {
  const app = new Router()
  app.all('/*',
    queryParser,
    (req, res) => {
      if (req.headers['content-type']) {
        res.setHeader('content-type', req.headers['content-type'])
      }
      redirect(res, req.query.location, req.query.status)
    }
  )
  const handle = app.handle

  it('shall redirect', function () {
    const location = 'https://foo.bar'
    return supertest(handle)
      .get('/')
      .query({
        location: 'https://foo.bar'
      })
      .expect(307, '')
      .expect(shouldHaveHeaders({
        'content-length': '0',
        location
      }))
  })

  it('shall redirect with html response', function () {
    const location = 'https://foo.bar'
    return supertest(handle)
      .get('/')
      .set('content-type', 'text/html; charset=utf-8')
      .query({
        location: 'https://foo.bar'
      })
      .expect(307, /^<!DOCTYPE html>/)
      .expect(shouldHaveHeaders({
        'content-length': '234',
        'content-security-policy': "default-src 'self'",
        'content-type': 'text/html; charset=utf-8',
        location
      }))
  })

  it('shall permanently redirect with 308', function () {
    const location = 'https://foo.bar'
    return supertest(handle)
      .post('/')
      .query({
        location: 'https://foo.bar',
        status: 308
      })
      .expect(308, '')
      .expect(shouldHaveHeaders({
        'content-length': '0',
        location
      }))
  })

  it('shall redirect a head request', function () {
    const location = 'https://foo.bar'
    return supertest(handle)
      .head('/')
      .set('content-type', 'text/html; charset=utf-8')
      .query({
        location: 'https://foo.bar',
        status: 307
      })
      .expect(307, undefined)
      .expect(shouldHaveHeaders({
        'content-type': 'text/html; charset=utf-8',
        location
      }))
  })

  it('shall fallback to redirect with 307 if status is wrong', function () {
    const location = 'https://foo.bar'
    return supertest(handle)
      .get('/')
      .query({
        location: 'https://foo.bar',
        status: 500
      })
      .expect(307)
      .expect(shouldHaveHeaders({
        'content-length': '0',
        location
      }))
  })
})
