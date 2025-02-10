import { ProcLog, initProcLog, EVENT_PROC_LOG } from 'debug-level'

/** @typedef {import('debug-level').Log} LogBase */
/** @typedef {import('debug-level').ProcLogOptions} ProcLogOptions */

/**
 * @param {string} [namespace]
 * @param {ProcLogOptions} [opts]
 * @returns {ProcLog}
 */
export const logger = (namespace, opts) =>
  new ProcLog(`veloze${namespace || ''}`, opts)

initProcLog()

/**
 * overwrite logger function;
 * Must be called before any middleware or utility
 * @param {(namespace: string, ...other: any) => LogBase} loggerFactory
 */
export const setLogger = (loggerFactory) => {
  const logger = {}
  const getLogger = (namespace) =>
    logger[namespace] || (logger[namespace] = loggerFactory(namespace))

  // prevent multiple log-lines from adding more than one listener
  process.removeAllListeners(EVENT_PROC_LOG)
  // listen on event
  process.on(EVENT_PROC_LOG, (level, namespace, fmt, args) => {
    const log = getLogger(namespace)
    log[level.toLowerCase()]?.(fmt, ...args)
  })
}
