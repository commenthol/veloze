[◀︎ utils/random64](../utils/random64.md)
[🛖](../index.md)
[utils/setLogger ▶](../utils/setLogger.md)

# utils/readiness

Run Readiness and Liveness probes

**Example usage**

```js
import { Router, json, utils } from 'veloze'

export const createRouter = (context) => {
  // pass on instances which needs checking
  // e.g. a database or remote api. 
  // Imagine that both come with a async ping function like
  // `async ping() { return true /* (all ok), false or throw error */ }`
  const { db, api } = context
  
  const readiness = new utils.Readiness({ 
    intervalMs: 5000, // check interval
    abortTimeoutMs: 5000 // prematurely abort long or stalled checks
  })
  // register the database and api probe, these start immediately
  readiness.register('db', db.ping)
  readiness.register('api', api.ping)
  // don't serve traffic if app is above 48MB memory threshold
  readiness.register('mem', async () => process.memoryUsage.rss() < 48 * 1024 * 1024)

  // create a router for the endpoints
  const router = new Router()

  // If one probe fails 500 Internal Server Error is returned.
  // All ok returns 200 OK
  // `results` are of type `{[name]: {result: boolean, checkAt: Date}}`
  router.get('/readiness', json, (_req, res) => {
    const { statusCode, results } = readiness.getResults()
    res.json(results, statusCode)
  })

  // can also be used for a liveness probe, e.g. if db is vital part of the 
  // application
  const liveness = new utils.Readiness({ name: 'liveness' })
  // you may want to start with a initial successful probe here
  liveness.register('db', db.ping, true) 
  // and let the server restart, if memory exceeds 64MB
  liveness.register('mem', async () => process.memoryUsage.rss() < 64 * 1024 * 1024)

  router.get('/liveness', json, (req, res) => {
    const { statusCode, results } = liveness.getResults()
    res.json(results, statusCode)
  })

  return router
}
```


---

[🔝 TOP](#top)
