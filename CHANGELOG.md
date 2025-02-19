# 1.1.0 (2025-02-10)

### feat:

- replace logger with ProcLog from debug-level (#27705eb)

### docs:

- update setLogger (#adaeec4)

### chore:

- bump dependencies (#6036d4a)

# 1.0.0 (2024-11-16)

### fix:

- request/remoteAddress: validate ip address (#511b580)
- static code check; sanitize regexes (#0e7a894)

### chore:

- change to eslint-prettier (#f8e7ab7)

# 0.8.2 (2024-10-26)

### fix:

- types (#4962e23)

### chore:

- upgrade gh actions to v4; deprecate node 18 in favor of node 22 (#a9e372a)

# 0.8.1 (2024-02-25)

### fix:

- bump dependencies (#b1228d7)

### docs:

- fix missing reference in index for remoteAddress (#a4ef3c1)

### test:

- fix remote address tests (#e60cf50)

# 0.8.0 (2024-02-13)

### feat:

- request/remoteAddress (#c5a2890)

# 0.7.1 (2024-01-31)

### fix:

- utils/ms: make inSeconds optional (#786bfd9)

### chore:

- bump dependencies (#a38f2db)

# 0.7.0 (2023-11-25)

### feat:

- middleware/implicitHeader: new middleware (#244141c)

### fix:

- utils/cookie: set secure flag as default (#0e6c29f)
- add request id opts to presets and remove toobusy (#b166a30)
- expose finalLogger (#e5dc159)
- middleware/contentSec: allow true in buildHsts options (#12f3674)
- middleware/renderEngine: use views as option (#a9fc5f4)

### docs:

- presets and redirect2Https (#9fb7233)

### chore:

- fix types (#d25cddb)
- bump dependencies (#39c4b4f)

# 0.6.1 (2023-08-12)

### fix:

- allow custom MIME types in serve (#9ce1beb)
- filter function in compress and serve (#55856e2)

### docs:

- documenting compress and finalHandler middleware (#15730b0)

# 0.6.0 (2023-08-11)

### feat:

- compress middleware (#482c2a3)
- middleware/serve (#73c8bee)

### fix:

- response/cookie: appendHeader not supported in http2 (#fd8d6c4)

### docs:

- documentation (#3a04696)

### chore:

- bump dependencies (#cdcb1e7,#5566d78,#2e73504)

### refactor:

- flattened handlers (#b08cc23)

### test:

- run tests with http2 agent (#fd3cf3b)

# 0.5.2 (2023-05-30)

### chore:

- fix linter issue; bump dependencies (#6bac6db)

# 0.5.1 (2023-05-30)

### fix:

- types (#70892de)
- Server: this.#server may be undefined (#af074c2)
- utils/cookie: remove regex (#68d3633)
- types (#e373295)

### chore:

- package with docs (#2a42eae)

### test:

- fix failing tests on utils/tooBusy (#b54822d)

# 0.5.0 (2023-05-23)

### feat:

- new middleware basicAuth (#7a42dfd)

### docs:

- fix link to docs (#89f8d08)

### refactor:

- allow logger overwrite (#b4afe0e)

# 0.4.2 (2023-05-21)

### fix:

- middleware/requestId: setResponseHeader option (#60f88a2)
- types (#69c71d9)
- change req.path to getter only (#74d398b)

### docs:

- CONTRIBUTING (#2aa7c15)

### chore:

- bump devDependencies (#9afc38b)

# 0.4.1 (2023-04-16)

### fix:

- routing if exact route found (#72b840a)

# 0.4.0 (2023-04-16)

### feat:

- change HttpError (#d65b75a)
- res.json for json responses (#86b0655)
- add path to request (#85374c2)
- cache find route results (#4010612)

### docs:

- json middleware (#529c6b7)
- contentSec is "slow" (#92eca07)
- Server documentation (#26aea00)

### chore:

- skip tests for github actions (#0e07ad5)
- github actions (#72ba26a)

# 0.3.1 (2023-03-28)

### fix:

- middleware/finalHandler: json type detection (#5c96af8)
- FindRoute: wildcard with parameters (#40c957f)
- FindRoute: routing issue with param route and different methods (#0b5be97)
- Router: improve use with multiple paths (#47ac91d)
- HttpError: Add description object, string to HttpError (#d74d439)
- middleware/bodyParser: skip parsing if req.body is present (#c3be476)
- Router: define common methods for types (#63b4fc4)
- middleware/queryParser: no reprocessing (#2a5b271)

### docs:

- documenting Router (#e0104c7)
- documenting connect (#7017cd2)

### chore:

- types (#cb09449)

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

