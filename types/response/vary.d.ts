/**
 * Sets vary header on response
 *
 * @throws {TypeError}
 * @param {import('#types.js').Response} res
 * @param {string} reqHeader request header name
 */
export function vary(res: import("#types.js").Response, reqHeader: string): void;
