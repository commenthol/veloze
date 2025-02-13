/**
 * @typedef {import('#types.js').Method} Method
 */
/**
 * Radix Tree Router
 *
 * - Case-sensitive router according to [RFC3986](https://www.rfc-editor.org/rfc/rfc3986).
 * - Duplicate slashes are NOT ignored.
 * - No regular expressions.
 * - Tailing slash resolves to different route. E.g. `/path !== /path/`
 * - supports wildcard routes `/path/*`.
 * - parameters `/users/:user`, e.g. `/users/andi` resolves to `params = { user: 'andi' }`
 */
export class FindRoute {
    /**
     * @param {number} [size=1000]
     */
    constructor(size?: number);
    _cache: LRUCache<any, any> | null;
    /**
     * add handler by method and pathname to routing tree
     * @param {Method} method
     * @param {string|string[]} pathname
     * @param {Function} handler
     */
    add(method: Method, pathname: string | string[], handler: Function): void;
    /**
     * print routing tree on console
     */
    print(): void;
    /**
     * find route handlers by method and url
     * @param {object} param0
     * @param {Method} param0.method
     * @param {string} param0.url
     * @returns {{
     *  handler: Function
     *  params: object
     *  path: string
     * }|undefined}
     */
    find({ method, url }: {
        method: Method;
        url: string;
    }): {
        handler: Function;
        params: object;
        path: string;
    } | undefined;
    #private;
}
export type Method = import("#types.js").Method;
import { LRUCache } from 'mnemonist';
