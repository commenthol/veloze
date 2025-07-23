export function finalHandler(options?: {
    htmlTemplate?: ((param0: {
        status: number;
        message: string;
        info?: object;
        reqId: string;
        req: Request;
    }) => string) | undefined;
}): (err: HttpErrorL | Error, req: Request, res: Response, next?: Function) => void;
export function finalLogger(): (err: HttpErrorL | Error, req: Request, res: Response) => void;
export type Request = import("../types.js").Request;
export type Response = import("../types.js").Response;
export type HttpErrorL = import("../types.js").HttpError;
export type Log = import("../types.js").Log;
