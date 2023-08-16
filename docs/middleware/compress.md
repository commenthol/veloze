[◀︎ middleware/cacheControl](../middleware/cacheControl.md)
[🛖](../index.md)
[middleware/contentSec ▶](../middleware/contentSec.md)

# compress middleware

Compress text based responses with brotli, gzip vor deflate compression
dependent on accept-encoding request header. 

This middleware will never compress responses that either already include a
content-encoding response header or a cache-control header with the no-transform
directive.

# Usage

```js
import { compress, Router } from "veloze";

const app = new Router();
app.use(compress())
app.get('/', (req, res) => {
  res.set header('content-type, 'text/html')
  res.end('<h1>works</h1>')
})
```

# Options

```ts
function compress(options?: {
    threshold?: string | number;
    healTheBreach?: boolean;
    compressOptions?: zlib.BrotliOptions & zlib.ZlibOptions;
    filter?: ((req: Request, res: Response) => boolean);
}): Handler
```

## threshold

Default is 1024 or '1kB' (using [bytes](../utils/bytes.md)). If content-length
is greater than threshold, then content might be compressed.

## healTheBreach

Default is `true`. Prevents BREACH attack for html, js and json MIME-types on
compressed content by adding variable length spaces to the content.

## compressOptions

Compression options for brotli, gzip or deflate compressor. Applied on
`zlib.createBrotliCompress`, ...

See [zlib.Options](https://nodejs.org/docs/latest/api/zlib.html#class-options)

## filter

Filter function to control which response shall be compressed. If `true` then content may get compressed based on the accept-encoding request header. Otherwise no compression is applied. 
Control custom compressible MIME-types by using this filter function.

Defaults to:

```js
(req, res) => {
  const mimeType = res.getHeader('content-type')
  return /^text\/|^application\/json\b/.test(mimeType)
}
```

---

[🔝 TOP](#top)
