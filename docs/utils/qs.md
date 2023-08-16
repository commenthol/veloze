[◀︎ utils/ms](../utils/ms.md)
[🛖](../index.md)
[utils/random64 ▶](../utils/random64.md)

# utils/qs

Parses a query string.

To prevent HTTP Parameter Pollution only the last parameter will be
serialized into the query record.

```js
import { utils } from 'veloze'
const { qs } = utils

qs('query=1&foo=bar&hi=%F0%9F%8C%88%F0%9F%A6%84&__proto__=oops')
// { query: '1', foo: 'bar', hi: '🌈🦄' }
qs('name=1&name=2&name=3&name=4')
// { name: 4 }
```

---

[🔝 TOP](#top)
