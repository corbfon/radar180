// library imports
import { expect } from 'chai'
import { stub, assert } from 'sinon'

// project imports
import { withData } from './http'

describe('http middleware', () => {
  describe('withData', () => {
    it('should pass context.query to the provided query', async () => {
      const context: any = { query: { prop: Date.now() } }
      const mockQuery = stub().resolves()
      await withData(mockQuery)(context)
      assert.calledWithExactly(mockQuery, context.query)
    })
    it('should assign the query results to the context.data', async () => {
      const context: any = {}
      const sample = { prop: Date.now() }
      const mockQuery = stub().resolves(sample)
      await withData(mockQuery)(context)
      expect(context.data).to.deep.equal(sample)
    })
  })
})
