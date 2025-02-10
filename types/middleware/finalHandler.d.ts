export function finalHandler(options?: {
    log?: import("#types.js").Log | undefined;
    htmlTemplate?: ((param0: {
        status: number;
        message: string;
        info?: object;
        reqId: string;
        req: Request;
    }) => string) | undefined;
}): (err: HttpErrorL | Error, req: Request, res: Response, next?: Function) => void;
export function finalLogger(options?: {
    log?: import("#types.js").Log | undefined;
}): (err: HttpErrorL | Error, req: Request, res: Response) => void;
export type Request = import("#types.js").Request;
export type Response = import("#types.js").Response;
export type HttpErrorL = import("#types.js").HttpError;
export type Log = import("#types.js").Log;
