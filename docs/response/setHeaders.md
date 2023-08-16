[◀︎ response/json](../response/json.md)
[🛖](../index.md)
[response/vary ▶](../response/vary.md)

# response/setHeaders

Set (multiple) headers on response.

If header value is set to `false` header is removed.

# Usage 

```ts 
setHeaders(res: Response, headers?: Record<string, string|number|boolean>): void
```

| type                                     | property   | description                  |
| ---------------------------------------- | ---------- | ---------------------------- |
| Response                                 | res        | The response object          |
| Record\<string, string\|number\|boolean> | \[headers] | Optional headers object      |

```js
import { response } from 'veloze'
const { setHeaders } = response

setHeaders(res, {
  'content-type': 'text/html; charset=utf-8',
  'x-request-id': 'abcdef',
  'content-length': false //< will be removed
})
```

---

[🔝 TOP](#top)
