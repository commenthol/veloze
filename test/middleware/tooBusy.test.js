import assert from 'node:assert'
import { fork } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import supertest from 'supertest'
import { describeBool } from '../support/describeBool.js'
import { nap } from '../support/index.js'

const randomPort = () => Math.floor(10000 + Math.random() * 50000)

describeBool(!process.env.CI)('middleware/tooBusy', function () {
  it('shall return true with load', async function () {
    const port = randomPort()

    const filename = fileURLToPath(
      new URL('./tooBusy.server.js', import.meta.url)
    )
    const child = fork(filename, ['--run-too-busy-server', '--port', port])
    child.on('error', (err) => {
      console.error(err)
    })
    await nap(200)

    const agent = supertest(`http://localhost:${port}`)
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
