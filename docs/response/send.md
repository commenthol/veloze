[◀︎ response/redirect](../response/redirect.md)
[🛖](../index.md)
[response/json ▶](../response/json.md)

# response/send

Sends response.

Sets content-type header and corrects headers based on status-code.

Sets ETag header.

Consider using [middleware/send](../middleware/send.md) to use `res.send()`.

# Usage

```ts 
send(res: Response, body: any, status?: number, 
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
const { send } = response

send(res, '<h1>works</h1>')
// response headers
// {'content-type': 'text/html; charset=utf-8'
//  'content-length': '14'}

send(res)
// response headers
// {'content-type': 'text/html; charset=utf-8'
//  'content-length:': '0'}

send(res, { foo: 'bar' })
// response headers
// {'content-type': 'application/json; charset=utf-8'
//  'content-length:': '13'}
```

---

[🔝 TOP](#top)
