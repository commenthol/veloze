[◀︎ json](../middleware/json.md)
[🛖](../index.md)
[tooBusy ▶](../middleware/tooBusy.md)

# serve middleware

serves static files

# Usage

```js
import { Router, serve } from "veloze";

const app = new Router();
// serve static files under `./files/static`
// `GET /static/index.html` -> `./files/static/index.html`
app.get("/static/*", serve(new URL("./files", import.meta.url)));

// serve static files under `./files` with stripping `/js` from the request url
// `GET /js/index.js` -> `./files/index.js`
app.get("/js/*", serve(new URL("./files", import.meta.url), { strip: '/js' }));
```

## Options

| type      | property                             | description                                       |
| --------- | ------------------------------------ | ------------------------------------------------- |
| boolean   | \[etag=true]                         | generates etag                                    |
| boolean   | \[fallthrough=false]                 | fallthrough on any error                          |
| string\[] | \[index=\['index.html', 'index.htm]] | send `index.html` file in response to a directory |
| string    | \[strip]                             | path to strip from request url                    |

[🔝 TOP](#top)
