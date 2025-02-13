/**
 * @param {Request} req
 * @param {Response} res
 * @param {object} [options]
 * @param {CompressOptions} [options.compressOptions]
 * @param {number} [options.threshold=1024]
 * @param {(req: Request, res: Response) => boolean} [options.filter]
 * @returns {import('node:stream').Transform|undefined}
 */
export function compressStream(req: Request, res: Response, options?: {
    compressOptions?: CompressOptions | undefined;
    threshold?: number | undefined;
    filter?: ((req: Request, res: Response) => boolean) | undefined;
}): import("node:stream").Transform | undefined;
export function filterCompressibleMimeType(req: Request, res: Response): boolean;
export function isCompressibleMimeType(mimeType: string): boolean;
export function isCompressibleMimeTypeHTB(mimeType: string): boolean;
export function healTheBreachRandomSpaces(): string;
export type CompressOptions = zlib.BrotliOptions & zlib.ZlibOptions;
export type Request = import("#types.js").Request;
export type Response = import("#types.js").Response;
import * as zlib from 'node:zlib';
