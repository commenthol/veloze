/**
 * gracefully shutdown http/ https server
 * alternative to [stoppable](https://github.com/hunterloftis/stoppable).
 *
 * @param {Server} server the server instance
 * @param {object} [options]
 * @param {number} [options.gracefulTimeout=1000] (ms) graceful timeout for existing connections
 * @param {Log} [options.log] logger
 */
export function safeServerShutdown(server: Server, options?: {
    gracefulTimeout?: number | undefined;
    log?: import("#types.js").Log | undefined;
} | undefined): void;
export type Log = import("#types.js").Log;
export type HttpServer = import("http").Server;
export type HttpSecureServer = import("https").Server;
export type Http2Server = import("http2").Http2Server;
export type Http2SecureServer = import("http2").Http2SecureServer;
export type CloseAsync = {
    closeAsync: () => Promise<void>;
};
export type Server = (HttpServer | HttpSecureServer | Http2Server | Http2SecureServer) & CloseAsync;
