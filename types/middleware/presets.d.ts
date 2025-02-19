export function presetHtml(options?: PresetOptions): Handler[];
export function presetJson(options?: PresetOptions): Handler[];
export type Handler = import("#types.js").Handler;
export type PresetOptions = {
    /**
     * body-parser limit
     */
    limit: number | string;
    /**
     * security header options
     */
    cspOpts: import("./contentSec.js").CspMiddlewareOptions;
    /**
     * }
     */
    cacheControlOpts: import("./cacheControl.js").CacheControlDirectivesByMethod;
    /**
     * }
     */
    requestIdOpts: import("./requestId.js").RequestIdOptions;
};
