[◀︎ middleware/cors](../middleware/cors.md)
[🛖](../index.md)
[middleware/implictHeader ▶](../middleware/implicitHeader.md)

# finalHandler middleware

Provides a error response according to a given error. 

Returns either a json or html response. Defaults to html. 

Logs the error together with the requests url and method.

# Usage

finalHandler is used by [Router](../core/Router.md) and can the overridden in the constructor.

You may want to do this to provide an own html template for error pages. 

```js
import { finalHandler as finalHandlerDef } from 'veloze'

const htmlTemplate = ({status, message}) => `
<h1>${status}</h1>
<h2>${message}</h2>
`

const finalHandler = finalHandlerDef({ htmlTemplate })
const app = new Router({ finalHandler })
```

---

[🔝 TOP](#top)
