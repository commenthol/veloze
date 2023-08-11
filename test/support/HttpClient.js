import http from 'node:http'
import https from 'node:https'

export class HttpClient {
  _options = { method: 'GET', headers: {} }
  _baseUrl
  _body
  _server
  _transport

  /**
   * @param {string|import('../types').Handler} baseUrl
   * @param {http.ServerOptions} httpsOptions
   */
  constructor (baseUrl, httpsOptions) {
    if (typeof baseUrl === 'function') {
      const handle = baseUrl
      const proto = httpsOptions ? 'https' : 'http'
      this._transport = proto === 'https' ? https : http
      this._server = this._transport.createServer(handle).listen()
      const { port } = this._server.address()
      this._baseUrl = `${proto}://localhost:${port}`
    } else {
      this._baseUrl = baseUrl
    }
  }

  method (method, path) {
    this._options.method = method.toUpperCase()
    const { protocol, hostname, port, password, username, search, pathname } =
      new URL(this._baseUrl + path)
    Object.assign(this._options, {
      protocol,
      hostname,
      port: port || (protocol === 'https:' ? 443 : 80),
      password,
      username,
      path: pathname + search
    })
    return this
  }

  get (path) {
    return this.method('GET', path)
  }

  post (path) {
    return this.method('POST', path)
  }

  put (path) {
    return this.method('PUT', path)
  }

  patch (path) {
    return this.method('PATCH', path)
  }

  delete (path) {
    return this.method('DELETE', path)
  }

  search (path) {
    return this.method('SEARCH', path)
  }

  set (headers) {
    Object.assign(this._options.headers, headers)
    return this
  }

  send (body) {
    this._body = body
    if (typeof body !== 'string') {
      this._body = JSON.stringify()
      this._options.headers['content-type'] = 'application/json'
    }
    this._options.headers['content-length'] = Buffer.byteLength(this._body)
    return this
  }

  disableTLSCerts () {
    this._options.rejectUnauthorized = false
    return this
  }

  response (onResponseFn) {
    const req = this._transport.request(this._options, (res) => {
      res.on('end', () => {
        this._server.close()
      })
      res.on('error', (_err) => {
        this._server.close()
      })
      onResponseFn(res)
    })
    return req
  }

  then (resolveF) {
    return new Promise((resolve, reject) => {
      const req = this._transport.request(this._options, (res) => {
        res.raw = Buffer.alloc(0)
        res.on('data', (chunk) => {
          res.raw = Buffer.concat([res.raw, chunk])
        })
        res.on('end', () => {
          this._server.close()
          const contentType = res.headers['content-type'] || ''
          if (contentType.startsWith('application/json')) {
            try {
              res.body = JSON.parse(res.raw.toString())
            } catch (e) {}
          } else if (contentType.startsWith('text/')) {
            res.text = res.raw.toString()
          }
          resolve(resolveF(res))
        })
        res.on('error', (err) => {
          this._server.close()
          reject(err)
        })
      })
      req.end()
    })
  }

  catch (errorF) {
    return this.then(() => {})
      .catch(errorF)
      .finally(() => {
        this._server && this._server.close()
      })
  }
}
