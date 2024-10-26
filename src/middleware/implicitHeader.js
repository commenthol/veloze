/**
 * @typedef {import('#types.js').Request} Request
 * @typedef {import('#types.js').Response} Response
 */
/**
 * For compatibility only; Adds undocumented _implicitHeader() method to res;
 * Might be necessary for compatibility with express middlewares.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export const implicitHeader = (req, res, next) => {
  // @ts-expect-error
  res._implicitHeader =
    res._implicitHeader ||
    function () {
      if (
        // @ts-expect-error
        typeof res.headersSent === 'boolean' ? !res.headersSent : !res._header
      ) {
        res.writeHead(res.statusCode)
      }
    }
  next()
}
