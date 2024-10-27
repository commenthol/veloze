import supertest from 'supertest'
import { bodyParser, connect } from '../../src/index.js'

const nodeVersion = Number(process.version.slice(1).split('.')[0])

const ST_OPTS = { http2: true }

const echo = (req, res) => {
  const body = req.body
  const type = req.headers['content-type']
  res.setHeader('content-type', 'application/json')
  res.end(JSON.stringify({ body, type }))
}

// eslint-disable-next-line no-unused-vars
const final = (err, req, res, next) => {
  res.statusCode = err.status || 500
  req.body = { error: err.message }
  echo(req, res)
}

describe('middleware/bodyParser', function () {
  it('should parse url encoded', function () {
    const app = connect(bodyParser(), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .send('test12345')
      .expect(200, {
        body: { test12345: '' },
        type: 'application/x-www-form-urlencoded'
      })
  })

  it('should limit upload with 413', function () {
    const text = new Array(1000).fill('x').join('')
    const app = connect(bodyParser({ limit: 100 }), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .send(text)
      .expect(413, {
        body: { error: 'upload limit of 100 bytes' },
        type: 'application/x-www-form-urlencoded'
      })
    // .then(res => console.log(res))
  })

  // HTTP2 mode throws NGHTTP2_PROTOCOL_ERROR as not being a valid request node@20.5.0
  it('should limit upload with 400 if content-length is wrong HTTP/1', function () {
    const text = new Array(2000).fill('x').join('')
    const app = connect(bodyParser({ limit: '1kB' }), echo, final)
    const req = supertest(app).post('/').send(text).set('content-length', 10)
    if (nodeVersion < 22) {
      return req.expect(200, {
        body: { xxxxxxxxxx: '' },
        type: 'application/x-www-form-urlencoded'
      })
    } else {
      return req.expect(400)
    }
  })

  it('should parse json', function () {
    const payload = { test: 123 }
    const app = connect(bodyParser(), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .set('content-type', 'application/json; charset=utf-8')
      .send(payload)
      .expect(200, {
        body: { test: 123 },
        type: 'application/json; charset=utf-8'
      })
  })

  it('should fail with 400 on json parse', function () {
    const payload = 'test: 123'
    const app = connect(bodyParser(), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .set('content-type', 'application/json')
      .send(payload)
      .expect(400, {
        body: { error: 'json parse error' },
        type: 'application/json'
      })
  })

  it('should parse urlencoded', function () {
    const payload = { test: 123, foo: 'bar', emoji: '🌈🦄' }
    const app = connect(bodyParser(), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .type('form')
      .send(payload)
      .expect(200, {
        body: { test: '123', foo: 'bar', emoji: '🌈🦄' },
        type: 'application/x-www-form-urlencoded'
      })
  })

  it('should parse raw', function () {
    const payload = Buffer.from('abcdefghij')
    const app = connect(bodyParser(), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .type('application/octet-stream')
      .send(payload)
      .expect(200, {
        body: {
          type: 'Buffer',
          data: [97, 98, 99, 100, 101, 102, 103, 104, 105, 106]
        },
        type: 'application/octet-stream'
      })
  })

  it('should parse raw if mime-type is set to text/plain', function () {
    const payload = Buffer.from('abcdefghij')
    const app = connect(bodyParser({ typeRaw: 'text/plain' }), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .type('text/plain')
      .send(payload)
      .expect(200, {
        body: {
          type: 'Buffer',
          data: [97, 98, 99, 100, 101, 102, 103, 104, 105, 106]
        },
        type: 'text/plain'
      })
  })

  it('should pass on get HTTP/1', function () {
    const payload = { test: 123, foo: 'bar', emoji: '🌈🦄' }
    const app = connect(bodyParser(), echo, final)
    return supertest(app)
      .get('/')
      .type('json')
      .send(payload) // get + send won't work in HTTP/2
      .expect(200, {
        type: 'application/json'
      })
  })

  it('should parse get if set in methods HTTP/1', function () {
    const payload = { test: 123, foo: 'bar', emoji: '🌈🦄' }
    const app = connect(bodyParser({ methods: ['GET'] }), echo, final)
    return supertest(app)
      .get('/')
      .type('json')
      .send(payload) // get + send won't work in HTTP/2
      .expect(200, {
        body: { test: 123, foo: 'bar', emoji: '🌈🦄' },
        type: 'application/json'
      })
  })

  it('shall correct limit', function () {
    const payload = null
    const app = connect(bodyParser({ limit: 'aaa' }), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .type('json')
      .send(payload)
      .expect(200, {
        body: null,
        type: 'application/json'
      })
  })

  it('shall only parse json', function () {
    const payload = null
    const app = connect(bodyParser.json(), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .type('json')
      .send(payload)
      .expect(200, {
        body: null,
        type: 'application/json'
      })
  })

  it('shall only parse json fails', function () {
    const payload = 'test=1'
    const app = connect(bodyParser.json(), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .type('form')
      .send(payload)
      .expect(200, {
        type: 'application/x-www-form-urlencoded'
      })
  })

  it('shall only parse urlEncoded', function () {
    const payload = null
    const app = connect(bodyParser.urlEncoded(), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .type('json')
      .send(payload)
      .expect(200, {
        type: 'application/json'
      })
  })

  it('shall only parse urlEncoded fails', function () {
    const payload = { test: 1 }
    const app = connect(bodyParser.urlEncoded(), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .type('json')
      .send(payload)
      .expect(200, {
        type: 'application/json'
      })
  })

  it('shall only parse raw', function () {
    const payload = 'abcd'
    const app = connect(bodyParser.raw({ typeRaw: 'text/plain' }), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .set('content-type', 'text/plain')
      .send(payload)
      .expect(200, {
        body: { type: 'Buffer', data: [97, 98, 99, 100] },
        type: 'text/plain'
      })
  })

  it('shall only parse raw fails', function () {
    const payload = { test: 1 }
    const app = connect(bodyParser.urlEncoded(), echo, final)
    return supertest(app, ST_OPTS)
      .post('/')
      .type('json')
      .send(payload)
      .expect(200, {
        type: 'application/json'
      })
  })
})
