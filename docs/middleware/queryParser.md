# queryParser middleware

Middleware which parses the query string.

To prevent HTTP Parameter Pollution only the last parameter will be serialized into the query record.

# Usage

```js
import { Router, queryParser } from "veloze";

const app = new Router();
app.get(queryParser, (req, res) => {
  // contains the parsed query string as Object
  const { query } = req;
  res.end();
});
/*
  e.g. 
  /?query=string&test=1&test=2 
  => req.query = { query: 'string', test: '2' }
*/
```
