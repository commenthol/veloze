import { send } from '../response/index.js'

/**
 * @typedef {import('../types').Response} Response
 * @typedef { import('../types').Request } Request
 */

/**
 * connect middleware which adds `req.query` as object to Request
 * `req.pathname` contains path without search parameters
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function sendMw (req, res, next) {
  res.send = send.bind(null, res)
  next()
}
