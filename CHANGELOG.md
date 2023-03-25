# 0.3.0 (2023-03-25)

### BREAKING CHANGE:

- middleware/contentSec: rename csp to contentSec (#3927466)
- sendMW renamed to send (#b8e3ce9)

### feat:

- middleware/send: send with etag (#6450a45)
- middleware/presets: secure presets for html and json (#3bb91a9)
- middleware/cacheControl: set cache-control for different request methods (#cbe030b)
- middleware/csp: security headers fro JSON responses (#7a48b4c)
- Server: HTTP2 or HTTP1/HTTPS server (#24ef1d7)

### fix:

- middleware/csp: cspJson secure headers (#4b09f13)
- Router: .use() allow array of handlers as first arg (#311ae0e)
- Server: expose address() (#4dc79dc)
- middleware/finalHandler: set CSP header for html response. (#531f690)
- middleware/redirect2Https: allow redirect to allowed list of hosts (#66948d5)
- middleware/finalHandler: fix styling issue on chrome (#c6ccff9)
- response/redirect: remove any previously set cache-control header (#4889fe6)
- response/setHeaders: allow to remove header with send or redirect (#a0af767)

### docs:

- documenting middlewares (#a94ca5c)
- middleware/cacheControl: cacheControlByMethod (#e356a3c)
- middleware/send: documenting send, sendEtag (#f40e48c)
- middleware/tooBusy: documenting tooBusy (#87bf0bc)
- update (#44e9299)
- HttpError: document parameters (#128f5e9)
- wip (#27eedae)
- badges (#c1e875c)

### test:

- middleware/send: shall not set etag on status != 200 (#cf1f678)
- utils/random64: increase test coverage (#bd23f22)

# 0.2.0 (2023-03-17)

### feat:

- middleware/tooBusy (#f7c97c0)
- utils/safeServerShutdown (#e973475)

### fix:

- middleware/csp: add support for script nonces (#cac37d7)
- middleware/finalHandler: better distinguish between outside message (#cea27d6)
- middleware/queryParser: prevent HTTP Parameter Pollution (#b18426c)

### docs:

- start to document middlewares (#ff741bc)
- Update README (#71ee7b7)

### chore:

- bump dependencies (#12df052)

# 0.1.0 (2023-03-02)

### feat:

- middleware/redirect2Https (#5566bf0)
- middleware/cacheControl (#3808241)
- middleware/renderEngine (#7722d78)
- middleware/requestId (#c545d41)
- middleware/csp Content Security Policy (#07a328f)
- middleware/cors (#641847b)
- middleware/cookieParser (#9853749)
- middleware/bodyParser (#c9d6647)

### fix:

- middleware/requestId (#6a87d97)
- accept, acceptEncoding, acceptLanguage header parsing (#b046f3c)
- Router, FindRoute, finalHandler (#7441c92)

### chore:

- README update (#a66a473)
- types (#be4ab88)
- generate test certs (#38c134d)
- editorconfig (#0beb309)
- vscode (#9588ab7)
- npm pack files only (#cf97b10)

# 0.0.1 (2023-02-19)

### feat:

- Router and connect (#9f1a88b)

### other:

- initial commit (#5cae1c0)

