import { logger as loggerFn } from 'debug-level'

/**
 * @typedef {import('debug-level').Log} LogBase
 * @typedef {import('debug-level').LogOptions} LogOptions
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
 * @param {import('debug-level').LogOptions} [opts]
 * @returns {LogBase}
 */
export const logger = (namespace, opts) =>
  loggerF(`veloze${namespace || ''}`, opts)
