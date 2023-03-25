import http2 from 'node:http2'

const PATH = ':path'
const METHOD = ':method'

export class Http2Client {
  #connect = { [METHOD]: 'GET', [PATH]: '/' }
  #options = {}
  #baseUrl
  #body
  #server

  /**
   * @param {string|import('../types').Handler} baseUrl
   * @param {http2.SecureServerOptions} httpsOptions
   */
  constructor (baseUrl, httpsOptions) {
    if (typeof baseUrl === 'function') {
      const handle = baseUrl
      const httpsOptionsExt = { allowHTTP1: true, ...httpsOptions }
      this.#server = httpsOptions
        ? http2.createSecureServer(httpsOptionsExt, handle).listen()
        : http2.createServer(handle).listen()
      const { port } = this.#server.address()
      const proto = httpsOptions ? 'https' : 'http'
      this.#baseUrl = `${proto}://localhost:${port}`
    } else {
      this.#baseUrl = baseUrl
    }
  }

  method (method, path) {
    this.#connect[METHOD] = method.toUpperCase()
    this.#connect[PATH] = path
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
    Object.assign(this.#connect, headers)
    return this
  }

  send (body) {
    this.#body = body
    if (typeof body !== 'string') {
      this.#body = JSON.stringify()
      this.#connect['content-type'] = 'application/json'
    }
    this.#connect['content-length'] = Buffer.byteLength(this.#body)
    return this
  }

  disableTLSCerts () {
    this.#options.rejectUnauthorized = false
    return this
  }

  then (resolveF) {
    return new Promise((resolve, reject) => {
      const client = http2.connect(this.#baseUrl, this.#options)
      client.on('error', (err) => {
        reject(err)
      })
      const req = client.request(this.#connect)
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
      req.end(this.#body)
    }).finally(() => {
      this.#server && this.#server.close()
    })
  }

  catch (errorF) {
    return this.then(() => { })
      .catch(errorF)
      .finally(() => {
        this.#server && this.#server.close()
      })
  }
}
