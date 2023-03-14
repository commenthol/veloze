import assert from 'node:assert'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import supertest from 'supertest'

const nap = (ms = 50) => new Promise((resolve) => setTimeout(() => { resolve(ms) }, ms))

describe('middleware/tooBusy', function () {
  it('shall return true with load', async function () {
    const filename = fileURLToPath(new URL('./tooBusy.server.js', import.meta.url))
    const child = fork(filename, ['--run-too-busy-server'])
    child.on('error', (err) => {
      console.error(err)
    })
    await nap(100)

    const agent = supertest('http://localhost:56789')
    let cycle = 0
    while (cycle++ < 4) {
      const res = await agent.get('/')
      if (res.status === 429) {
        break
      }
    }
    child.kill('SIGTERM')
    assert.equal(cycle, 2)
  })
})
