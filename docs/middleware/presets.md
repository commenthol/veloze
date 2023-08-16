[◀︎ middleware/tooBusy](../core/tooBusy.md)
[🛖](../index.md)
[request/accept ▶](../request/accept.md)

# Presets

Presets define commonly used collection of middlewares.

# Usage

```js
import { 
  Router, 
  presetHtml, 
  presetJson,
  renderEngine,
  tooBusy,
} from 'veloze'

const app = new Router()
// protect all endpoints from too high load
app.preHook(tooBusy())

const htmlHandlers = [presetHtml, renderEngine({...})]
const jsonHandlers = [presetJson]

// html rendered pages
app.get('/', htmlHandlers, (req, res) => res.render(...))

// json api
app.post('/api/users', jsonHandlers, 
  async (req, res) => await db.create(sanitize(req.body)))
app.get('/api/users/:user', jsonHandlers, 
  async (req, res) => await db.find(req.params.user))
app.put('/api/users/:user', jsonHandlers, 
  async (req, res) => await db.update(req.params.user, sanitize(req.body)))
app.delete('/api/users/:user', jsonHandlers, 
  async (req, res) => await db.delete(req.params.user))

```

# presetHtml

Preset for endpoints rendering HTML pages

```js
export const presetHtml = (options) => {
  const {
    limit = '100kb',
    cspOpts,
    cacheControlOpts,
    requestIdOpts
  } = options || {}

  return [
    requestId(requestIdOpts),
    contentSec(cspOpts),
    cacheControlByMethod(cacheControlOpts),
    send,
    queryParser,
    cookieParser,
    bodyParser.urlEncoded({ limit })
  ]
}
```

# presetJson

Preset for REST JSON based endpoints.

```js
export const presetJson = (options) => {
  const {
    limit = '100kb',
    cspOpts,
    cacheControlOpts = { noStore: true },
    requestIdOpts
  } = options || {}

  return [
    requestId(requestIdOpts),
    contentSecJson(cspOpts),
    cacheControlByMethod(cacheControlOpts),
    send,
    queryParser,
    bodyParser.json({ limit })
  ]
}
```

---

[🔝 TOP](#top)
