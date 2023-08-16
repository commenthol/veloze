[◀︎ request/isHttpsProto](../request/isHttpsProto.md)
[🛖](../index.md)
[response/redirect ▶](../response/redirect.md)

# response/cookie

Set and clear cookie functions on response.

# setCookie()

Sets a cookie on the response using the `Set-Cookie` header.

```ts 
setCookie(res: Response, name: string, value: string | number | boolean, opts?: CookieOpts): Response;
```

| type          | property | description         |
| ------------- | -------- | ------------------- |
| Response      | res      | The response object |
| string        | name     | Cookie name         |
| string        | value    | Cookie value        |
| CookieOptions | \[opts]  | The cookie options  |

```js
import { request } from 'veloze'
const { setCookie } = request

setCookie(res, 'foo', 'bar', { maxAge: 10e3, domain: 'foo.bar' }),
//> 'set-cookie' == 'foo=bar; Domain=foo.bar; Max-Age=10000; HttpOnly; SameSite=Strict'

setCookie(res, 'foo', 'bar', { 
  expires: new Date('01 Jan 1970 00:00:00 GMT'), 
  httpOnly: false, sameSite: false 
})
//> 'set-cookie' == 'foo=bar; Expires=Thu, 01 Jan 1970 00:00:00 GMT'
```

# clearCookie()

Clears a cookie.

```ts
clearCookie(res: Response, name: string, opts?: CookieOpts): Response
```

| type          | property | description         |
| ------------- | -------- | ------------------- |
| Response      | res      | The response object |
| string        | name     | Cookie name         |
| CookieOptions | \[opts]  | The cookie options  |

## CookieOptions

| type                             | property    | description                                                                                                                                        |
| -------------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| string                           | \[domain]   | Domain name for the cookie.                                                                                                                        |
| Date                             | \[expires]  | Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie.                                                          |
| boolean                          | \[httpOnly] | Flags the cookie to be accessible only by the web server.                                                                                          |
| number                           | \[maxAge]   | Convenient option for setting the expiry time relative to the current time in milliseconds.                                                        |
| string                           | \[path]     | Path for the cookie. Defaults to "/".                                                                                                              |
| boolean                          | \[secure]   | Marks the cookie to be used with HTTPS only.                                                                                                       |
| boolean\|'Lax'\|'Strict'\|'None' | \[sameSite] | Value of the "SameSite" Set-Cookie attribute. More information at https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1 |

---

[🔝 TOP](#top)
