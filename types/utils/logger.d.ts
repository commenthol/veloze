export function setLogger(loggerFn: LoggerFn): void;
export function logger(namespace?: string, opts?: import("debug-level").LogOptions): LogBase;
export type LogBase = import("debug-level").Log;
export type LogOptions = import("debug-level").LogOptions;
export type LoggerFn = (namespace: string, opts?: LogOptions | undefined) => LogBase;
