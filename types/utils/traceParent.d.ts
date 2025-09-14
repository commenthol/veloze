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
    toString(): string;
}
