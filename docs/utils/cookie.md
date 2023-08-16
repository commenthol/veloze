[◀︎ utils/bytes](../utils/bytes.md)
[🛖](../index.md)
[utils/escapeHtml ▶](../utils/escapeHtml.md)

# utils/cookie

Cookie parse and serialize functions.

# cookieParse()

```js
import { utils } from 'veloze'

const { cookieParse } = utils

cookieParse('_foobar=FB.1.12.24; preferred_color_mode=light; tz=Asia%2FTokyo')
// {
//   _foobar: 'FB.1.12.24',
//   preferred_color_mode: 'light',
//   tz: 'Asia/Tokyo'
// }
```

# cookieSerialize()

```js
import { utils } from 'veloze'

const { cookieSerialize } = utils

cookieSerialize('foo', 'bar', { maxAge: 10e3 })
// 'foo=bar; Max-Age=10000; HttpOnly; SameSite=Strict'
```

---

[🔝 TOP](#top)
