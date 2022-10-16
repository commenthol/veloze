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
export function sendMw(req: Request, res: Response, next: Function): void;
export type Response = import('../types').Response;
export type Request = import('../types').Request;
