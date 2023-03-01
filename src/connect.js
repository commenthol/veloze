import { isAsyncFunction } from 'node:util/types'
import { assert } from './utils/assert.js'

/**
 * @typedef {import('../src/types').Request} Request
 * @typedef {import('../src/types').Response} Response
 * @typedef {import('../src/types').Handler} Handler
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
 * @param  {...Handler} handlers
 */
export const connect = (...handlers) => {
  let errorHandler
  const stack = []
  let c = 0
  for (const handler of handlers.flat(Infinity).filter(Boolean)) {
    assert(typeof handler === 'function', 'handler must be of type function')
    const isAsync = isAsyncFunction(handler)
    const arity = handler.length
    if (arity === 4) {
      if (!errorHandler) {
        // connect only supports one error handler
        errorHandler = handler
      }
    } else {
      assert(!isAsync || arity === 2, 'async handlers must only have (req, res) as arguments')
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
    const run = (err) => {
      if (err) {
        errorHandler
          ? errorHandler(err, req, res, done)
          : done(err)
        return
      }
      const [handler, isAsync] = stack[i++] || []
      if (res.writableEnded) {
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
      } catch (e) {
        run(e)
      }
    }
    run()
  }
}

function breakSync (req, res, next) {
  setImmediate(next)
}
