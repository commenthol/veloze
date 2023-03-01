import { qs } from '../utils/index.js'
/**
 * @typedef { import('../../src/types').Request } Request
 * @typedef { import('../../src/types').Response } Response
 */
/**
 * connect middleware which adds `req.query` as object to Request
 * `req.path` contains pathname without search parameters
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function queryParser (req, res, next) {
  const [path, search] = req.url.split('?')
  req.path = path
  req.query = qs(search)
  next()
}
