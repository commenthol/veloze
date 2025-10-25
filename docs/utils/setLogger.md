[◀︎ utils/readiness](../utils/readiness.md)
[🛖](../index.md)
[index ▶](../index.md)

# utils/setLogger

Logging uses the package [debug-level](https://www.npmjs.com/package/debug-level) by default. 

You may want to use a different logger:

```js
import { utils, Router } from 'veloze'
const { setLogger } = utils

const noLog = () => null

// a simple custom logger with `console`
const myLogger = (namespace) => {
  const log = (level) => (...args) => 
    console.log(level.toUpperCase(), namespace, ...args)
  // return a log object with all levels supported by debug-level
  return {
    trace: noLog, 
    debug: noLog, // don't log at this level...
    info: log('info'),
    warn: log('warn'),
    error: log('error'),
    fatal: log('fatal'),
    log: log('log')
  }
}

// before calling any Router or middleware set your logger function
setLogger(myLogger)

const app = Router()
// ...
```

---

[🔝 TOP](#top)
