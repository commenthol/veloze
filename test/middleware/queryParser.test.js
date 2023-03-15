import assert from 'assert'
import { queryParser } from '../../src/middleware/queryParser.js'
import { Request } from '../support/index.js'

describe('middleware/queryParser', function () {
  it('shall parse query string', function (done) {
    const req = new Request('GET', '/home/user?a=0&b=foo&a=1&a=2')
    const res = {}

    queryParser(req, res, () => {
      assert.strictEqual(req.path, '/home/user')
      assert.deepStrictEqual(req.query, {
        a: '2',
        b: 'foo'
      })
      done()
    })
  })
})
