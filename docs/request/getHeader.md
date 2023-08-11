[◀︎ request/accept](../request/accept.md)
[🛖](../index.md)
[request/isHttpsProto ▶](../request/isHttpsProto.md)

# request/getHeader

## getHeader (req, header)

Returns the HTTP header from the request.

| type                 | property  | description          |
| -------------------- | --------- | -------------------- |
| http.IncomingMessage | req       | request object       |
| string               | \[header] | the header to obtain |

```js
req.headers["content-type"] = "application/json";

getHeader(req, "Content-Type");
// 'application/json'
```

[🔝 TOP](#top)
