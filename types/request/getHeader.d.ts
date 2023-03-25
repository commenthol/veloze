/**
 * @typedef {import('../types').Request} Request
 */
/**
 * get (first) request header
 * @param {Request} req
 * @param {string} header
 */
export function getHeader(req: Request, header?: string): string | undefined;
export type Request = import('../types').Request;
