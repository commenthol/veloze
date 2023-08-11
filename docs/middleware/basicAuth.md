[◀︎ core/HttpError](../core/HttpError.md)
[🛖](../index.md)
[middleware/bodyParser ▶](../middleware/bodyParser.md)

# basicAuth middleware

Checks basic-authorization.

In case that username is known then middleware chain is processed with username
being part of `req.auth.username`.

Otherwise HTTP 401 Unauthorized is thrown.

# Usage

```js
import { Router, basicAuth } from "veloze";

const app = new Router();
app.get(
  "/",
  basicAuth({
    users: { foo: "bar", me: "secret" }, // define allowed users
    realm: "Secured Area", // optional realm name
  }),
  (req, res) => {
    const { username } = req.auth;
    res.end();
  }
);
```

# Options

| type   | property         | description                                                      |
| ------ | ---------------- | ---------------------------------------------------------------- |
| object | users            | object with usernames as keys and plain text passwords as values |
| string | \[realm=Secure\] | realm name                                                       |

[🔝 TOP](#top)
