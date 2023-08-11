[◀︎ middleware/json](../middleware/json.md)
[🛖](../index.md)
[middleware/tooBusy ▶](../middleware/tooBusy.md)

# serve middleware

Serves static files

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

| type      | property                             | description                                                    |
| --------- | ------------------------------------ | -------------------------------------------------------------- |
| boolean   | \[etag=true]                         | Generates etag                                                 |
| boolean   | \[fallthrough=false]                 | Fallthrough on any error                                       |
| string\[] | \[index=\['index.html', 'index.htm]] | Send `index.html` file in response to a directory              |
| string    | \[strip]                             | Path to strip from request url                                 |
| object    | \[mimeTypes]                | Dictionary of MIME-types by file extension e.g. `{'.txt':'text/plain'}` |
| Function  | \[filter]                            | Filter function to control which response shall be compressed. |

### filter

    filter?: ((req: Request, res: Response) => boolean)

Filter function to control which response shall be compressed. If `true` then content may get compressed based on the accept-encoding request header. Otherwise no compression is applied. 
Control custom compressible MIME-types by using this filter function.

Defaults to compressing only "text/*" and "application/json" MIME-types.

```js
const filter = (req, res) => {
  const mimeType = res.getHeader('content-type')
  return /^text\/|^application\/json\b/.test(mimeType)
}
```


[🔝 TOP](#top)
