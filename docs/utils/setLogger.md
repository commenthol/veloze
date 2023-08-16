[◀︎ utils/random64](../utils/random64.md)
[🛖](../index.md)
[index ▶](../index.md)

# utils/setLogger

Logging uses the package [debug-level](https://www.npmjs.com/package/debug-level) by default. 

You may want to use a different logger:

```js
import { utils, Router } from 'veloze'
const { setLogger } = utils

// a simple custom logger with `console`
const myLogger = (namespace) => {
  const log = (level) => (...args) => 
    console.log(level.toUpperCase(), namespace, ...args)
  return {
    debug: () => null,
    info: log('info'),
    warn: log('warn'),
    error: log('error')
  }
}

// before calling any Router or middleware set your logger function
setLogger(myLogger)

const app = Router()
// ...
```

---

[🔝 TOP](#top)
