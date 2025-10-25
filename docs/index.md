# veloze

A modern and fast express-like HTTP/2 webserver for the web.

Allows you to:
- reuse connect (express) middlewares
- use secure defaults
- pick the pieces to build your server 
- use async middlewares like `async (req, res) => { ... }`

# Core

- [connect](./core/connect.md) Connects middlewares
- [Router](./core/Router.md) Routes to connected 
- [Server](./core/Server.md) Runs the server
- [HttpError](./core/HttpError.md) HTTP Error

# Middlewares

- [bodyParser](./middleware/bodyParser.md) Parse body for POST, PUT, PATCH and SEARCH requests.
- [cacheControl](./middleware/cacheControl.md) Set 'cache-control' header.
- [compress](./middleware/compress.md) Compression middleware.
- [cookieParser](./middleware/cookieParser.md) Parse cookies or set them.
- [contentSec](./middleware/contentSec.md) Add security headers.
- [cors](./middleware/cors.md) CORS preflight and response headers.
- [finalHandler](./middleware/finalHandler.md) Provides a error response according to a given error.
- [queryParser](./middleware/queryParser.md) Parse the query string.
- [redirect2https](./middleware/redirect2https.md) Redirect from http to https.
- [renderEngine](./middleware/renderEngine.md) Using template render engines.
- [requestId](./middleware/requestId.md) Sets a random request (correlation) id.
- [send, sendEtag](./middleware/send.md) res.send(), res.redirect() utility middleware.
- [json, jsonEtag](./middleware/json.md) res.json() utility middleware.
- [serve](./middleware/serve.md) Serves static files.
- [tooBusy](./middleware/tooBusy.md) Reject incoming requests if server is too busy.
- [traceContext](./middleware/traceContext.md) .

# presets

Presets define commonly used collection of middlewares.

- [presets](./middleware/presets.md)

# request

Request utilities

- [accept](./request/accept.md) Parses the 'accept' request header.
- [getHeader](./request/getHeader.md) Returns the HTTP header from the request.
- [isHttpsProto](./request/isHttpsProto.md) Verify if request was made using TLS.
- [remoteAddress](./request/remoteAddress.md) Obtain the remote address of the connection.

# response

Response utilities

- [cookie](./response/cookie.md) Set and clear cookie functions on response.
- [redirect](./response/redirect.md) Send redirect dependent of content-type.
- [send](./response/send.md) Sends response.
- [json](./response/json.md) Sends JSON response.
- [setHeaders](./response/setHeaders.md) Set response headers from a headers object.
- [vary](./response/vary.md) Set vary response header.

# utilities

- [bytes](./utils/bytes.md) Convert string to byte value.
- [cookie](./utils/cookie.md) Cookie parse and serialize functions.
- [escapeHtml](./utils/escapeHtml.md) Escape HTML.
- [logger](./utils/logger.md) Logging.
- [ms](./utils/ms.md) Convert string to milliseconds (or seconds) value.
- [qs](./utils/qs.md) Parses a query string.
- [random64](./utils/random64.md) Generate a random string composed of chars
  `[0-9a-zA-Z_-]`
- [readiness](./utils/readiness.md) Run Readiness and Liveness probes.
- [setLogger](./utils/setLogger.md) Change default logger.

---

[🔝 TOP](#top)
