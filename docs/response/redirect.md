[◀︎ response/cookie](../response/cookie.md)
[🛖](../index.md)
[response/send ▶](../response/send.md)

# response/redirect

Send redirect dependent of content-type.

Defaults to 307 Temporary Redirect

Consider using [middleware/send](../middleware/send.md) to use `res.redirect()`.

# Usage

```ts 
redirect(res: Response, location: string, status?: number, 
  headers?: Record<string, string|number|boolean>): void
```

| type                                     | property   | description                  |
| ---------------------------------------- | ---------- | ---------------------------- |
| Response                                 | res        | The response object          |
| string                                   | location   | The redirect url             |
| number                                   | \[status]  | status code; Defaults to 307 |
| Record\<string, string\|number\|boolean> | \[headers] | Optional headers object      |


```js
import { response } from 'veloze'
const { redirect } = response

redirect(res, 'https://foo.bar', 301, { 'x-request-id': 'abcde' })
```

---

[🔝 TOP](#top)
