/**
 * @typedef { import('../../src/types').Request } Request
 * @typedef { import('../../src/types').Response } Response
 */
/**
 * connect middleware which adds `req.query` as object to Request
 * `req.pathname` contains path without search parameters
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function queryParser(req: Request, res: Response, next: Function): void;
export type Request = import('../../src/types').Request;
export type Response = import('../../src/types').Response;
