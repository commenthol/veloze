[◀︎ utils/qs](../utils/qs.md)
[🛖](../index.md)
[utils/setLogger ▶](../utils/setLogger.md)

# utils/random64

Generate a random string composed of chars `[0-9a-zA-Z_-]` with length = 21.

Same entropy as with random UUID can be achieved with a length of 21 chars `(random64) 64^21 > (uuid4) 16^31`

```ts
function random64(length?: number, noDashes?: boolean): string;
```

For `noDashes=true` the random string only uses the chars `[0-9a-zA-Z]`.

Base function is `nanoid` which uses `ALPHABET = DIGITS + LOWERCASE` as default
alphabet:

```ts
export const DIGITS: "0123456789";
export const HEX: string;
export const LOWERCASE: "abcdefghijklmnopqrstuvwxyz";
export const UPPERCASE: string;
export const DASHES: "_-";

export function nanoid(length?: number, alphabet?: string): string;
```

usage:

```js
import { utils } from 'veloze'

const ALPHABET = utils.DIGITS + utils.LOWERCASE + utils.UPPERCASE 

const random = utils.nanoid(16, ALPHABET)
```

---

[🔝 TOP](#top)
