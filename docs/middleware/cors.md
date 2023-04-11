[◀︎ cookieParser](../middleware/cookieParser.md)
[🛖](../index.md)
[queryParser ▶](../middleware/queryParser.md)

# CORS middleware

Middleware to handle
[CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) preflight and
CORS response headers for different origins.

# Usage

```js
import { cors, Router } from "veloze";

const app = new Router();
app.use(
  cors({
    origin: [
      // list of allowed origins
      // as string
      "http://localhost",
      // as RegExp
      /^https:\/\/[a-z]+\.foo\.bar$/,
      // or function
      (req) => req.headers?.origin === "https://localhost",
    ],
  })
);
app.all("/*", (req, res) => {
  res.end();
});
```

# Options

where `Origin`: `{(string|RegExp|((req: Request) => boolean))}`

| type                | property                                                       | description                                                                                 |
| ------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| boolean             | \[preflightContinue=false]                                     | if `true` next middleware is called instead of responding the request                       |
| Origin \| Origin\[] | \[origin=/^https?:\\/\\/(localhost\|127\\.0\\.0\\.1)(:\d{2,5}\|)$/] | list of allowed origins; defaults to localhost.                                             |
| string              | \[methods='GET,HEAD,<br>PUT,PATCH,POST,DELETE']                | comma separated list of allowed methods                                                     |
| boolean             | \[credentials=false]                                           | if `true` allow requests to send cookies, authorization headers, or TLS client certificates |
| string              | \[headers]                                                     | list any number of allowed headers, separated by commas                                     |
| string              | \[exposeHeaders]                                               | list of comma-separated header names that clients are allowed to access from a response.    |
| number              | \[maxAge]                                                      | caching max-age in seconds. Is set to 7200 (2h) for NODE_ENV !== development                |

[🔝 TOP](#top)
