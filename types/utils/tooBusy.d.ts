/**
 * @typedef {object} TooBusyOptions
 * @property {number} [intervalMs=500] interval to check lag (ms); shall be greater 50ms
 * @property {number} [maxLagMs=70] max tolerable lag (ms); shall be greater 16ms
 * @property {number} [smoothingFactor=1/3] damping factor with range [0..1]; high values cause faster blocking than low values; see https://en.wikipedia.org/wiki/Exponential_smoothing
 */
/**
 * @returns {boolean}
 */
export function tooBusy(): boolean;
export namespace tooBusy {
    /**
     * set settings
     * @param {TooBusyOptions} [options]
     */
    function set(options?: TooBusyOptions): void;
    /**
     * get settings
     * @returns {TooBusyOptions}
     */
    function get(): TooBusyOptions;
    /**
     * @returns {number} current lag in ms
     */
    function lag(): number;
    /**
     * reset function for testing
     */
    function reset(): void;
}
export type TooBusyOptions = {
    /**
     * interval to check lag (ms); shall be greater 50ms
     */
    intervalMs?: number | undefined;
    /**
     * max tolerable lag (ms); shall be greater 16ms
     */
    maxLagMs?: number | undefined;
    /**
     * damping factor with range [0..1]; high values cause faster blocking than low values; see https://en.wikipedia.org/wiki/Exponential_smoothing
     */
    smoothingFactor?: number | undefined;
};
