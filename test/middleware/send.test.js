import supertest from 'supertest'
import { send, connect } from '../../src/index.js'

describe('middleware/send', function () {
  it('res.send', async function () {
    const handle = connect(send, (req, res) => {
      res.send('<h1>works</h1>')
    })

    await supertest(handle)
      .get('/')
      .expect(200, '<h1>works</h1>')
      .expect('content-length', '14')
      .expect('content-type', 'text/html; charset=utf-8')
  })
})
