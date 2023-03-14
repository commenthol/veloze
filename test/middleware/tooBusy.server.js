import http from 'node:http'
import { tooBusy, Router } from '../../src/index.js'
import { tooBusy as tooBusyCheck } from '../../src/utils/index.js'
import { makeLoad } from '../../test/support/makeLoad.js'

const defaultValues = tooBusyCheck.get()

tooBusyCheck.set({
  intervalMs: 50,
  maxLagMs: 16,
  smoothingFactor: 0.9
})

const start = () => {
  let underLoad = false

  const end = (req, res) => {
    if (!underLoad) {
      underLoad = true
      createLoad()
    }
    res.end('<h1>works</h1>')
  }

  const router = new Router()
  router.all('/*',
    tooBusy(),
    end
  )

  const server = http.createServer(router.handle).listen(56789)
  console.log(server.address())

  process.on('SIGTERM', () => {
    tooBusyCheck.set(defaultValues)
    process.exit(1)
  })

  function createLoad () {
    makeLoad(100)
    setTimeout(createLoad, 10)
  }
}

if (process.argv.includes('--run-too-busy-server')) {
  start()
}
