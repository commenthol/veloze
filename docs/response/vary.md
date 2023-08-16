[◀︎ response/setHeaders](../response/setHeaders.md)
[🛖](../index.md)
[utils/bytes ▶](../utils/bytes.md)

# response/vary

Sets vary header on response.

# Usage 

```ts 
vary(res: Response, reqHeader: string): void
```

| type     | property  | description                                        |
| -------- | --------- | -------------------------------------------------- |
| Response | res       | The response object                                |
| string   | reqHeader | request header name to set on vary response header |

```js
import { response } from 'veloze'
const { vary } = response

vary(res, 'accept-encoding')
vary(res, 'User-Agent')
// response header
// { 'vary': 'accept-encoding, user-agent' }
```

---

[🔝 TOP](#top)
