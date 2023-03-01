/**
 * This example shows how to use the csp middleware
 * with the cspReport middleware
 */

import { Router, csp, cspReport, sendMw } from '../src/index.js'

const page = `<!DOCTYPE html>
<html lang="en-US">
  <head>
    <meta charset="UTF-8" />
    <title>CSP report violation</title>
    <link rel="stylesheet" href="css/style.css" />
    <style>
      body { color: darkgreen; }
    </style>
  </head>
  <body>
    <h2>You should not see red...</h2>
  </body>
</html>`

const css = `
body { color: red; }
`

const app = new Router()
app.use(
  sendMw,
  csp({
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
app.get('/favicon.ico', (req, res) => res.send('', 200, { 'content-type': 'image/x-icon' }))
app.get('/css/style.css', (req, res) => res.send(css, 200, { 'content-type': 'text/css' }))
app.post('/csp-report', cspReport())

app.listen(3000)
