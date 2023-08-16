[◀︎ middleware/send](../middleware/send.md)
[🛖](../index.md)
[middleware/serve ▶](../middleware/serve.md)

# json, jsonEtag middleware

Adds `res.json()` method to all requests.

Response:

- [`res.json()`](#res-json)

# Usage

## json

```js
import { Router, json } from "veloze";

const app = new Router();
// apply middleware!
app.use(json);

app.get("/", (req, res) => {
  // sends application/json content
  res.json({ works: true });
});
```

```js
// with different status-code
res.json({ oops: "not there" }, 404);

// with custom response header
res.json({ foo: "bar" }, 200, {
  "content-type": "application/aif+json",
});
```

## jsonEtag

Adds `res.json()` with [Etag](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) generation.

It can be used to tackle the problems of lost updates or stalled deletes.

For this `PUT` or `DELETE` requests must implement a check where the request
header 'if-match' is compared with the Etag generated from the most recent
resource.

For GET or HEAD requests if header 'if-none-match' is same as Etag, then the
response status is set to 304 Not Modified.

SHA-1 is the default to generate the Etag value.

```js
import { Router, HttpError, bodyParser, jsonEtag, etagHash } from "veloze";

const app = new Router();
// apply middleware!
app.use(jsonEtag());

app.get("/", (req, res) => {
  res.json({ id: "foobar" });
});

app.put("/:id", bodyParser.json(), async (req, res) => {
  const { id } = req.params;

  // fetch current resource and generate Etag for this resource
  const currResource = await db.find(id);
  const currEtag = etagHash(JSON.stringify(currResource));

  // now compare with the Etag provided in the request
  if (req.headers["if-match"] !== currEtag) {
    // return 412 "Precondition Failed" if match failed
    throw new HttpError(412);
  }

  // store in db
  const resource = await db.update(id, req.body);
  // send back with generating a fresh eTag
  res.json(resource);
});
```

### Options

| type   | property          | description                            |
| ------ | ----------------- | -------------------------------------- |
| string | \[algorithm=sha1] | etag hash algorithm; defaults to SHA-1 |

<a id="res-json"></a>

# res.json(body, \[status], \[headers])

Send response body as JSON.

### Options:

| type           | property   | description                      |
| -------------- | ---------- | -------------------------------- |
| string\|object | body       | response body                    |
| number         | \[status]  | response status; defaults to 200 |
| object         | \[headers] | additional response headers      |

---

[🔝 TOP](#top)
