/**
 * @typedef {import('../types').HandlerCb} HandlerCb
 * @typedef {import('../types').Response} Response
 * @typedef { import('../types').Request } Request
 */
/**
 * connect middleware which adds `res.json` to the response.
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function json(req: Request, res: Response, next: Function): void;
/**
 * `res.json` with ETag header generation.
 *
 * @param {object} [options]
 * @param {string} [options.algorithm='sha1']
 * @returns {HandlerCb}
 */
export function jsonEtag(options?: {
    algorithm?: string | undefined;
} | undefined): HandlerCb;
export { RES_ETAG };
export function etagHash(chunk?: string, algorithm?: string): string;
export type HandlerCb = typeof import("../types").HandlerCb;
export type Response = import('../types').Response;
export type Request = import('../types').Request;
import { RES_ETAG } from '../constants.js';
