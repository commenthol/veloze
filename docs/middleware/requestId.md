[◀︎ middleware/renderEngine](../middleware/renderEngine.md)
[🛖](../index.md)
[middleware/send ▶](../middleware/send.md)

# requestId middleware

Middleware which sets a random request id;
Overwrites or sets `req.headers['x-request-id']`

Consider using [traceContext](../middleware/traceContext.md) instead of requestId.

# Usage

```js
import { requestId, Router } from "veloze";

const app = new Router();
app.use(requestId());
app.all("/*", (req, res) => {
  console.log(req.id); // request id on `req`
  console.log(req.headers['x-request-id']) // same as `req.id`
  res.end();
});
```

# Options

| type    | property | description                                 |
| ------- | -------- | ------------------------------------------- |
| boolean | \[force] | forces setting the requestId on the request |

---

[🔝 TOP](#top)
