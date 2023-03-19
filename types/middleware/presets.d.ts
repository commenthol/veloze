export function presetHtml(options?: PresetOptions | undefined): Handler[];
export function presetJson(options?: PresetOptions | undefined): Handler[];
export type Handler = import('../types.js').Handler;
export type PresetOptions = {
    /**
     * body-parser limit
     */
    limit: number | string;
    /**
     * security header options
     */
    cspOpts: import('./csp').CspMiddlewareOptions;
    /**
     * Note: tooBusy options are set globally for the whole server
     */
    tooBusyOpts: import('./tooBusy.js').TooBusyOptions;
    /**
     * }
     */
    cacheControlOpts: import('./cacheControl.js').CacheControlDirectivesByMethod;
};
