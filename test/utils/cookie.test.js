import assert from 'assert'
import { cookieParse, cookieSerialize } from '../../src/utils/index.js'

describe('utils/cookie', function () {
  describe('cookieParse', function () {
    it('empty string', function () {
      assert.deepStrictEqual(cookieParse(), Object.create(null))
    })

    it('cookie string', function () {
      assert.deepStrictEqual(
        cookieParse(
          '_foobar=FB.1.12.24; flag; preferred_color_mode=light; tz=Asia%2FTokyo'
        ),
        Object.assign(Object.create(null), {
          _foobar: 'FB.1.12.24',
          flag: true,
          preferred_color_mode: 'light',
          tz: 'Asia/Tokyo'
        })
      )
    })

    it('shall not pollute prototype', function () {
      const cookies = cookieParse(
        '__proto__=foo;constructor=bar;hasOwnProperty=baz;toString=qux;prototype=quux'
      )
      const proto = Object.getPrototypeOf(cookies)
      assert.strictEqual(proto, null)
      assert.deepEqual(cookies, {
        prototype: 'quux'
      })
    })
  })

  describe('cookieSerialize', function () {
    it('empty string', function () {
      try {
        cookieSerialize()
        throw new Error('fail')
      } catch (e) {
        assert.strictEqual(e.message, 'invalid name')
      }
    })

    it('name value', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar or bär'),
        'foo=bar%20or%20b%C3%A4r; HttpOnly; Secure; SameSite=Strict'
      )
    })
    it('maxAge', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { maxAge: 10e3 }),
        'foo=bar; Max-Age=10000; HttpOnly; Secure; SameSite=Strict'
      )
    })
    it('domain', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { domain: 'foo.bar' }),
        'foo=bar; Domain=foo.bar; HttpOnly; Secure; SameSite=Strict'
      )
    })
    it('invalid domain', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { domain: 'f😀o.bar' }),
        'foo=bar; HttpOnly; Secure; SameSite=Strict'
      )
    })
    it('path', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { path: '/foobar' }),
        'foo=bar; Path=/foobar; HttpOnly; Secure; SameSite=Strict'
      )
    })
    it('invalid path', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { path: 'f😀o.bar' }),
        'foo=bar; HttpOnly; Secure; SameSite=Strict'
      )
    })
    it('expires', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { expires: 0 }),
        'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict'
      )
    })
    it('expires string', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { expires: '01 Jan 1970 00:00:00 GMT' }),
        'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict'
      )
    })
    it('expires Date', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', {
          expires: new Date('01 Jan 1970 00:00:00 GMT')
        }),
        'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict'
      )
    })
    it('invalid expires', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { expires: 'foobar' }),
        'foo=bar; HttpOnly; Secure; SameSite=Strict'
      )
    })
    it('no httpOnly', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { httpOnly: false }),
        'foo=bar; Secure; SameSite=Strict'
      )
    })
    it('no httpOnly, no sameSite', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { httpOnly: false, sameSite: false }),
        'foo=bar; Secure'
      )
    })
    it('sameSite Lax', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { sameSite: 'Lax' }),
        'foo=bar; HttpOnly; Secure; SameSite=Lax'
      )
    })
    it('secure', function () {
      assert.strictEqual(
        cookieSerialize('foo', 'bar', { secure: true }),
        'foo=bar; HttpOnly; Secure; SameSite=Strict'
      )
    })
  })
})
