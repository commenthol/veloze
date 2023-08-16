[◀︎ middleware/queryParser](../middleware/queryParser.md)
[🛖](../index.md)
[middleware/renderEngine ▶](../middleware/renderEngine.md)

# redirect2https middleware

Redirect from http to https.

## Usage

```js
import { Server, redirect2Https } from 'veloze'

// our redirect server listening on port 80
const httpServer = new Server({ onlyHTTP1: true })
httpServer.all('/*', redirect2Https({ 
  redirectUrl: 'https://foobar.local',
  status: 308
}))
httpServer.listen(80)

// our TLS secured server on port 443
const server = new Server({ 
  allowHTTP1: true, 
  key: new URL('./server.key', import.meta.url),
  cert: new URL('./server.crt', import.meta.url),
})
server.get('/', ...) // add routes
server.listen(443)
```

## Options

```ts
function redirect2Https(options: {
    redirectUrl: string;
    status?: number;
    allowedHosts?: string[];
}): HandlerCb;
```

### redirectUrl: string

Defines the base redirect URL of the https server.

### status?: number

Default is 308 Permanent Redirect. Choose either 301, 302, 307 or 308.

### allowedHosts?: string[]

List of allowed vhosts. All vhosts must be exposed on port 443.

---

[🔝 TOP](#top)
