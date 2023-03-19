/**
 * @typedef {import('../types').HandlerCb} HandlerCb
 * @typedef {import('../types').Response} Response
 * @typedef { import('../types').Request } Request
 */
/**
 * connect middleware which adds `res.send` to the response.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function send(req: Request, res: Response, next: Function): void;
/**
 * `res.send` with ETag header generation.
 * @param {object} [options]
 * @param {string} [options.algorithm='sha1']
 * @returns {HandlerCb}
 */
export function sendEtag(options?: {
    algorithm?: string | undefined;
} | undefined): HandlerCb;
export type HandlerCb = typeof import("../types").HandlerCb;
export type Response = import('../types').Response;
export type Request = import('../types').Request;
