[◀︎ response/vary](../response/vary.md)
[🛖](../index.md)
[utils/cookie ▶](../utils/cookie.md)

# utils/bytes

Convert string to byte value

- b for bytes
- kb for kilobytes
- mb for megabytes
- gb for gigabytes
- tb for terabytes
- pb for petabytes

```js
import { utils } from 'veloze'

const { bytes } = utils

bytes(1024)    // = 1024
bytes('100kB') // = 102400
bytes('2.5MB') // = 2621440
```


[🔝 TOP](#top)
