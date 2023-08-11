import http from 'node:http'
import { tooBusy, Router } from '../../src/index.js'
import { tooBusy as tooBusyCheck } from '../../src/utils/index.js'
import { makeLoad } from '../../test/support/makeLoad.js'

const start = ({ port }) => {
  tooBusyCheck.set({
    intervalMs: 50,
    maxLagMs: 16,
    smoothingFactor: 0.9
  })

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

  const server = http.createServer(router.handle).listen(Number(port))
  // console.log(server.address())

  ;['exit', 'SIGINT'].forEach(ev => process.on(ev, () => {
    tooBusyCheck.reset()
    server.close()
  }))

  function createLoad () {
    makeLoad(100)
    setTimeout(createLoad, 10)
  }
}

function argv (args) {
  const argv = args || process.argv.slice(2)
  const cmd = { port: 56789 }

  while (argv.length) {
    const arg = argv.shift()

    switch (arg) {
      case '--run-too-busy-server':
        cmd.run = true
        break
      case '--port':
        cmd.port = argv.shift()
        break
    }
  }
  return cmd
}

const cmd = argv()

if (cmd.run) {
  start(cmd)
}
