# veloze

A modern and fast express-like webserver for the web.

Allows you to:
- reuse connect (express) middlewares
- use secure defaults
- pick the pieces to build your server 

Comes with:
- [Pure ESM Package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
- Fast Radix Tree Router
- Follows standards (lower-case headers, ...)
- Async middlewares `async (req, res) => { ... }`

Project Goals:
- Provide a fast and modern web-server
- Modular and un-opinionated.
- ESM only (no require)
- Follows Connect/Express middleware pattern `(req, res, next) => { ... }`
- Keep things simple
- Pure Javascript with the support of TS-types.
- Secure Defaults

# license

MIT licensed

# roadmap

- http, https, http/2 server (which is stoppable)
- http-redirect to https
- csp middleware (like helmet)
- bodyparser for form, json, raw with content-type detection
