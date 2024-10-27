import { qs } from '../utils/index.js'
import { setPath } from '../request/setPath.js'

/**
 * @typedef { import('#types.js').Request } Request
 * @typedef { import('#types.js').Response } Response
 */
/**
 * connect middleware which adds `req.query` as object to Request
 * `req.path` contains pathname without search parameters
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function queryParser(req, res, next) {
  if (!req.query || !req.path) {
    const [path, search] = req.url.split('?')
    setPath(req, path || '/')
    req.query = qs(search)
  }
  next()
}
