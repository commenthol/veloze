[◀︎ request/isHttpsProto](../request/isHttpsProto.md)
[🛖](../index.md)
[response/cookie ▶](../response/cookie.md)

# request/remoteAddress

## remoteAddress(req, isBehindProxy?)

Obtain the remote address of the connection.

If application itself is running behind a proxy, where `x-forwarded-for` header
was set, use `isBehindProxy=true`.

Returns either the remote address string or undefined.

| type                 | property       | description                |
| -------------------- | -------------- | -------------------------- |
| http.IncomingMessage | req            | request object             |
| boolean              | isBehindProxy? | set `true` if behind proxy |

---

[🔝 TOP](#top)
