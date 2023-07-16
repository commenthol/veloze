/**
 * @param {string|URL} root directory
 * @param {{
 *  etag?: boolean
 *  fallthrough?: boolean
 *  index?: string
 *  strip?: string
 * }} [options]
 * @returns
 */
export function serve(root: string | URL, options?: {
    etag?: boolean | undefined;
    fallthrough?: boolean | undefined;
    index?: string | undefined;
    strip?: string | undefined;
} | undefined): (req: any, res: any, next: any) => Promise<void>;
