/**
 * @typedef { import('../types.js').Request } Request
 * @typedef { import('../types.js').Response } Response
 */
/**
 * connect middleware which adds `req.query` as object to Request
 * `req.path` contains pathname without search parameters
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function queryParser(req: Request, res: Response, next: Function): void;
export type Request = import("../types.js").Request;
export type Response = import("../types.js").Response;
