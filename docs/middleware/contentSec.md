[◀︎ middleware/compress](../middleware/compress.md)
[🛖](../index.md)
[middleware/cookieParser ▶](../middleware/cookieParser.md)

# contentSec middleware

Middleware which adds various security headers on pages.

> This is a "slow" middleware. If performance is required it is recommended to
> set the security headers "manually". Use this middleware then to identify the
> necessary secure settings to extract the headers into it's own middleware. 

**Table of Contents**

<!-- !toc (omit="csp - security middleware") -->

- [Usage](#usage)
- [Options](#options)
  - [csp](#csp)
    - [CSP script nonces](#csp-script-nonces)
    - [CSP omit defaults](#csp-omit-defaults)
  - [hsts](#hsts)
  - [referrerPolicy](#referrerpolicy)
  - [xContentTypeOptions](#xcontenttypeoptions)
  - [xDnsPrefetchControl](#xdnsprefetchcontrol)
  - [crossOriginEmbedderPolicy](#crossoriginembedderpolicy)
  - [crossOriginOpenerPolicy](#crossoriginopenerpolicy)
  - [crossOriginResourcePolicy](#crossoriginresourcepolicy)

<!-- toc! -->

# Usage

```js
import { Router, contentSec } from "veloze";

const router = new Router();

// safe defaults
router.use(contentSec());

// custom settings
router.use(
  contentSec({
    csp:  "script-src": ["nonce", "strict-dynamic"] ,
    hsts:  maxAge: "180d" ,
    referrerPolicy: "origin",
    xContentTypeOptions: false,
    xDnsPrefetchControl: "on",
    crossOriginEmbedderPolicy: "unsafe-none",
    crossOriginOpenerPolicy: "unsafe-none",
    crossOriginResourcePolicy: "same-site",
  })
);
```

An example for using the csp middleware with the cspReport middleware see
`examples/csp.js`.

# Options

## csp

Sets the `content-security-policy` header.

Defaults to:

'content-security-policy': "default-src 'self'; font-src 'self' https: data:;
img-src 'self' data:; object-src 'none'; script-src 'self';
script-src-attr 'none'; style-src 'self' 'unsafe-inline' https:;
base-uri 'self'; form-action 'self'; frame-ancestors 'self';
upgrade-insecure-requests"

See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy

| type             | property                    | description                                            |
| ---------------- | --------------------------- | ------------------------------------------------------ |
| boolean          | [omitDefaults]              | if `true` CspOptions are not patched with CSP_DEFAULTS |
| boolean          | [reportOnly]                | if `true` csp is only reported but not blocked         |
| string\|string[] | [connect-src]               |                                                        |
| string\|string[] | [default-src]               |                                                        |
| string\|string[] | [font-src]                  |                                                        |
| string\|string[] | [frame-src]                 |                                                        |
| string\|string[] | [img-src]                   |                                                        |
| string\|string[] | [manifest-src]              |                                                        |
| string\|string[] | [media-src]                 |                                                        |
| string\|string[] | [object-src]                |                                                        |
| string\|string[] | [prefetch-src]              |                                                        |
| string\|string[] | [script-src]                |                                                        |
| string\|string[] | [script-src-elem]           |                                                        |
| string\|string[] | [script-src-attr]           |                                                        |
| string\|string[] | [style-src]                 |                                                        |
| string\|string[] | [style-src-elem]            |                                                        |
| string\|string[] | [style-src-attr]            |                                                        |
| string\|string[] | [worker-src]                |                                                        |
| string\|string[] | [base-uri]                  |                                                        |
| string\|string[] | [sandbox]                   |                                                        |
| string\|string[] | [form-action]               |                                                        |
| string\|string[] | [frame-ancestors]           |                                                        |
| string\|string[] | [navigate-to]               |                                                        |
| string           | [report-to]                 |                                                        |
| string           | [report-uri]                |                                                        |
| string\|string[] | [require-trusted-types-for] |                                                        |
| string\|string[] | [trusted-types]             |                                                        |
| boolean          | [upgrade-insecure-requests] |                                                        |

```js
router.use(contentSec());

// disable header
router.use(
  contentSec(
    csp: false,
  )
);
```

### CSP script nonces

See https://web.dev/strict-csp/

```js
router.use(
  contentSec({
    csp:
      "script-src": ["nonce", "strict-dynamic"],
    ,
  })
);

router.get("/index.html", () =>
  // res.locals.nonce will contain the nonce
  const  nonce  = res.locals;
  res.setHeader("content-type", "text/html");
  // render script nonce through template
  res.end(`
    <body>
      <h1>works</h1>
      <script nonce="$nonce" src="./index.js"></script>
    </body>
  `);
);
```

### CSP omit defaults

Any csp settings will be patched with the recommended defaults. If this shall be
avoided use `omitDefaults: true` and set the required directives.

```js
router.use(
  contentSec({
    omitDefaults: true,
    "frame-ancestors": ["none"],
  })
);
// 'content-security-policy': "frame-ancestors 'none'"
```

## hsts

Sets the `strict-transport-security` header for https connections. Only for
requests using https or http with http-header 'x-forwarded-proto': 'https' being
set.

Defaults to:

'strict-transport-security': 'max-age=15552000; includeSubDomains'

See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security

| type           | property                 | description                                           |
| -------------- | ------------------------ | ----------------------------------------------------- |
| number\|string | [maxAge='180d']          | max-age in seconds (defaults to 180days) or ms-string |
| boolean        | [includeSubDomains=true] |
| boolean        | [preload=false]          |

```js
router.use(
  contentSec({
    hsts:  maxAge: "30d", includeSubDomains: false, preload: true ,
  })
);
// 'strict-transport-security': 'max-age=2592000; preload'

// disable header
router.use(
  contentSec({
    hsts: false,
  })
);
```

## referrerPolicy

Sets the `referrer-policy` header.

Defaults to:

'referrer-policy': 'no-referrer'

See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy

Possible values:

- false (disables header)
- `no-referrer`
- `no-referrer-when-downgrade`
- `origin`
- `origin-when-cross-origin`
- `same-origin`
- `strict-origin`
- `strict-origin-when-cross-origin`
- `unsafe-url`

```js
// set header
router.use(
  contentSec({
    referrerPolicy: "origin-when-cross-origin",
  })
);

// disable header
router.use(
  contentSec({
    referrerPolicy: false,
  })
);
```

## xContentTypeOptions

Sets the `x-content-type-options` header.

Defaults to:

'x-content-type-options': 'nosniff'

See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options

```js
// set header
router.use(
  contentSec({
    xContentTypeOptions: true,
  })
);

// disable header
router.use(
  contentSec({
    xContentTypeOptions: false,
  })
);
```

## xDnsPrefetchControl

Sets the `x-dns-prefetch-control` header.

Defaults to:

'x-dns-prefetch-control': 'off'

See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control

Possible values:

- false (disables header)
- 'off'
- 'on'

## crossOriginEmbedderPolicy

Sets the `cross-origin-embedder-policy` header.

Defaults to:

'cross-origin-embedder-policy': 'require-corp'

See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy

## crossOriginOpenerPolicy

Sets the `cross-origin-opener-policy` header.

Defaults to:

'cross-origin-opener-policy': 'same-origin'

See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy

## crossOriginResourcePolicy

Sets the `cross-origin-resource-policy` header.

Defaults to:

'cross-origin-resource-policy': 'same-origin'

See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy



[🔝 TOP](#top)
