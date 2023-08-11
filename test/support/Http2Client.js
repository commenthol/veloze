import http2 from 'node:http2'

const PATH = ':path'
const METHOD = ':method'

export class Http2Client {
  _connect = { [METHOD]: 'GET', [PATH]: '/' }
  _options = {}
  _baseUrl
  _body
  _server

  /**
   * @param {string|import('../types').Handler} baseUrl
   * @param {http2.SecureServerOptions} httpsOptions
   */
  constructor (baseUrl, httpsOptions) {
    if (typeof baseUrl === 'function') {
      const handle = baseUrl
      const httpsOptionsExt = { allowHTTP1: true, ...httpsOptions }
      this._server = httpsOptions
        ? http2.createSecureServer(httpsOptionsExt, handle).listen()
        : http2.createServer(handle).listen()
      const { port } = this._server.address()
      const proto = httpsOptions ? 'https' : 'http'
      this._baseUrl = `${proto}://localhost:${port}`
    } else {
      this._baseUrl = baseUrl
    }
  }

  method (method, path) {
    this._connect[METHOD] = method.toUpperCase()
    this._connect[PATH] = path
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
    Object.assign(this._connect, headers)
    return this
  }

  send (body) {
    this._body = body
    if (typeof body !== 'string') {
      this._body = JSON.stringify()
      this._connect['content-type'] = 'application/json'
    }
    this._connect['content-length'] = Buffer.byteLength(this._body)
    return this
  }

  disableTLSCerts () {
    this._options.rejectUnauthorized = false
    return this
  }

  request () {
    const client = http2.connect(this._baseUrl, this._options)
    client.on('error', (_err) => {
      client.close()
      this._server && this._server.close()
    })
    const req = client.request(this._connect)
    req.on('end', () => {
      client.close()
      this._server && this._server.close()
    })
    return req
  }

  then (resolveF) {
    return new Promise((resolve, reject) => {
      const client = http2.connect(this._baseUrl, this._options)
      client.on('error', (err) => {
        reject(err)
      })
      const req = client.request(this._connect)
      const res = { headers: {}, raw: Buffer.alloc(0) }
      req.on('response', (headers) => {
        for (const [name, value] of Object.entries(headers)) {
          switch (name) {
            case ':status':
              res.status = value
              break
            default:
              res.headers[name] = value
              break
          }
        }
      })
      req.on('data', (chunk) => {
        res.raw = Buffer.concat([res.raw, chunk])
      })
      req.on('end', () => {
        client.close()
        const contentType = res.headers['content-type']
        if (contentType && contentType.startsWith('application/json')) {
          try {
            res.body = JSON.parse(res.raw.toString())
          } catch (e) {}
        }
        resolve(resolveF(res))
      })
      req.on('error', (err) => {
        client.close()
        reject(err)
      })
      req.end(this._body)
    }).finally(() => {
      this._server && this._server.close()
    })
  }

  catch (errorF) {
    return this.then(() => { })
      .catch(errorF)
      .finally(() => {
        this._server && this._server.close()
      })
  }
}
