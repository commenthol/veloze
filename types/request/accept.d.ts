/**
 * Parses the request header 'accept'
 * @param {Request} req request
 * @param {boolean} [weight=false] returns weight information
 * @returns {HeaderParserResult[]} list of mime types
 */
export const accept: (req: Request, weight?: boolean) => HeaderParserResult[];
/**
 * Parses the request header 'accept-encoding'
 * @param {Request} req request
 * @param {boolean} [weight=false] returns weight information
 * @returns {HeaderParserResult[]} list of mime types
 */
export const acceptEncoding: (req: Request, weight?: boolean) => HeaderParserResult[];
/**
 * Parses the request header 'accept-language'
 * @param {Request} req request
 * @param {boolean} [weight=false] returns weight information
 * @returns {HeaderParserResult[]} list of languages
 */
export const acceptLanguage: (req: Request, weight?: boolean) => HeaderParserResult[];
export type Request = import("#types.js").Request;
export type HeaderParserResult = import("#types.js").HeaderParserResult;
