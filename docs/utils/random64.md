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

---

[🔝 TOP](#top)
