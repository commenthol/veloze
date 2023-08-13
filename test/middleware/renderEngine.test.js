import assert from 'assert'
import supertest from 'supertest'
import consolidate from 'consolidate'
import hbs from 'express-hbs'
import { Router, renderEngine, finalHandler } from '../../src/index.js'

const createApp = ({ finalHandler } = {}) => {
  const viewsRoot = new URL('../views', import.meta.url)

  const ejsRouter = new Router()
  ejsRouter.use(renderEngine({
    ext: 'ejs',
    engine: consolidate.ejs,
    views: viewsRoot,
    locals: { app: 'this app' }
  }))
  ejsRouter.get('/', (req, res) => {
    res.locals = { headline: 'It work\'s' }
    res.render('home', { title: 'home' })
  })
  ejsRouter.get('/not-there', (req, res) => {
    res.render('not-there')
  })
  ejsRouter.get('/error', (req, res) => {
    res.render('error', { title: 'error', headline: 'Error' })
  })
  ejsRouter.get('/test-index', (req, res) => {
    res.render('test')
  })

  const hbsRouter = new Router()
  hbsRouter.use(renderEngine({
    ext: '.hbs', // use extension with or without leading dot.
    engine: hbs.express4(),
    views: viewsRoot,
    locals: { app: 'this app' },
    pathCache: new Map() // always use a Cache for filenames
  }))
  hbsRouter.get('/', (req, res) => {
    res.locals = { headline: 'It work\'s' }
    res.render('home', { title: 'home' })
  })

  const app = new Router({ finalHandler })
  app.use('/ejs', ejsRouter.handle)
  app.use('/hbs', hbsRouter.handle)
  return app
}

const noop = () => null
const log = { debug: noop, info: noop, warn: noop, error: noop }
const finalHandlerTest = (result) => (err, req, res, next) => {
  result.err = err
  finalHandler({ log })(err, req, res, next)
}

const ST_OPTS = { http2: true }

describe('middleware/render', function () {
  it('shall render ejs template', function () {
    return supertest(createApp().handle, ST_OPTS)
      .get('/ejs')
      .expect(200)
      .expect('content-type', 'text/html; charset=utf-8')
      .expect('<html>\n<head>\n<title>home</title>\n</head>\n<body>\n<h1>It work&#39;s</h1>\n<p>this app</p>\n</body>\n</html>\n')
  })

  it('shall lookup template at test/index.ejs', function () {
    return supertest(createApp().handle, ST_OPTS)
      .get('/ejs/test-index')
      .expect(200)
      .expect('content-type', 'text/html; charset=utf-8')
      .expect('<h1>Test</h1>')
  })

  it('shall fail if render template is not present', function () {
    const result = {}
    const finalHandler = finalHandlerTest(result)

    return supertest(createApp({ finalHandler }).handle, ST_OPTS)
      .get('/ejs/not-there')
      .expect(500, /<h2>Template Error<\/h2>/)
      .expect('content-type', 'text/html; charset=utf-8')
      .then(() => {
        assert.ok(/^Error: template "not-there" not found under/.test(result.err.cause), result.err.cause)
      })
  })

  it('shall fail if render template throws error', function () {
    const result = {}
    const finalHandler = finalHandlerTest(result)

    return supertest(createApp({ finalHandler }).handle, ST_OPTS)
      .get('/ejs/error')
      .expect(500, /<h2>Template Error<\/h2>/)
      .expect('content-type', 'text/html; charset=utf-8')
      .then(() => {
        assert.ok(/^Error: Could not find matching close tag for/.test(result.err.cause), result.err.cause)
      })
  })

  it('shall render hbs template', function () {
    return supertest(createApp().handle, ST_OPTS)
      .get('/hbs')
      .expect(200)
      .expect('content-type', 'text/html; charset=utf-8')
      .expect("<!DOCTYPE html>\n<html>\n\n<head>\n  <meta charset=\"utf-8\">\n  <title>home</title>\n</head>\n\n<body>\n  \n<h1>It work's</h1>\n\n</body>\n\n</html>")
  })
})
