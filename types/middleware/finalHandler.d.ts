export function finalHandler(opts?: {
    log?: import("../../src/types").Log | undefined;
    htmlTemplate?: (({ status, message }: {
        status: any;
        message: any;
    }) => string) | undefined;
} | undefined): (err: HttpErrorL | Error, req: Request, res: Response, next?: Function) => void;
export type Request = import('../../src/types').Request;
export type Response = import('../../src/types').Response;
export type HttpErrorL = import('../../src/types').HttpError;
export type Log = import('../../src/types').Log;
