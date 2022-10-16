/**
 * @param {Response} res
 * @param {any} body
 * @param {number} [status]
 * @param {object} [headers]
 */
export function send(res: Response, body: any, status?: number | undefined, headers?: object): void;
/**
 * @typedef {import('../types').Response} Response
 * @typedef { import('../types').Request } Request
 */
export const METHOD_HEAD: unique symbol;
export const CONTENT_TYPE: "content-type";
export const MIME_HTML: "text/html; charset=utf-8";
export const MIME_JSON: "application/json; charset=utf-8";
export const MIME_BIN: "application/octet-stream";
export type Response = import('../types').Response;
export type Request = import('../types').Request;
