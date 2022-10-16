export class HttpError extends Error {
    /**
     * @param {number} status
     * @param {string} [message]
     * @param {Error} [err]
     */
    constructor(status: number, message?: string | undefined, err?: Error | undefined);
    status: number;
}
