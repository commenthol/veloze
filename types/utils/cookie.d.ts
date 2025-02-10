/**
 * @typedef {object} CookieOpts
 * @property {string} [domain] Domain name for the cookie.
 * @property {Date} [expires] Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
 * @property {boolean} [httpOnly] Flags the cookie to be accessible only by the web server.
 * @property {number} [maxAge] Convenient option for setting the expiry time relative to the current time in milliseconds.
 * @property {string} [path] Path for the cookie. Defaults to "/".
 * @property {boolean} [secure] Marks the cookie to be used with HTTPS only.
 * @property {boolean|string|'Lax'|'Strict'|'None'} [sameSite] Value of the "SameSite" Set-Cookie attribute. More information at https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1
 */
/**
 * parses a cookie string
 * @param {string} cookieStr
 * @returns {Record<string, string>|{}}
 */
export function cookieParse(cookieStr?: string): Record<string, string> | {};
/**
 * serializes a cookie
 * @param {string} name
 * @param {any} value
 * @param {CookieOpts} [options]
 * @returns {string}
 */
export function cookieSerialize(name: string, value: any, options?: CookieOpts): string;
export type CookieOpts = {
    /**
     * Domain name for the cookie.
     */
    domain?: string | undefined;
    /**
     * Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.
     */
    expires?: Date | undefined;
    /**
     * Flags the cookie to be accessible only by the web server.
     */
    httpOnly?: boolean | undefined;
    /**
     * Convenient option for setting the expiry time relative to the current time in milliseconds.
     */
    maxAge?: number | undefined;
    /**
     * Path for the cookie. Defaults to "/".
     */
    path?: string | undefined;
    /**
     * Marks the cookie to be used with HTTPS only.
     */
    secure?: boolean | undefined;
    /**
     * Value of the "SameSite" Set-Cookie attribute. More information at https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1
     */
    sameSite?: string | boolean | undefined;
};
