const MAX_QUERY_LENGTH = 64000
const MAX_PARAMS = 1000

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
  const query = Object.create(null)
  if (!urlEncoded || urlEncoded.length > MAX_QUERY_LENGTH) {
    return query
  }

  let count = 0
  const searchParams = new URLSearchParams(urlEncoded)
  for (const [name, value] of searchParams.entries()) {
    if (!name || Object.prototype.hasOwnProperty.call(Object.prototype, name)) {
      continue
    }
    if (++count > MAX_PARAMS) {
      break
    }
    query[name] = value
  }
  return query
}
