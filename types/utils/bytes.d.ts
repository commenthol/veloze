/**
 * convert string to byte value
 *
 * - b for bytes
 * - kb for kilobytes
 * - mb for megabytes
 * - gb for gigabytes
 * - tb for terabytes
 * - pb for petabytes
 * @param {string|number|undefined} val
 * @returns {number|undefined}
 * @example
 * bytes('100kB') = 102400
 * bytes('2.5MB') = 2621440
 */
export function bytes(val: string | number | undefined): number | undefined;
