export function finalHandler(options?: {
    log?: import("../../src/types").Log | undefined;
    htmlTemplate?: ((param0: {
        status: number;
        message: string;
        description?: object | string;
        reqId: string;
        req: Request;
    }) => string) | undefined;
} | undefined): (err: HttpErrorL | Error, req: Request, res: Response, next?: Function) => void;
export type Request = import('../../src/types').Request;
export type Response = import('../../src/types').Response;
export type HttpErrorL = import('../../src/types').HttpError;
export type Log = import('../../src/types').Log;
