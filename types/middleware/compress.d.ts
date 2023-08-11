/** @typedef {import('../types.js').Request} Request */
/** @typedef {import('../types.js').Response} Response */
/**
 * @param {object} [options]
 * @param {number|string} [options.threshold=1024] if content-length greater threshold then content might be compressed
 * @param {boolean} [options.healTheBreach=true] prevents BREACH attack for html, js and json MIME-types
 * @param {import('../utils/compressStream.js').CompressOptions} [options.compressOptions]
 * @param {(req: Request, res: Response) => boolean} [options.filter]
 * @returns {import('../types.js').Handler}
 */
export function compress(options?: {
    threshold?: string | number | undefined;
    healTheBreach?: boolean | undefined;
    compressOptions?: import("../utils/compressStream.js").CompressOptions | undefined;
    filter?: ((req: Request, res: Response) => boolean) | undefined;
} | undefined): import('../types.js').Handler;
export type Request = import('../types.js').Request;
export type Response = import('../types.js').Response;
