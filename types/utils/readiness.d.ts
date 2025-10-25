export function nap(ms?: number): Promise<any>;
export function abort(ms?: number): AbortPromise;
/**
 * @typedef {Object} Check
 * @property {() => Promise<boolean>} asyncFn
 * @property {boolean} result
 * @property {Date} checkAt
 */
/**
 * Run readiness checks at regular intervals
 */
export class Readiness {
    /**
     * @param {{
     *  name?: string,
     *  intervalMs?: number,
     *  abortTimeoutMs?: number,
     * }} options
     */
    constructor(options: {
        name?: string;
        intervalMs?: number;
        abortTimeoutMs?: number;
    });
    /** @type {Map<string, Check>} */
    _map: Map<string, Check>;
    /** @type {boolean} */
    _isRunning: boolean;
    _options: {
        name: string;
        intervalMs: number;
        abortTimeoutMs: number;
    };
    /**
     * register a readiness check
     * @param {string} name
     * @param {() => Promise<boolean> } asyncFn
     * @param {boolean} [initialResult=false]
     */
    register(name: string, asyncFn: () => Promise<boolean>, initialResult?: boolean): void;
    /**
     * @returns {{statusCode: number, results: {}|Record<string, {result: boolean, checkAt: Date}>}}
     */
    getResults(): {
        statusCode: number;
        results: {} | Record<string, {
            result: boolean;
            checkAt: Date;
        }>;
    };
    start(): Promise<void>;
    stop(): void;
    /**
     * @private
     * @param {string} name
     * @param {Check} check
     */
    private _runCheck;
    _runAllChecks(): Promise<void>;
}
export type AbortPromise = Promise<never> & {
    abort: () => void;
};
export type Check = {
    asyncFn: () => Promise<boolean>;
    result: boolean;
    checkAt: Date;
};
