[◀︎ send](../middleware/send.md)
[🛖](../index.md)
[request/accept ▶](../request/accept.md)

# tooBusy middleware

Credits https://github.com/STRML/node-toobusy
License WTFPL

Connect middleware which checks if server is too busy.

In case that the event-loop lags behind the defined maxLag, incoming requests
are rejected with a 429 Too Many Requests

# Usage

```js
import { tooBusy, Router } from "veloze";

const app = new Router();

// globally adjust the default values.
const tooBusyOpts = {
  intervalMs: 500, // interval to check event-loop lag
  maxLagMs: 70, // max. allowed lag in milliseconds
  smoothingFactor: 1 / 3, // damping factor with range [0..1]; high values cause
  // faster blocking than low values
};

app.use(tooBusy(tooBusyOpts));
app.all("/*", (req, res) => {
  // do some work...
  res.end();
});
```

# Options

| type           | property           | description                                                                                                                                                                            |
| -------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| number\|string | \[retryAfter]      | if server is busy set retry-after header to `retryAfter seconds`. If number, value is seconds.                                                                                         |
| number         | \[intervalMs]      | (global setting) interval to check lag (ms); shall be greater 50ms                                                                                                                     |
| number         | \[maxLagMs]        | (global setting) max tolerable lag (ms); shall be greater 16ms                                                                                                                         |
| number         | \[smoothingFactor] | (global setting) damping factor with range [0..1]; high values cause faster blocking than low values; see [Exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing) |

[🔝 TOP](#top)
