# cookieParser middleware

Middleware which parses cookies in requests and allows to set or clear cookies
in responses.

Request:

- [`req.cookies`](#req-cookies) as object for parsed cookies

Response:

- [`res.cookie()`](#res-cookie) sets cookie
- [`res.clearCookie()`](#res-clear-cookie) clears cookie

# Usage

```js
import { Router, cookieParser } from "veloze";

const router = new Router();

// safe defaults
router.use(cookieParser);

router.get('/', (req, res) => {
  const { cookies } = req
  if (cookies.session) {
    res.clearCookie('session')
  }
  res.cookie('session', 'mysessionvalue', {
    domain: '*.domain.my'
  })
  res.end()
}
```

<a id="req-cookies"></a>

# req.cookies

Object with parsed cookie values.

<a id="res-cookie"></a>

# res.cookie(name, value, options)

Set cookie in response.

See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie

The `secure` flag will be set, if request uses https or http with http-header
'x-forwarded-proto': 'https'.

### Options:

| type                                     | property    | description                                                                                                                                        |
| ---------------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| string                                   | \[domain]   | Domain/ Host name for the cookie.                                                                                                                  |
| Date                                     | \[expires]  | Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.                                                          |
| boolean                                  | \[httpOnly] | Flags the cookie to be accessible only by the web server.                                                                                          |
| number                                   | \[maxAge]   | Convenient option for setting the expiry time relative to the current time in milliseconds.                                                        |
| string                                   | \[path]     | Path for the cookie. Defaults to "/".                                                                                                              |
| boolean                                  | \[secure]   | Marks the cookie to be used with HTTPS only.                                                                                                       |
| boolean\|string\|<br>'Lax'\|'Strict'\|'None' | \[sameSite] | Value of the "SameSite" Set-Cookie attribute. More information at https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1 |

<a id="res-clear-cookie"></a>

# res.clearCookie(name, options)

Clears cookie in response.

Same options as with [res.cookie(name, value, options)](#res-cookie)
