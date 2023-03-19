/**
 * This example shows how to use the redirect2Https middleware
 *
 * requires a certificate; run `./scripts/certs.sh` before.
 */

import { Server, csp, send, redirect2Https } from '../src/index.js'

const page = `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <title>Works</title>
  </head>
  <body>
    <h1>Works</h1>
  </body>
</html>`

/// defining the http1 server for redirecting to https
const sHttp = new Server({ onlyHTTP1: true })
sHttp.all('/*', redirect2Https({
  redirectUrl: 'https://localhost:3443/path', /// redirect to different port and path!
  allowedHosts: ['foo.bar'] /// enables "foo.bar" or "localhost" as host name; set `127.0.0.1 foo.bar` in `/etc/hosts` first
}))
sHttp.listen(3000)

/// defining the secure http2 server for the application
const key = new URL('../test/support/certs/foo.bar.key', import.meta.url)
const cert = new URL('../test/support/certs/foo.bar.crt', import.meta.url)
const app = new Server({ key, cert })

app.use(
  send /// enables `res.send()`
)
app.get('/path', csp(), (req, res) => res.send(page))
app.get('/favicon.ico', (req, res) => res.send('', 200, { 'content-type': 'image/x-icon' }))

app.listen(3443)
