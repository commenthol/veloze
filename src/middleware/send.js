import { send as resSend } from '../response/index.js'

/**
 * @typedef {import('../types').Response} Response
 * @typedef { import('../types').Request } Request
 */

/**
 * connect middleware which adds `res.send` to the response.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function send (req, res, next) {
  res.send = resSend.bind(null, res)
  next()
}
