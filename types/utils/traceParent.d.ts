/**
 * @see https://www.w3.org/TR/trace-context/#traceparent-header
 */
export class TraceParent {
    static VERSION: string;
    /**
     * parse header value
     * @param {string} value
     * @returns {TraceParent}
     */
    static parse(value: string): TraceParent;
    /**
     * @param {{traceId?:string, parentId?:string, sampled?:boolean}} param0
     */
    constructor({ traceId, parentId, sampled }?: {
        traceId?: string;
        parentId?: string;
        sampled?: boolean;
    });
    traceId: string | undefined;
    parentId: string | undefined;
    sampled: boolean;
    /**
     * @param {boolean} [sampled]
     * @returns {this} self
     */
    update(sampled?: boolean): this;
    /**
     * add response object to update header on change
     * @param {import('http').ServerResponse} res
     */
    addResponse(res: import("http").ServerResponse): this;
    _res: import("http").ServerResponse<import("http").IncomingMessage> | undefined;
    toString(): string;
}
