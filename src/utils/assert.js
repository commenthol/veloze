/**
 * assert that `trueish` evaluates to true; overwise throw with an Error
 * @param {any} trueish
 * @param {string} [message]
 */
export function assert (trueish, message = 'assertion failed') {
  if (!trueish) throw new Error(message)
}
