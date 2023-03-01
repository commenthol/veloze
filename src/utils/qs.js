/**
 * @param {string} urlEncoded search parameters
 * @returns {Record<string,string>|{}}
 */
export function qs (urlEncoded) {
  const searchParams = new URLSearchParams(urlEncoded)
  const query = {}
  for (const [name, value] of searchParams.entries()) {
    if (query[name]) {
      Array.isArray(query[name])
        ? query[name].push(value)
        : (query[name] = [query[name], value])
    } else {
      query[name] = value
    }
  }
  return query
}
