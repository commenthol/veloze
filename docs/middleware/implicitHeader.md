[◀︎ middleware/finalhandler](../middleware/finalhandler.md)
[🛖](../index.md)
[middleware/queryParser ▶](../middleware/queryParser.md)

# implicitHeader middleware

Use in http/2 connections for compatibility with some express or connect
middlewares wherever the middleware throws with an undefined
`res._implicitHeader()` method.

Adds undocumented _implicitHeader() method to response

# Usage

```js
import { implicitHeader, Router } from 'veloze'

const app = new Router()
app.use(implicitHeader)
```

[---

🔝 TOP](#top)
