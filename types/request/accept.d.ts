export function accept(req: Request, weight?: boolean): HeaderParserResult[];
export function acceptEncoding(req: Request, weight?: boolean): HeaderParserResult[];
export function acceptLanguage(req: Request, weight?: boolean): HeaderParserResult[];
export type Request = import('../types').Request;
export type HeaderParserResult = import('../types').HeaderParserResult;
