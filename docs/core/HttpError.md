[◀︎ Server](../core/Server.md)
[🛖](../index.md)
[middleware/bodyParser ▶](../middleware/bodyParser.md)

# HttpError

The `HttpError` extends the Error object by passing HTTP status-code and
optionally the original error "cause" plus additional "info" on the error 
condition or even "code". 

The idea is to always throw an error (or pass with `next(err)` for callback
handlers) and let the finalHandler take care of the response.

"veloze"'s connect logic immediately calls the final-error-handler on any error
passed or thrown, such ensuring a fast response.

# Usage

```js
import { Server, HttpError, bodyParser } from "veloze";

// creates a new router instance
const app = new Server();

app.post("/records",
  // --- a sample session middleware...
  session(), 
  // --- auth check middleware...
  async (req, res) => { 
    if (!req.session) {
      // the `finalhandler()` will take care on the response
      throw new HttpError(401, 'Sign-in first') // ⬅︎⬅︎⬅︎
    }
  },
  bodyParser.json(), // parsing the request body
  // --- validation checks
  (req, res, next) => {
    const { body } = req
    const info = {}
    // do some schema checks
    if (typeof body.label !== 'string') {
      info.label = 'Provide a label. Must be of type string'
    }
    if (Object.keys(info).length) {
      // add "info" in HttpError for passing this back to the user. 
      next(new HttpError(400, 'Validation Errors', { info })) // ⬅︎⬅︎⬅︎
      return
    }
    next()
  }
  // --- db storage
  async (req, res) => {
    try {
      const data = await db.storeIt(req.body) // sample db interaction
      res.send(data)
    } catch (e) {
      // pass along the error as `cause`, which will be logged. 
      // To prevent info-leakage from such error only status-code and message 
      // are sent to user.
      throw new HttpError(500, 'Storing record failed', { cause: e }) // ⬅︎⬅︎⬅︎
    }
  }
)
```

# API

## new HttpError(status, message, cause)

## new HttpError(status, message, {cause, info, code})

The properties `code` and `info` follow the conventions from 
[node:SystemError](https://nodejs.org/docs/latest/api/errors.html#class-systemerror).

| type   | property      | description                                             |
| ------ | ------------- | ------------------------------------------------------- |
| number | \[number=500] | the HTTP status-code for this error; defaults to 500    |
| string | \[message]    | error message; if empty defaults to HTTP status message |
| Error  | \[cause]      | specific original cause of the error                    |
| object | \[info]       | an object with details about the error condition        |
| string | \[code]       | string representing the error code                      |

[🔝 TOP](#top)
