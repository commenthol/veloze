[◀︎ core/Server](../core/Server.md)
[🛖](../index.md)
[cacheControl ▶](../middleware/cacheControl.md)

# bodyParser middleware

Request body parsing middleware.

Parses body for POST, PUT, PATCH and SEARCH requests.

Support for raw, json or url-encoded request bodies.

The default parses to `req.body` according to the content-type header of the request.

For content-type `application/json` the body is JSON parsed and added as object to `req.body`.

Form requests with content-type `application/x-www-form-urlencoded` are form-parsed into an object.

Binary requests with content-type `application/octet-stream` are added as `Buffer` to `req.body`.

# Usage

```js
import { Router, bodyParser } from "veloze";

const app = new Router();
app.post(bodyParser(), (req, res) => {
  // contains the parsed body as Object or Buffer
  const { body } = req;
  res.end();
});
```

for JSON parsing only:

```js
// for `application/json`
app.post(bodyParser.json());

// parse JSON with a different content-type
app.post(bodyParser.json({ typeJson: "application/csp-report" }));
```

for Form parsing only:

```js
// for `application/x-www-form-urlencoded`
app.post(bodyParser.urlEncoded());
```

for raw parsing only:

```js
// for `application/octet-stream`
app.post(bodyParser.raw());

// for e.g. `text/plain`
app.post(bodyParser.raw({ typeRaw: "text/plain" }));
```

# Options

| type           | property                                               | description                                                                                            |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| string\|number | \[limit='100kB'\]                                      | body limit in bytes. If exceeded the request is terminated with a "413 Payload Too Large" Status Code. |
| string\[\]     | \[methods=\['POST', 'PUT', 'PATCH', 'SEARCH'\]\]       | allowed methods for bodyParsing                                                                        |
| string\|false  | \[typeJson='application/json'\]                        | parse json content                                                                                     |
| string\|false  | \[typeUrlEncoded='application/x-www-form-urlencoded'\] | parse urlEncoded content                                                                               |
| string\|false  | \[typeRaw='application/octet-stream'\]                 | parse raw content                                                                                      |

[🔝 TOP](#top)
