export function connect(...handlers: Handler[]): (req: Request, res: Response, done: Function) => void;
export type Request = import('../src/types').Request;
export type Response = import('../src/types').Response;
export type Handler = import('../src/types').Handler;
