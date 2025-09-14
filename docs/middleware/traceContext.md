[◀︎ middleware/tooBusy](../middleware/tooBusy.md)
[🛖](../index.md)
[middleware/presets ▶](../middleware/presets.md)

# traceContext middleware

Connect middleware which implements traceparent header parsing as defined in
https://www.w3.org/TR/trace-context.

# Usage

```js
import { traceContext, Router } from "veloze";

const app = new Router();

app.use(traceContext());
app.all("/*", (req, res) => {
  // set the response tracing header from the request
  res.setHeader('traceparent', req.traceparent.toString())
  res.end();
});
```

---

[🔝 TOP](#top)
