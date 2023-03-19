export class HttpError extends Error {
    /**
     * @param {number} status HTTP status code for response
     * @param {string} [message] error message for response
     * @param {Error} [err] internal error cause; is logged in finalHandler; use this for any internal error
     */
    constructor(status: number, message?: string | undefined, err?: Error | undefined);
    status: number;
}
