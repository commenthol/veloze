[![npm-badge][npm-badge]][npm]
[![actions-badge][actions-badge]][actions]
![types-badge][types-badge]

# veloze

A modern and fast express-like webserver for the web.

Allows you to:
- reuse connect (express) middlewares
- use secure defaults
- pick the pieces to build your server 

Comes with:
- a [Pure ESM Package](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
- Stoppable HTTP2 server
- Fast Radix Tree Router
- Follows standards (lower-case headers, ...)
- Async middlewares `async (req, res) => { ... }`
- Query-parser middleware to prevent HTTP parameter pollution
- Body-parser for form, json, raw content
- content-security-policy and reporting middleware
- HTTP to HTTPS redirect middleware
- cache-control middleware
- CORS middleware
- Cookie-parser and response helpers to set and clear cookies
- Too Busy middleware to prevent server from overload
- Support for server-side rendering engines
- Safe final handler to prevent info leakage from internal error exposure in responses
- res.send() with or without Etag generation

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

- documentation
- static file serving...
- benchmarks
- examples

[npm-badge]: https://badge.fury.io/js/veloze.svg
[npm]: https://www.npmjs.com/package/veloze
[types-badge]: https://badgen.net/npm/types/veloze
[actions-badge]: https://github.com/commenthol/veloze/workflows/CI/badge.svg?branch=main&event=push
[actions]: https://github.com/commenthol/veloze/actions/workflows/ci.yml?query=branch%3Amain
