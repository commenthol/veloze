/**
 * @param {number|string|undefined} value
 * @param {boolean} [inSeconds] if `true` convert `value` to seconds; Only valid if value is string
 * @returns {number|undefined}
 */
export function ms(value: number | string | undefined, inSeconds?: boolean | undefined): number | undefined;
