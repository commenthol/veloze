import assert from 'node:assert/strict'
import { describe, it } from 'mocha'
import { TraceParent } from '#utils/traceParent.js'

describe('utils/traceParent', () => {
  it('should parse valid traceparent and update parentId', () => {
    const header = '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
    const result = TraceParent.parse(header)
    assert.equal(result.traceId, '4bf92f3577b34da6a3ce929d0e0e4736')
    assert.equal(result.sampled, false) // sampled is always false on new TraceParent
    assert.notEqual(result.parentId, '00f067aa0ba902b7') // new parentId
  })

  it('should reject traceId if only zeros', () => {
    const header = '00-00000000000000000000000000000000-00f067aa0ba902b7-01'
    const result = TraceParent.parse(header)
    assert.notEqual(result.traceId, '00000000000000000000000000000000') // new traceId
    assert.notEqual(result.parentId, '00f067aa0ba902b7') // new parentId
    assert.equal(result.sampled, false)
  })

  it('should reject parentId if only zeros', () => {
    const header = '00-4bf92f3577b34da6a3ce929d0e0e4736-0000000000000000-01'
    const result = TraceParent.parse(header)
    assert.notEqual(result.traceId, '4bf92f3577b34da6a3ce929d0e0e4736') // new traceId
    assert.notEqual(result.parentId, '0000000000000000') // new parentId
    assert.equal(result.sampled, false)
  })

  it('should return new traceparent on invalid header', () => {
    const header = 'invalid-header'
    const result = TraceParent.parse(header)
    assert.ok(result.traceId.length === 32)
    assert.ok(result.parentId.length === 16)
    assert.equal(result.sampled, false)
  })

  it('should return new traceparent on missing parts', () => {
    const header = '00-4bf92f3577b34da6a3ce929d0e0e4736-01'
    const result = TraceParent.parse(header)
    assert.notEqual(result.traceId, '4bf92f3577b34da6a3ce929d0e0e4736')
    assert.ok(result.parentId.length === 16)
    assert.equal(result.sampled, false)
  })

  it('should return new traceparent on invalid traceId', () => {
    const header = '00-xyz-00f067aa0ba902b7-01'
    const result = TraceParent.parse(header)
    assert.notEqual(result.traceId, 'xyz')
    assert.ok(result.parentId.length === 16)
    assert.equal(result.sampled, false)
  })

  it('should return new traceparent on invalid parentId', () => {
    const header = '00-4bf92f3577b34da6a3ce929d0e0e4736-xyz-01'
    const result = TraceParent.parse(header)
    assert.notEqual(result.traceId, '4bf92f3577b34da6a3ce929d0e0e4736')
    assert.ok(result.parentId.length === 16)
    assert.equal(result.sampled, false)
  })

  it('should update sampled flag', () => {
    const tp = new TraceParent({
      traceId: '4bf92f3577b34da6a3ce929d0e0e4736',
      parentId: '00f067aa0ba902b7',
      sampled: false
    })
    assert.equal(tp.sampled, false)
    tp.update(true)
    assert.equal(
      tp.toString(),
      '00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01'
    )
  })
})
