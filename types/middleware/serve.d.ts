/**
 * @typedef {object} ServeOptions
 * @property {boolean} [etag=true] generates weak ETag
 * @property {boolean} [fallthrough] continue processing if document could not be found
 * @property {string} [index='index.html'] index document being served in case that directory was found
 * @property {string} [strip] strip
 * @property {boolean} [compress=true] compresses all text files with file-size greater than compressThreshold
 * @property {number|string} [threshold=1024] compress threshold in bytes
 * @property {(req: Request, res: Response) => boolean} [filter] filter to decide if response shall be compressible. If `true` then response is potentially compressible
 * @property {CompressOptions} [compressOptions] zlib.Options
 * @property {Record<string,string>} [mimeTypes] Dictionary of MIME-types by file extension e.g. `{'.txt':'text/plain'}`
 */
/**
 * @param {string|URL} root directory
 * @param {ServeOptions} [options]
 * @returns
 */
export function serve(root: string | URL, options?: ServeOptions | undefined): (req: any, res: any, next: any) => Promise<void>;
export type ServeOptions = {
    /**
     * generates weak ETag
     */
    etag?: boolean | undefined;
    /**
     * continue processing if document could not be found
     */
    fallthrough?: boolean | undefined;
    /**
     * index document being served in case that directory was found
     */
    index?: string | undefined;
    /**
     * strip
     */
    strip?: string | undefined;
    /**
     * compresses all text files with file-size greater than compressThreshold
     */
    compress?: boolean | undefined;
    /**
     * compress threshold in bytes
     */
    threshold?: string | number | undefined;
    /**
     * filter to decide if response shall be compressible. If `true` then response is potentially compressible
     */
    filter?: ((req: Request, res: Response) => boolean) | undefined;
    /**
     * zlib.Options
     */
    compressOptions?: import("../utils/compressStream.js").CompressOptions | undefined;
    /**
     * Dictionary of MIME-types by file extension e.g. `{'.txt':'text/plain'}`
     */
    mimeTypes?: Record<string, string> | undefined;
};
export type Request = import('../types.js').Request;
export type Response = import('../types.js').Response;
export type CompressOptions = import('../utils/compressStream.js').CompressOptions;
