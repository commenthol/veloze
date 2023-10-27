export function presetHtml(options?: PresetOptions | undefined): Handler[];
export function presetJson(options?: PresetOptions | undefined): Handler[];
export type Handler = import('../types').Handler;
export type PresetOptions = {
    /**
     * body-parser limit
     */
    limit: number | string;
    /**
     * security header options
     */
    cspOpts: import('./contentSec').CspMiddlewareOptions;
    /**
     * }
     */
    cacheControlOpts: import('./cacheControl.js').CacheControlDirectivesByMethod;
    /**
     * }
     */
    requestIdOpts: import('./requestId.js').RequestIdOptions;
};
