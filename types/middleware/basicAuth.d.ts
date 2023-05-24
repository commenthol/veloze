/**
 * @typedef {import('../types').Handler} Handler
 */
/**
 * @see https://datatracker.ietf.org/doc/html/rfc7617
 * @param {object} options
 * @param {Record<string, string>} options.users user-password records
 * @param {string} [options.realm='Secure']
 * @returns {Handler}
 */
export function basicAuth(options: {
    users: Record<string, string>;
    realm?: string | undefined;
}): Handler;
export function compareLc(str?: string, compare?: string): boolean;
export type Handler = import('../types').Handler;
