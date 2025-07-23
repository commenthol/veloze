/**
 * @typedef {import('../types.js').HandlerCb} HandlerCb
 * @typedef {import('../types.js').Response} Response
 * @typedef { import('../types.js').Request } Request
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
}): HandlerCb;
export type HandlerCb = typeof import("../types.js").HandlerCb;
export type Response = import("../types.js").Response;
export type Request = import("../types.js").Request;
