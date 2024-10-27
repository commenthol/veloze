/**
 * This example shows how to use the csp middleware
 * with the cspReport middleware
 *
 * requires a certificate; run `./scripts/certs.sh` before.
 */

import {
  Server,
  contentSec,
  cspReport,
  send,
  redirect2Https
} from '../src/index.js'

const page = `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <title>CSP report violation</title>
    <link rel="stylesheet" href="css/style.css" />
    <style>
      body { color: #070; }
    </style>
  </head>
  <body>
    <h2>You should not see red...</h2>
  </body>
</html>`

const css = `
body { color: #F00; background-color: #C00; }
`

/// defining the http server for redirecting to https
const sHttp = new Server({ onlyHTTP1: true })
sHttp.all('/*', redirect2Https({ redirectUrl: 'https://localhost:3443' }))
sHttp.listen(3000)

/// defining the secure http2 server for the application
const key = new URL('../test/support/certs/foo.bar.key', import.meta.url)
const cert = new URL('../test/support/certs/foo.bar.crt', import.meta.url)
const app = new Server({ key, cert })

app.use(
  send,
  contentSec({
    csp: {
      omitDefaults: true,
      'default-src': ['self'],
      'style-src': ['unsafe-inline'],
      'script-src-elem': ['unsafe-inline'],
      'media-src': ['data:'],
      'report-uri': '/csp-report'
    }
  })
)
app.get('/', (req, res) => res.send(page))
app.get('/favicon.ico', (req, res) =>
  res.send('', 200, { 'content-type': 'image/x-icon' })
)
app.get('/css/style.css', (req, res) =>
  res.send(css, 200, { 'content-type': 'text/css' })
)
app.post('/csp-report', cspReport())

app.listen(3443)
