[◀︎ core/connect](../core/connect.md)
[🛖](../index.md)
[core/Server ▶](../core/Server.md)

# Router

`Router` is the core of veloze. It uses [`FindRoute`](../../src/FindRoute.js) a
fast radix tree router.

It implements a

- Case-sensitive router according to [RFC3986](https://www.rfc-editor.org/rfc/rfc3986).
- Duplicate slashes are NOT ignored.
- No regular expressions.
- Tailing slash resolves to different route. E.g. `/path !== /path/`
- supports wildcard routes `/path/*`.
- parameters `/users/:user`, e.g. `/users/andi` resolves to `params = { user: 'andi' }`

The following routing syntax can be used:

- static (`/foo`, `/foo/bar`)
- parameter (`/:title`, `/books/:title`, `/genres/:genre/books/:title`)
- wildcards (`/*`, `/books/*`, `/genres/:genre/books/*`)

**Table of Contents**

<!-- !toc -->

- [Router](#router)
- [Usage](#usage)
  - [Mounting Routers](#mounting-routers)
- [API](#api)
  - [new Router(routerOptions)](#new-routerrouteroptions)
  - [method(methods, paths, ...handlers)](#methodmethods-paths-handlers)
  - [all(paths, ...handlers)](#allpaths-handlers)
  - [acl|...|get|post|put|delete|...|trace(paths, ...handlers)](#aclgetpostputdeletetracepaths-handlers)
  - [use(path, ...handlers)](#usepath-handlers)
  - [handle(req, res, next)](#handlereq-res-next)
  - [preHook|postHook(...handlers)](#prehookposthookhandlers)

<!-- toc! -->

# Usage

```js
import { Router } from 'veloze'

// creates a new router instance
const app = new Router()

// preHook(s) applied to all routes
app.preHook = (req, res, next) => {
  const { method, url } = req
  res.body = [method, url]
  next()
}
// postHook is applied to all routes
app.postHook = (req, res) => res.end(JSON.stringify(res.body))

app.get('/get-it', async (req, res) => res.body.push('#1'))
/// ['GET', '/get-it', '#1']
app.post('/post-it', async (req, res) => res.body.push('#2'))
/// ['POST', '/post-it', '#2']

// all other request are handled here
app.all('/*', (req, res) => res.end())

// apply handle to serve requests
http.createServer(app.handle).listen(3000)
```

## Mounting Routers

Routers can be mounted on each others, allowing for creation of larger
applications using `.use(path, router)`.

**NOTE:** A router **must** be mounted on a path which is not yet used by the
app. Mounting different routers on the same path result in the last router to
win.

```js
import { Router } from 'veloze'

const router = new Router()
router.get('/', (req, res) => {
  res.end('route')
})

const app = new Router()
app.get('/', (req, res) => res.end('home'))
// mount the router on path `/route`
// DON'T USE THE `router.handle` here
app.use('/route', router)

// apply app.handle to serve requests
http.createServer(app.handle).listen(3000)

// GET /route -> 'route'
// GET /      -> 'home'
```

# API

## new Router(routerOptions)

**RouterOptions**

| type         | property        | description                    |
| ------------ | --------------- | ------------------------------ |
| Connect      | \[connect]      | connect compatible alternative |
| FinalHandler | \[finalHandler] | different final handler        |
| FindRoute    | \[findRoute]    | different router               |

## method(methods, paths, ...handlers)

```js
// router to `handler` for method `PURGE` on path '/notify'
router.method('PURGE', '/notify', handler)
// router to connected handlers for multiple methods and paths
router.method(['GET', 'DELETE'], ['/', '/foo'], handler1, [handler2, handler3])
```

## all(paths, ...handlers)

```js
// routes all methods for path /all to handler
router.all('/all', handler)
```

## acl|...|get|post|put|delete|...|trace(paths, ...handlers)

shortcut methods for all a HTTP methods.

```js
// router to `handler` for method `GET` on path '/get'
router.get('/get', handler)
// router to connected handlers for POST method and paths
router.post(['/', '/foo'], handler1, [handler2, handler3])
```

## use(path, ...handlers)

For path being a handler function all handlers are applied as preHook.

```js
const handler1 = (req, res, next) => {
  doesSomethingHere(req)
  next()
}
const handler2 = (req, res, next) => {
  doesSomethingHere(req)
  next()
}

router.use(handler1, handler2)
// is the same as calling
router.preHook(handler1, handler2)
```

With a path this mounts all handlers for all methods on that path.
Most commonly used to mount routers on routers.

```js
const handler = (req, res) => {
  res.end('hi')
}

const sub = new Router()
sub.get('/', handler)

const router = new Router()
router.use('/mount', sub)
```

## handle(req, res, next)

Serves a request with a response.
Use for creating a server or mount routers on other routers.

```js
const app = new Router()
app.get('/', handler)

http.createServer(app.handle).listen(3000)
```

## preHook|postHook(...handlers)

Apply preHook handlers on all routes.
Define first before setting any routes.

```js
const handler = (name) => async (req, res) => {
  res.body = name
}
const endHandler = (req, res) => res.send()

const app = new Router()
// define hooks first
app.preHook(bodyParser(), sendEtag())
app.postHook(endHandler)
// then apply routes
app.post('/', handler('home'))
```

For route `POST /` the following handlers are connected in the above setup:

    bodyParser -> sendEtag -> handler -> endHandler

---

[🔝 TOP](#top)
