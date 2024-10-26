/**
 * @typedef {object} Range
 * @property {number} start
 * @property {number} end
 */
/**
 * Parses the "Range" header and returns an the first range object.
 * @param {string} rangeHeader The "range" header value.
 * @param {number} size
 * @returns {[start: number, end: number]|[-1]|[]}
 */
export function rangeParser(rangeHeader: string | undefined, size: number): [start: number, end: number] | [-1] | [];
export type Range = {
    start: number;
    end: number;
};
