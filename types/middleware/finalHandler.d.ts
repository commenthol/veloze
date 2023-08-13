export function finalHandler(options?: {
    log?: import("../types").Log | undefined;
    htmlTemplate?: ((param0: {
        status: number;
        message: string;
        info?: object;
        reqId: string;
        req: Request;
    }) => string) | undefined;
} | undefined): (err: HttpErrorL | Error, req: Request, res: Response, next?: Function) => void;
export function finalLogger(options?: {
    log?: import("../types").Log | undefined;
} | undefined): (err: HttpErrorL | Error, req: Request, res: Response) => void;
export type Request = import('../types').Request;
export type Response = import('../types').Response;
export type HttpErrorL = import('../types').HttpError;
export type Log = import('../types').Log;
