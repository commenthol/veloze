# cacheControl middleware

Middleware which sets the 'cache-control' header.

If set without options defaults to:

'cache-control': 'no-cache, no-store, max-age=0'

See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control

# Usage

```js
import { Router, cacheControl } from "veloze";

const router = new Router();

// safe defaults
router.use(cacheControl());

// with options
router.use(
  cacheControl({
    maxAge: "5days",
    private: true,
    staleIfError: true,
  })
);
```

# Options

| type           | property                | description                                                                                                                                             |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| number\|string | \[maxAge]               | response remains fresh until N seconds                                                                                                                  |
| number\|string | \[sMaxAge]              | response remains fresh until N seconds for shared caches                                                                                                |
| boolean        | \[noCache]              | caches are required to always check for content updates while reusing stored content                                                                    |
| boolean        | \[mustRevalidate]       | response can be stored in caches and can be reused while fresh. If the response becomes stale, it must be validated with the origin server before reuse |
| boolean        | \[proxyRevalidate]      | equivalent of must-revalidate, but specifically for shared caches                                                                                       |
| boolean        | \[noStore]              | caches of any kind (private or shared) should not store this response.                                                                                  |
| boolean        | \[mustUnderstand]       | like mustRevalidate for shared caches                                                                                                                   |
| boolean        | \[private]              | response can be stored only in a private cache                                                                                                          |
| boolean        | \[public]               | response can be stored in a shared cache                                                                                                                |
| boolean        | \[mustUnderstand]       | cache should store the response only if it understands the requirements for caching based on status code                                                |
| boolean        | \[noTransform]          | Some intermediaries transform content for various reasons                                                                                               |
| boolean        | \[immutable]            | response will not be updated while it's fresh                                                                                                           |
| boolean        | \[staleWhileRevalidate] | cache could reuse a stale response while it revalidates it to a cache.                                                                                  |
| boolean        | \[staleIfError]         | cache can reuse a stale response when an origin server responds with an error (500, 502, 503, or 504)                                                   |
