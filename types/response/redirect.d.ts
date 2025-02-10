/**
 * Send redirect dependent of content-type;
 * Defaults to 307 Temporary Redirect
 *
 * @param {Response} res
 * @param {string} location
 * @param {number} [status=307]
 * @param {Record<string, string|number|boolean>|{}} [headers]
 */
export function redirect(res: Response, location: string, status?: number, headers?: Record<string, string | number | boolean> | {}): void;
export type Response = import("#types.js").Response;
