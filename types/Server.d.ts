/**
 * @class
 * HTTP2 or HTTP1/HTTPS server
 *
 * If providing a `key` and `cert` in options, then server starts as secure
 * server.
 *
 * Server starts as HTTP2 server by default allowing fallback to HTTP1
 * connections.
 */
export class Server extends Router {
    /**
     * @param {ServerOptions} options
     */
    constructor(options: ServerOptions);
    /**
     * Starts the server with listening on port, hostname, ...
     *
     * Signatures:
     * ```ts
     * (port?: number, hostname?: string, backlog?: number, listeningListener?: () => void): Http2Server
     * (port?: number, hostname?: string, listeningListener?: () => void): Http2Server
     * (port?: number, backlog?: number, listeningListener?: () => void): Http2Server
     * (port?: number, listeningListener?: () => void): Http2Server
     * ```
     * @param {number} [port]
     * @param {string|number|{(): void}} [hostname]
     * @param {number|{(): void}} [backlog]
     * @param {{(): void}} [listeningListener]
     * @returns {Http2Server}
     */
    listen(port?: number, hostname?: string | number | {
        (): void;
    }, backlog?: number | {
        (): void;
    }, listeningListener?: {
        (): void;
    }): Http2Server;
    /**
     * @returns {string | AddressInfo | null}
     */
    address(): string | AddressInfo | null;
    /**
     * Closes all connections and shuts down the server after `gracefulTimeout`
     *
     * @param {{(err?: Error): void}} callback
     * @returns {Http2Server}
     */
    close(callback: {
        (err?: Error): void;
    }): Http2Server;
    #private;
}
export type Http2SecureServerOptions = import("http2").SecureServerOptions;
export type RouterOptions = import("#Router.js").RouterOptions;
export type Http2Server = http2.Http2Server | http2.Http2SecureServer;
export type ServerOptions = Http2SecureServerOptions & RouterOptions & {
    onlyHTTP1: boolean;
    gracefulTimeout: number;
};
export type AddressInfo = import("node:net").AddressInfo;
import { Router } from './Router.js';
import * as http2 from 'node:http2';
