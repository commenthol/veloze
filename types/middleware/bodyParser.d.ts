export function bodyParser(options?: BodyParserOptions): HandlerCb;
export namespace bodyParser {
    /**
     * JSON parser
     * `req.body instanceof Object`
     * @param {BodyParserOptions} options
     * @returns {HandlerCb}
     */
    function json(options?: BodyParserOptions): HandlerCb;
    /**
     * UrlEncoded Form parser
     * `req.body instanceof Object`
     * @param {BodyParserOptions} options
     * @returns {HandlerCb}
     */
    function urlEncoded(options?: BodyParserOptions): HandlerCb;
    /**
     * Raw Parser
     * `req.body instanceof Buffer`
     * @param {BodyParserOptions} options
     * @returns {HandlerCb}
     */
    function raw(options?: BodyParserOptions): HandlerCb;
}
export type HandlerCb = typeof import("#types.js").HandlerCb;
export type Log = import("#types.js").Log;
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
    log?: import("#types.js").Log | undefined;
};
