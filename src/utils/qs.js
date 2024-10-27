/**
 * Query string parser.
 *
 * To prevent HTTP Parameter Pollution only the last parameter will be
 * serialized into the query record
 *
 * @param {string} urlEncoded search parameters
 * @returns {Record<string,string>|{}}
 */
export function qs(urlEncoded) {
  const searchParams = new URLSearchParams(urlEncoded)
  const query = {}
  for (const [name, value] of searchParams.entries()) {
    query[name] = value
  }
  return query
}
