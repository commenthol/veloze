import { hrtime } from 'node:process'

export const bench = (fn, max = 1e4) => {
  const start = hrtime.bigint()
  for (let i = 0; i < max; i++) {
    fn()
  }
  return hrtime.bigint() - start
}
