/**
 * @typedef {[value: string, weight?: number]|string} HeaderParserResult
 */
/**
 * header parser for weighted values;
 * no weighted numbers are considered
 * @param {string} value
 * @param {object} [options]
 * @param {(value: string) => string|string[]|undefined} [options.fn]
 * @param {boolean} [options.weight] return only values with weight
 * @returns {HeaderParserResult[]}
 */
export function headerParser(value?: string, options?: {
    fn?: ((value: string) => string | string[] | undefined) | undefined;
    weight?: boolean | undefined;
}): HeaderParserResult[];
export type HeaderParserResult = [value: string, weight?: number] | string;
