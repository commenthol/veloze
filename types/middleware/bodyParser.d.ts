export function bodyParser(options?: BodyParserOptions | undefined): HandlerCb;
export namespace bodyParser {
    /**
     * JSON parser
     * `req.body instanceof Object`
     * @param {BodyParserOptions} options
     * @returns {HandlerCb}
     */
    function json(options?: BodyParserOptions): typeof import("../types").HandlerCb;
    /**
     * UrlEncoded Form parser
     * `req.body instanceof Object`
     * @param {BodyParserOptions} options
     * @returns {HandlerCb}
     */
    function urlEncoded(options?: BodyParserOptions): typeof import("../types").HandlerCb;
    /**
     * Raw Parser
     * `req.body instanceof Buffer`
     * @param {BodyParserOptions} options
     * @returns {HandlerCb}
     */
    function raw(options?: BodyParserOptions): typeof import("../types").HandlerCb;
}
export type HandlerCb = typeof import("../types").HandlerCb;
export type Log = import('../types').Log;
export type BodyParserOptions = {
    limit?: string | number | undefined;
    /**
     * allowed methods for bodyParsing
     */
    methods?: string[] | undefined;
    /**
     * parse json content
     */
    typeJson?: string | false | undefined;
    /**
     * parse urlEncoded content
     */
    typeUrlEncoded?: string | false | undefined;
    /**
     * parse raw content
     */
    typeRaw?: string | false | undefined;
    /**
     * custom logger
     */
    log?: import("../types").Log | undefined;
};
