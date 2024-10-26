export function setLogger(loggerFn: LoggerFn): void;
export function logger(namespace?: string | undefined, opts?: import("debug-level").LogOptions | undefined): LogBase;
export type LogBase = import("debug-level").Log;
export type LogOptions = import("debug-level").LogOptions;
export type LoggerFn = (namespace: string, opts?: LogOptions | undefined) => LogBase;
