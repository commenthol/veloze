/**
 * @typedef {object} ErrorCause
 * @property {Error} [cause] error cause
 * @property {string} [code] represents the error code
 * @property {object} [info] object with details about the error condition, e.g. validation errors
 */
export class HttpError extends Error {
    /**
     * @param {number} [status]
     * @param {string} [message]
     * @param {Error|ErrorCause} [options]
     */
    constructor(status?: number, message?: string, options?: Error | ErrorCause);
    status: number;
    code: string | undefined;
    info: any;
}
export type ErrorCause = {
    /**
     * error cause
     */
    cause?: Error | undefined;
    /**
     * represents the error code
     */
    code?: string | undefined;
    /**
     * object with details about the error condition, e.g. validation errors
     */
    info?: object;
};
