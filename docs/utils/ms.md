[◀︎ utils/escapeHtml](../utils/escapeHtml.md)
[🛖](../index.md)
[utils/qs ▶](../utils/qs.md)

# utils/ms

Convert string to milliseconds (or seconds) value.

- y for year
- mo for month
- w for week
- d for day
- h for hour
- m for minute
- s for second

```ts
function ms(value: number | string | undefined, inSeconds: boolean): number
```

```js
import { utils } from 'veloze'

const { ms } = utils

ms()                // undefined
ms(1000)            // 1000 (ms)
ms('1year')         // 31557600000 (ms)
ms('3months')       // 7889400000 (ms)
ms('4hours')        // 14400000 (ms)
ms('2weeks', true)  // 1209600 (in seconds)!
```

[🔝 TOP](#top)
