export function connect(...handlers: (Handler | Handler[] | undefined)[]): (req: Request, res: Response, done: Function) => void;
export type Request = import("./types.js").Request;
export type Response = import("./types.js").Response;
export type Handler = import("./types.js").Handler;
