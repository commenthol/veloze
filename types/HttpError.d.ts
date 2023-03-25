/**
 * @typedef {object} HttpErrorParam
 * @property {Error} [cause] internal error cause; is logged in finalHandler; use this for any internal error
 * @property {object|string} [description] error description for use in response
 * @property {string|number} [code] optional error code
 */
export class HttpError extends Error {
    /**
     * @param {number} status HTTP status code for response
     * @param {string} [message] error message for response
     * @param {Error|HttpErrorParam} [param]
     */
    constructor(status: number, message?: string | undefined, param?: Error | HttpErrorParam | undefined);
    status: number;
    description: any;
    code: string | number | undefined;
}
export type HttpErrorParam = {
    /**
     * internal error cause; is logged in finalHandler; use this for any internal error
     */
    cause?: Error | undefined;
    /**
     * error description for use in response
     */
    description?: object | string;
    /**
     * optional error code
     */
    code?: string | number | undefined;
};
