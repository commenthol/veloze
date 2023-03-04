import fs from 'node:fs'

const getPath = (path) => new URL(path, import.meta.url)

export const certs = (name = 'foo.bar') => ({
  key: fs.readFileSync(getPath(`./certs/${name}.key`)),
  cert: fs.readFileSync(getPath(`./certs/${name}.crt`))
})
