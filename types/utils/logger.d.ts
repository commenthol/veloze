export function logger(namespace?: string, opts?: ProcLogOptions): ProcLog;
export function setLogger(loggerFactory: (namespace: string, ...other: any) => LogBase): void;
export type LogBase = import("debug-level").Log;
export type ProcLogOptions = import("debug-level").ProcLogOptions;
import { ProcLog } from 'debug-level';
