export function connect(...handlers: (Handler | Handler[] | undefined)[]): (req: Request, res: Response, done: Function) => void;
export type Request = import('./types').Request;
export type Response = import('./types').Response;
export type Handler = import('./types').Handler;
