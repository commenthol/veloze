# 0.3.0 (2023-03-18)

### feat:

- Server: HTTP2 or HTTP1/HTTPS server

### fix:

- middleware/finalHandler: fix styling issue on chrome
- response/redirect: remove any previously set cache-control header
- response/setHeaders: allow to remove header with send or redirect

### docs:

- wip
- badges

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

