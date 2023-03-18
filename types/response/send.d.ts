/**
 * @typedef {import('../types').Response} Response
 * @typedef { import('../types').Request } Request
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
export function send(res: Response, body: any, status?: number | undefined, headers?: {} | Record<string, string | number | boolean> | undefined): void;
export type Response = import('../types').Response;
export type Request = import('../types').Request;
