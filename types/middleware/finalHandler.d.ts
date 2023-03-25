export function finalHandler(options?: {
    log?: import("../types").Log | undefined;
    htmlTemplate?: ((param0: {
        status: number;
        message: string;
        description?: object | string;
        reqId: string;
        req: Request;
    }) => string) | undefined;
} | undefined): (err: HttpErrorL | Error, req: Request, res: Response, next?: Function) => void;
export type Request = import('../types').Request;
export type Response = import('../types').Response;
export type HttpErrorL = import('../types').HttpError;
export type Log = import('../types').Log;
