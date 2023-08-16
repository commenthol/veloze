[◀︎ response/send](../response/send.md)
[🛖](../index.md)
[response/setHeaders ▶](../response/setHeaders.md)

# response/json

Sends JSON response. 

Faster implementation than [send](../response/send.md) for JSON only responses.

Sets ETag header.

Consider using [middleware/json](../middleware/json.md) to use `res.json()`.

# Usage

```ts 
json(res: Response, body: any, status?: number, 
  headers?: Record<string, string|number|boolean>): void
```

| type                                     | property   | description                  |
| ---------------------------------------- | ---------- | ---------------------------- |
| Response                                 | res        | The response object          |
| any                                      | body       | The body to send             |
| number                                   | \[status]  | status code; Defaults to 200 |
| Record\<string, string\|number\|boolean> | \[headers] | Optional headers object      |

```js
import { response } from 'veloze'
const { json } = response

json(res, '<h1>works</h1>')
// response headers
// {'content-type': 'application/json; charset=utf-8'
//  'content-length': '16'}

json(res)
// response headers
// {'content-type': 'application/json; charset=utf-8'
//  'content-length:': '0'}

json(res, { foo: 'bar' })
// response headers
// {'content-type': 'application/json; charset=utf-8'
//  'content-length:': '13'}
```

---

[🔝 TOP](#top)
