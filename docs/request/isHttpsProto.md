[◀︎ request/getHeader](../request/getHeader.md)
[🛖](../index.md)
[response/cookie ▶](../response/cookie.md)

# request/isHttpProto

## isHttpsProto(req)

Verify if request was made using TLS.

If application itself is running as https server or if running behind a
proxy, where `x-forwarded-proto` header was set to `https` returns `true`.

If behind a proxy ensure that the proxy sets the `x-forwarded-proto` header
to `https`.

| type                 | property  | description          |
| -------------------- | --------- | -------------------- |
| http.IncomingMessage | req       | request object       |

[🔝 TOP](#top)
