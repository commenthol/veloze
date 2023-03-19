# veloze

# project structure

```
src
├── FindRoute.js            // Radix Tree Router
├── HttpError.js            // Error 
├── Router.js               // Routing by method and path
├── Server.js               // HTTP2 server
├── connect.js              // connects middlewares
├── constants.js            
├── index.js
├── middleware              // # collection of middlewares
│   ├── bodyParser.js       // body-parser for json, urlencoded, raw payloads
│   ├── cacheControl.js     // cache-control header
│   ├── cookieParser.js     // cookie-parser
│   ├── cors.js             // CORS
│   ├── csp.js              // security related headers
│   ├── finalHandler.js     // final handling on errors
│   ├── index.js
│   ├── queryParser.js      // query-parser
│   ├── redirect2Https.js   // redirect from http to https
│   ├── renderEngine.js     // render helper for multiple template engines
│   ├── requestId.js        // request id 
│   ├── send.js             // adds res.send
│   └── tooBusy.js          // overload protection
├── request                 // # request helpers
│   ├── accept.js           // accept-* header parsing 
│   ├── getHeader.js        // convert multiple headers into array
│   ├── index.js
│   └── isHttpsProto.js     // checks if request is served from https
├── response                // # response helpers
│   ├── cookie.js           // set and clear cookie
│   ├── index.js
│   ├── redirect.js         // redirect helper
│   ├── send.js             // send request
│   ├── setHeaders.js       // set header helper
│   └── vary.js             // vary response headers
├── types.d.ts
└── utils                   // # utilities
    ├── assert.js           
    ├── bytes.js            // convert string to byte value
    ├── cookie.js           // cookie parser and serializer
    ├── escapeHtml.js       // sanitize html
    ├── headerParser.js     // header parser for accept and other headers
    ├── index.js
    ├── isProdEnv.js        
    ├── logger.js           
    ├── ms.js               // convert string to number in milliseconds or seconds
    ├── qs.js               // Query string parser
    ├── random64.js         // Random string generator
    ├── safeDecode.js       // safe decodeURIComponent
    ├── safeServerShutdown.js // gracefully shutdown server 
    └── tooBusy.js          // overload protection
```

