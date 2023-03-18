/**
 * gracefully shutdown http/ https server
 * alternative to [stoppable](https://github.com/hunterloftis/stoppable).
 *
 * @param {Server} server the server instance
 * @param {object} [param1]
 * @param {number} [param1.gracefulTimeout=1000] (ms) graceful timeout for existing connections
 * @param {Log} [param1.log] logger
 */
export function safeServerShutdown(server: Server, param1?: {
    gracefulTimeout?: number | undefined;
    log?: import("../../src/types").Log | undefined;
} | undefined): void;
export type Log = import('../../src/types').Log;
export type HttpServer = import('http').Server;
export type HttpSecureServer = import('https').Server;
export type Http2Server = import('http2').Http2Server;
export type Http2SecureServer = import('http2').Http2SecureServer;
export type CloseAsync = {
    closeAsync: () => Promise<void>;
};
export type Server = (HttpServer | HttpSecureServer | Http2Server | Http2SecureServer) & CloseAsync;
