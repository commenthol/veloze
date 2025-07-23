/**
 * @typedef {import('../types.js').Response} Response
 */
/**
 * call listener function as soon as res.writeHead is called
 * @param {Response} res
 * @param {(res: Response) => void} listener
 */
export function onWriteHead(res: Response, listener: (res: Response) => void): void;
export type Response = import("../types.js").Response;
