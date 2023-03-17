/// <reference types="node" />
/**
 * @class
 * HTTP2 server
 *
 * If providing a key and cert then server starts as secureServer.
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
    listen(port?: number | undefined, hostname?: string | number | (() => void) | undefined, backlog?: number | (() => void) | undefined, listeningListener?: (() => void) | undefined): Http2Server;
    /**
     * Closes all connections and shuts down the server after `gracefulTimeout`
     *
     * @param {{(err?: Error): void}} callback
     * @returns {Http2Server}
     */
    close(callback: (err?: Error) => void): Http2Server;
    #private;
}
export type Http2SecureServerOptions = import('http2').SecureServerOptions;
export type RouterOptions = import('./Router').RouterOptions;
export type Http2Server = http2.Http2Server | http2.Http2SecureServer;
export type ServerOptions = Http2SecureServerOptions & RouterOptions & {
    gracefulTimeout: number;
};
import { Router } from './Router.js';
import * as http2 from 'node:http2';
