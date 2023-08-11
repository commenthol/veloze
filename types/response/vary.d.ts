/**
 * Sets vary header on response
 *
 * @throws {TypeError}
 * @param {import("../types").Response} res
 * @param {string} reqHeader request header name
 */
export function vary(res: import("../types").Response, reqHeader: string): void;
