import assert from 'assert/strict'
import { FindRoute } from '../src/index.js'

describe('FindRoute', function () {
  let tree
  before(function () {
    tree = new FindRoute(0)
    tree.add('GET', '/', 'GET /')
    tree.add('POST', '/', 'POST /')
    tree.add('ALL', '/', 'ALL /')
    tree.add('GET', '/folder', 'GET /folder')
    tree.add('ALL', '/wildcard/*', 'ALL /wildcard/*')
    tree.add('GET', '/wildcard', 'GET /wildcard')
    tree.add('GET', '/wildcard/path', 'GET /wildcard/path')
  })

  it('prints the routing tree', function () {
    tree.print()
  })

  it('find route', function () {
    const found = tree.find({ method: 'GET', url: '/?foo=bar' })
    assert.deepEqual(found, {
      handler: 'GET /',
      params: {}
    })
  })

  it('find ALL route', function () {
    const found = tree.find({ method: 'PUT', url: '/?foo=bar' })
    assert.deepEqual(found, {
      handler: 'ALL /',
      params: {}
    })
  })

  it('find route with param', function () {
    tree.add('GET', '/params/:user', 'GET /params/:user')
    // tree.print()
    const found = tree.find({ method: 'GET', url: '/params/tony' })
    assert.deepEqual(found, {
      handler: 'GET /params/:user',
      params: { user: 'tony' }
    })
  })

  it('shall not find route', function () {
    const found = tree.find({ method: 'GET', url: '/404' })
    assert.equal(found, undefined)
  })

  it('find route with params', function () {
    tree.add('GET', '/params/:user/ids/:id', 'GET /params/:user/ids/:id')
    // tree.print()
    const found = tree.find({ method: 'GET', url: '/params/tony/ids/1234' })
    assert.deepEqual(found, {
      handler: 'GET /params/:user/ids/:id',
      params: { user: 'tony', id: '1234' }
    })
  })

  it('find wildcard route', function () {
    const found = tree.find({ method: 'GET', url: '/wildcard/test/ids/1234' })
    assert.deepEqual(found, {
      handler: 'ALL /wildcard/*',
      params: {}
    })
  })

  it('find exact wildcard route', function () {
    const found = tree.find({ method: 'GET', url: '/wildcard' })
    assert.deepEqual(found, {
      handler: 'GET /wildcard',
      params: {}
    })
  })

  it('find exact wildcard sub-path route', function () {
    const found = tree.find({ method: 'GET', url: '/wildcard/path' })
    assert.deepEqual(found, {
      handler: 'GET /wildcard/path',
      params: {}
    })
  })

  it('find last wildcard handler for unknown method', function () {
    const found = tree.find({ method: 'POST', url: '/wildcard/path' })
    assert.deepEqual(found, {
      handler: 'ALL /wildcard/*',
      params: {}
    })
  })

  describe('cacheSize > 0', function () {
    let tree
    before(function () {
      tree = new FindRoute(1)
      tree.add('GET', '/', 'GET /')
      tree.add('GET', '/:hello', 'GET /:hello')
    })

    it('shall add found route to cache', function () {
      const found = tree.find({ method: 'GET', url: '/' })
      assert.deepEqual(found, {
        handler: 'GET /',
        params: {}
      })
      assert.equal(tree._cache.has('GET/'), true)
    })

    it('shall read from cache', function () {
      const found = tree.find({ method: 'GET', url: '/' })
      assert.deepEqual(found, {
        handler: 'GET /',
        params: {}
      })
    })

    it('shall create fresh', function () {
      const found = tree.find({ method: 'GET', url: '/kitty' })
      assert.deepEqual(found, {
        handler: 'GET /:hello',
        params: { hello: 'kitty' }
      })
      assert.equal(tree._cache.has('GET/'), false)
      assert.equal(tree._cache.has('GET/kitty'), true)
    })

    it('shall again read from cache', function () {
      const found = tree.find({ method: 'GET', url: '/kitty' })
      assert.deepEqual(found, {
        handler: 'GET /:hello',
        params: { hello: 'kitty' }
      })
    })
  })
})
