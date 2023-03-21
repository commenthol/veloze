# send, sendEtag middleware

Adds `res.send()` and `res.redirect()` method to all requests.

Response:

- [`res.send()`](#res-send)
- [`res.redirect()`](#res-redirect)

# Usage

## send

```js
import { Router, send } from "veloze";

const app = new Router();
// apply middleware!
app.use(send);

app.get("/", (req, res) => {
  // sends text/html content
  res.send("<h1>works</h1>");
  // content-length: '14',
  // content-type: 'text/html; charset=utf-8',
});

app.get("/redirect", (req, res) => {
  res.redirect("/", 307);
});
```

```js
// content-type: 'application/json; charset=utf-8',
res.send({ headline: "works" });

// with different status-code
res.send({ oops: "not there" }, 404);

// with custom response header
res.send('{"line":1}\n{"line":2}\n', 200, {
  "content-type": "application/ld+json",
});
```

## sendEtag

Adds `res.send()` with [Etag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) generation.

For GET or HEAD requests if header 'if-none-match' is same as Etag, then the response status is set to 304 Not Modified.

SHA-1 is the default to generate the Etag value.

```js
import { Router, sendEtag } from "veloze";

const app = new Router();
// apply middleware!
app.use(sendEtag());

app.get("/", (req, res) => {
  res.send("<h1>works</h1>");
  // content-length: '14',
  // content-type: 'text/html; charset=utf-8',
  // etag: '"KbHPF47xLpMM9by5ECjxj4W2xpg="'
});
```

### Options

| type   | property          | description                            |
| ------ | ----------------- | -------------------------------------- |
| string | \[algorithm=sha1] | etag hash algorithm; defaults to SHA-1 |

<a id="res-send"></a>

# res.send(body, \[status], \[headers])

Send response body.

A body of type is sent with 'content-type':

- string : `text/html; charset=utf-8`
- Buffer : `application/octet-stream`
- object : `application/json; charset=utf-8`

### Options:

| type                   | property   | description                      |
| ---------------------- | ---------- | -------------------------------- |
| string\|Buffer\|object | body       | response body                    |
| number                 | \[status]  | response status; defaults to 200 |
| object                 | \[headers] | additional response headers      |

<a id="res-redirect"></a>

# res.redirect(location, \[status], \[headers])

Sends a redirect

### Options:

| type   | property   | description                                         |
| ------ | ---------- | --------------------------------------------------- |
| string | location   | location header content                             |
| number | \[status]  | response status; defaults to 307 Temporary Redirect |
| object | \[headers] | additional response headers                         |
