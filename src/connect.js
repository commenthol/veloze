import { isAsyncFunction } from 'node:util/types'
import { assert } from './utils/assert.js'

/**
 * @typedef {import('./types.js').Request} Request
 * @typedef {import('./types.js').Response} Response
 * @typedef {import('./types.js').Handler} Handler
 */
/**
 * Connects middleware handlers
 *
 * Both callback handlers `(req, res, next) => void`
 * as well as async handlers `async (req, res) => Promise<void>` are supported.
 *
 * All handlers nested in arrays are flattened, e.g. `connect([h1, [h2]], h3)`
 * becomes `connect(h1, h2, h3)`
 *
 * One error handler per route of type `(err, req, res, next) => void` is
 * allowed.
 *
 * @param  {...(Handler|Handler[]|undefined)} handlers
 */
export const connect = (...handlers) => {
  let errorHandler
  const stack = []
  let c = 0
  const flattenedHandlers = handlers.flat(Infinity).filter(Boolean)
  for (const handler of flattenedHandlers) {
    assert(typeof handler === 'function', 'handler must be of type function')
    const arity = handler?.length
    const isAsync = isAsyncFunction(handler) && arity === 2
    if (arity === 4) {
      if (!errorHandler) {
        // connect only supports one error handler
        errorHandler = handler
      }
    } else {
      if (++c % 100 === 0) {
        // allow event loop to kick in
        stack.push([breakSync, false])
      }
      stack.push([handler, isAsync])
    }
  }
  /**
   * @param {Request} req
   * @param {Response} res
   * @param {Function} done
   */
  return (req, res, done) => {
    let i = 0
    /**
     * @param {Error} [err] - The error object, if any.
     */
    const run = (err) => {
      if (err) {
        errorHandler ? errorHandler(err, req, res, done) : done(err)
        return
      }
      const [handler, isAsync] = stack[i++] || []
      // res.writablePiped is needed to stop stack processing if response is
      // streamed.
      if (res.writableEnded || res.writablePiped) {
        return
      } else if (!handler) {
        done()
        return
      }
      try {
        const p = handler(req, res, run)
        if (isAsync) {
          p.then(() => run()).catch(run)
        }
      } catch (/** @type {Error|any} */ err) {
        run(err)
      }
    }
    run()
  }
}

function breakSync(_req, _res, next) {
  setImmediate(next)
}
