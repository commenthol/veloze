import { logger as loggerFn } from 'debug-level'

/**
 * @typedef {import('debug-level/types/LogBase').LogBase} LogBase
 * @typedef {import('debug-level/types/node').LogOptions} LogOptions
 * @typedef {(namespace: string, opts?: LogOptions | undefined) => LogBase} LoggerFn
 */

let loggerF = loggerFn

/**
 * overwrite logger function;
 * Must be called before any middleware or utility
 * @param {LoggerFn} loggerFn
 */
/* c8 ignore next 3 */
export const setLogger = (loggerFn) => {
  loggerF = loggerFn
}

/**
 * @param {string} [namespace]
 * @param {import('debug-level/types/node').LogOptions} [opts]
 * @returns {LogBase}
 */
export const logger = (namespace, opts) =>
  // @ts-expect-error
  loggerF(`veloze${namespace || ''}`, opts)
