[◀︎ utils/cookie](../utils/cookie.md)
[🛖](../index.md)
[utils/ms ▶](../utils/ms.md)

# utils/escapeHtml

Escape HTML.

# escapeHtml()

escape HTML and prevent double escaping of '&'

```js
import { utils } from 'veloze'
const { escapeHtml } = utils 

escapeHTML('<h1>"One" & \'Two\' &amp; Works</h1>')
// &lt;h1&gt;&quot;One&quot; &amp; &#39;Two&#39; &amp; Works&lt;/h1&gt;
```

# escapeHtmlLit

Escape all vars in a template literal

```js
import { utils } from 'veloze'
const { escapeHtmlLit } = utils 

const title = `"One" & 'Two' &amp; Works`
escapeHtmlLit`<h1>${title}</h1>`
// <h1>&quot;One&quot; &amp; &#39;Two&#39; &amp; Works</h1>;
```

[🔝 TOP](#top)
