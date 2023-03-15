/**
 * Query string parser.
 *
 * To prevent HTTP Parameter Pollution only the last parameter will be
 * serialized into the query record
 *
 * @param {string} urlEncoded search parameters
 * @returns {Record<string,string>|{}}
 */
export function qs(urlEncoded: string): Record<string, string> | {};
