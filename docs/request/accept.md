[◀︎ middlewares/tooBusy](../middleware/tooBusy.md)
[🛖](../index.md)
[getHeader ▶](../request/getHeader.md)

# request/accept

## accept(req, weight)

Parses the 'accept' request header. MIME types are returned as they appear.

| type                 | property  | description                   |
| -------------------- | --------- | ----------------------------- |
| http.IncomingMessage | req       | request object                |
| boolean              | \[weight] | optionally returns the weight |

```js
req.headers.accept =
  "text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8";

const parsed = accept(req);
// parsed === [
//   'text/html',
//   'application/xhtml+xml',
//   'application/xml',
//   'image/webp',
//   '*/*'
// ]
```

Parse with weights

```js
req.headers.accept =
  "text/html, application/xhtml+xml, application/xml;q=0.9, image/webp, */*;q=0.8";

const parsed = accept(req, true);
// parsed === [
//   ['text/html', 1],
//   ['application/xhtml+xml', 1],
//   ['application/xml', 0.9],
//   ['image/webp', 1],
//   ['*/*', 0.8]
// ]
```

## acceptEncoding(req, weight)

Parses the 'accept-encoding' request header

Uses same API as `accept()`.

[🔝 TOP](#top)
