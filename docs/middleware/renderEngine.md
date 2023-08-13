[◀︎ middleware/queryParser](../middleware/queryParser.md)
[🛖](../index.md)
[middleware/requestId ▶](../middleware/requestId.md)

# renderEngine middleware

Use a template render engine.

# Usage

E.g. usage with consolidate

```js
import { Router, renderEngine } from "veloze";
import consolidate from "consolidate";

const viewsRoot = new URL("./views", import.meta.url);
const renderHandle = renderEngine({
  ext: "ejs",
  engine: consolidate.ejs,
  views: viewsRoot,
  locals: { app: "this app" }, // app locals
});

const app = new Router();
app.use(renderHandle);
app.get("/", (req, res) => {
  // request locals
  res.locals = { headline: "It work's" };
  // view locals rendered with view template "home"
  res.render("home", { title: "home" });
});
```

E.g. use with express-hbs

```js
import { Router, renderEngine } from "veloze";
import hbs from "express-hbs";

const viewsRoot = new URL("./views", import.meta.url);
const renderHandle = renderEngine({
  ext: ".hbs", // use extension with or without leading dot.
  engine: hbs.express4(),
  views: viewsRoot,
  locals: { app: "this app" }, // app locals
  pathCache: new Map(), // always use a Cache for filenames
});

const app = new Router();
app.use(renderHandle);
app.get("/", (req, res) => {
  // request locals
  res.locals = { headline: "It work's" };
  // view locals rendered with view template "home"
  res.render("home", { title: "home" });
});
```

[🔝 TOP](#top)
