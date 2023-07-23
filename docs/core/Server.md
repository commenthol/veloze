[◀︎ Router](../core/Router.md)
[🛖](../index.md)
[HttpError ▶](../core/HttpError.md)

# Server

The server provides by default a HTTP/2 server. Optionally a HTTP/1 only mode is
possible.

The server extends from [Router][], so all of its methods can be used.

For working in a browser a certificate must be provided.

In development environments create a self-signed cert with this small script:

```sh
#!/usr/bin/env sh
DOMAIN=foo.bar
openssl req -x509 \
	-newkey rsa:2048 \
	-nodes -sha256 \
	-subj "/CN=$DOMAIN" \
	-keyout server.key \
	-out server.crt
```

# Usage

```js
import { Server, send } from "veloze";

// create a new HTTP2 Server instance (needs a certificate)
const server = new Server({
  key: "./server.key",
  cert: "./server.crt",
});

server.get("/", send, (req, res) => res.send("<h1>Hi, this is veloze</h1>"));
// start server on port 443
server.listen(443);
```

# API

## new Server(serverOptions)

**serverOptions**

| type                | property                | description                                                                    |
| ------------------- | ----------------------- | ------------------------------------------------------------------------------ |
| object              | serverOptions           |                                                                                |
| URL\|string\|Buffer | \[key]                  | Private key in PEM format. If URL then file is loaded from that file location. |
| URL\|string\|Buffer | \[cert]                 | Cert chains in PEM format. One cert chain should be provided per private key.  |
| URL\|string\|Buffer | \[pfx]                  | PFX or PKCS12 encoded private key and certificate chain.                       |
| URL\|string\|Buffer | \[password]             | Shared passphrase used for a single private key and/or a PFX                   |
| boolean             | \[onlyHTTP1=false]      | if `true` starts server in HTTP/1 mode                                         |
| number              | \[gracefulTimeout=1000] | graceful server shutdown in milliseconds                                       |
| Connect             | \[connect]              | connect compatible alternative                                                 |
| FinalHandler        | \[finalHandler]         | different final handler                                                        |
| FindRoute           | \[findRoute]            | different router                                                               |

## listen(port, hostname, ...)

Starts the server at `port`.  
`hostname` defaults to "0.0.0.0" which listens on on all interfaces.

| type   | property    | description |
| ------ | ----------- | ----------- |
| number | port        |             |
| string | \[hostname] |             |

## address() 

Returns the address of the server.

[router]: ./Router.md

[🔝 TOP](#top)
