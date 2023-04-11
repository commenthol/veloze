[◀︎ index](../index.md)
[🛖](../index.md)
[Router ▶](../core/Router.md)

# connect 

Connect connects middleware handlers. 

Allows to create "nano-service" where routing is performed by the infrastructure.

A middleware handler may either be a express/ connect handler

```js
const syncHandler = (req, res, next) => {
  doSomethingSyncHere()
  next() // NEVER forget next(), 
         // unless the response is not terminated with res.end()
}
```

or an async handler

```js
const asyncHandler = async (req, res) => {
  await doSomethingAsyncHere()
  // there is no need for next()
}
```

For async handlers it **must** be an async function. A function returning "just" a `Promise` is **not** recognized.

`req` is of type `http.IncomingMessage`, where `res` is a `http.ServerResponse`. 

If calling `connect()` the **first handler** which has 4 arguments is recognized as "errorHandler". In case of an error this handler will be called. The errorHandler has to conform to:

```js
const errorHandler = (err, req, res, next) => {
  // example to handle error...
  console.log(err)
  res.statusCode(500)
  res.end()
}
```

`connect()` can be used either being an array of middlewares or middlewares as arguments.

```js
const handle = connect(syncHandler, asyncHandler, errorHandler)
// or
const handle = connect([syncHandler, asyncHandler], errorHandler)
```

# Usage

```js
import { connect } from 'veloze'

// connect the middleware functions 
const handle = connect(
  function parse (req, res, next) {
    req.query = qs(req.url)
    next()
  },
  async function callDb (req, res) {
    res.body = await database.findOne(req.query)
  },
  function sendResponse (req, res) {
    res.setHeader('content-type', 'application/json')
    res.end(JSON.stringify(res.body))
  },
  // will be called if e.g. the database connection throws
  function errorHandler (err, req, res, next) {
    console.log(err)
    res.statusCode(500)
    res.end('Oops')
  } 
)

// start a server
http.createServer(handle).listen(3000)
```

If using connect directly with a server (e.g. for nano-services) do not forget to add an errorHandler.

[🔝 TOP](#top)
