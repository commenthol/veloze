import { send } from '../response/index.js'
import { escapeHtmlLit } from '../utils/index.js'
import { HttpError } from '../HttpError.js'

/**
 * @typedef {import('../../src/types').Request} Request
 * @typedef {import('../../src/types').Response} Response
 * @typedef {import('../../src/types').HttpError} HttpErrorL
 * @typedef {import('../../src/types').Log} Log
 */

/**
 * @param {object} [opts]
 * @param {Log} [opts.log] log function
 * @param {({status, message}) => string} [opts.htmlTemplate] html template for the final error page
 * @returns {(err: HttpErrorL|Error, req: Request, res: Response, next?: Function) => void}
 */
export const finalHandler = (opts) => {
  const {
    log = console,
    htmlTemplate = finalHtml
  } = opts || {}

  // eslint-disable-next-line no-unused-vars
  return (err, req, res, next) => {
    const isHttpError = err instanceof HttpError
    // TODO allow error mapping or translations!
    const message = isHttpError ? err.message : 'oops! This should not have happened!'
    const {
      // @ts-expect-error
      status = 500,
      stack,
      cause
    } = err || {}

    // TODO generate an error id and log this!
    if (!res.headersSent) {
      const type = String(res.getHeader('content-type'))
      const body = res.body || (type.startsWith('text/html')
        ? htmlTemplate({ status, message })
        : { status, message }
      )
      send(res, body, status)
    }
    const { url, originalUrl, method } = req
    const level = status < 400
      ? 'info'
      : status < 500
        ? 'warn'
        : 'error'
    log[level]({
      level,
      status,
      method,
      url: originalUrl || url,
      msg: err.message,
      stack: level === 'error' ? stack : undefined,
      // @ts-expect-error
      cause: cause?.stack
    })
  }
}

const finalHtml = ({ status, message }) => escapeHtmlLit`<!DOCTYPE html>
<html lang="en">
<head>
  <title>Error</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html {
      box-sizing: border-box;
      font-size: 16px;
    }
    body, h1, h2, p {
      padding: 0;
      margin: 0;
    }
    body {
      font-family: sans-serif;
      position: relative;
      height: 100vh;
      display: flex;
      justify-content: center;
    }
    h1 {
      font-size: 10rem;
      font-weight: 700;
      margin: 0;
      color: transparent;
      background: linear-gradient(120deg, #cc33ff 30%, #33ddff);
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    h2 {
      font-weight: bold;
      font-size: 2em;
      padding-bottom: 2rem;
    }
    p {
      font-size: 1.2em;
    }
    section {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-flow: column;
      padding-bottom: 3em;
    }
    a {
      color: #0099FF;
    }
  </style>
</head>
<body>
  <section>
    <h1>${status}</h1>
    <h2>${message}</h2>
    <p><a href="/">Homepage</a></p>
  </section>
</body>
</html>
`
