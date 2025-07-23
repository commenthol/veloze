/**
 * @typedef {import('../types.js').Response} Response
 * @typedef {import('../types.js').Request } Request
 */
/**
 * Sends response
 * sets content-type header and corrects headers based on status-code.
 *
 * @param {Response} res
 * @param {any} body
 * @param {number} [status]
 * @param {Record<string, string|number|boolean>|{}} [headers]
 */
export function send(res: Response, body: any, status?: number, headers?: Record<string, string | number | boolean> | {}): void;
export type Response = import("../types.js").Response;
export type Request = import("../types.js").Request;
