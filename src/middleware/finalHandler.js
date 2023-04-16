import * as crypto from 'node:crypto'
import { send } from '../response/index.js'
import { escapeHtmlLit } from '../utils/index.js'
import { logger } from '../utils/logger.js'
import { HttpError } from '../HttpError.js'
import { CONTENT_TYPE, CONTENT_SECURITY_POLICY } from '../constants.js'
import { buildCsp } from './contentSec.js'

/**
 * @typedef {import('../types').Request} Request
 * @typedef {import('../types').Response} Response
 * @typedef {import('../types').HttpError} HttpErrorL
 * @typedef {import('../types').Log} Log
 */

/**
 * final handler
 *
 * provides a error response according to a given error;
 * returns either a json or html response; defaults to html;
 * logs the error together with the requests url and method;
 *
 * @param {object} [options]
 * @param {Log} [options.log] log function
 * @param {(param0: {status: number, message: string, info?: object, reqId: string, req: Request}) => string} [options.htmlTemplate] html template for the final error page
 * @returns {(err: HttpErrorL|Error, req: Request, res: Response, next?: Function) => void}
 */
export const finalHandler = (options) => {
  const {
    log = logger(':final'),
    htmlTemplate = finalHtml
  } = options || {}

  // eslint-disable-next-line no-unused-vars
  return function finalHandlerMw (err, req, res, next) {
    // our message to the outside world
    /** @type {HttpError} */
    // @ts-expect-error
    const errResp = (err?.status)
      ? err
      : new HttpError(500, 'Oops! That should not have happened!', err)

    const {
      status = 500,
      message, // PUBLIC message
      info, // PUBLIC info: additional info, e.g. like validation error for the outside world
      cause // PRIVATE cause: our internal error message and stack trace -> only for logging...
    } = errResp || {}

    const { url, originalUrl, method, id = crypto.randomUUID() } = req

    if (!res.headersSent) {
      const type = String(res.getHeader(CONTENT_TYPE))
      const accept = String(req.headers?.accept || req.headers?.[CONTENT_TYPE])
      const isJsonType = type.includes('/json') || accept.includes('/json')
      const body = res.body || (isJsonType
        ? { status, message, errors: info, reqId: id }
        : htmlTemplate({ status, message, info, reqId: id, req })
      )
      if (!isJsonType && !res.getHeader(CONTENT_SECURITY_POLICY)) {
        res.setHeader(CONTENT_SECURITY_POLICY, buildCsp())
      }
      send(res, body, status)
    } else if (!res.writableEnded) {
      res.end()
    }

    // log different log-level by status code
    const level = status < 400
      ? 'info'
      : status < 500
        ? 'warn'
        : 'error'

    log[level]({
      level,
      status,
      method,
      id,
      url: originalUrl || url,
      msg: message,
      // @ts-expect-error
      stack: cause?.stack
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
      -webkit-background-clip: text;
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
