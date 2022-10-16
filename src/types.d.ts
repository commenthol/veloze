import * as http from 'node:http'

export type Method = 'ALL'|'ACL'|'BIND'|'CHECKOUT'|'CONNECT'|'COPY'|'DELETE'|'GET'|'HEAD'|'LINK'|'LOCK'|'M-SEARCH'|'MERGE'|'MKACTIVITY'|'MKCALENDAR'|'MKCOL'|'MOVE'|'NOTIFY'|'OPTIONS'|'PATCH'|'POST'|'PROPFIND'|'PROPPATCH'|'PURGE'|'PUT'|'REBIND'|'REPORT'|'SEARCH'|'SOURCE'|'SUBSCRIBE'|'TRACE'|'UNBIND'|'UNLINK'|'UNLOCK'|'UNSUBSCRIBE'

export interface Request extends http.IncomingMessage {
  url: string
  params: object
  originalUrl?: string
  path?: string 
  /** needs queryParser middleware */
  query?: Record<string, any>
}

export interface Response extends http.ServerResponse {
  /** response body */
  body?: any
  /** needs sendMw middleware */
  send?: (body: any, status?: number, headers?: object) => void
}

export function HandlerCb (
  req: Request,
  res: Response,
  next: Function
): void

export function HandlerAsync (
  req: Request,
  res: Response
): Promise<void>

export function ErrorHandler (
  err: Error,
  req: Request,
  res: Response,
  next: Function
): void

export function FinalHandler (
  err: Error,
  req: Request,
  res: Response
): void

export type Handler = typeof HandlerCb | typeof HandlerAsync | typeof ErrorHandler

export interface HttpError extends Error {
  status: number
}

export type Connect = (...handlers: Handler[]) => (req: Request, res: Response, next?: Function) => void

export interface Log {
  debug: Function
  info: Function
  warn: Function
  error: Function
}
