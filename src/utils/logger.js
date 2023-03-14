import { logger as loggerF } from 'debug-level'

export function logger (namespace = '', opts) {
  return loggerF(`veloze${namespace}`, opts)
}
