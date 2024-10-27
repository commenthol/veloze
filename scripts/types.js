#!/usr/bin/env node

import shelljs from 'shelljs'
const { rm, exec, find, cp, cd } = shelljs

const dir = new URL('..', import.meta.url).pathname

cd(dir)
rm('-rf', './types')
exec('tsc')

find('./src/**/*.d.ts').forEach((source) => {
  const dest = source.replace('./src/', './types/')
  cp(source, dest)
})
