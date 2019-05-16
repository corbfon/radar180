// library imports
import { expect } from 'chai'
import { stub, assert, SinonStub } from 'sinon'

// project imports
import { withData, prepDataResponse } from './http'
import * as operators from './../utils/operators'

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
  describe('prepDataResponse', () => {
    const filterReturn = { val: Date.now() }
    let filterFieldsStub: SinonStub
    beforeEach(() => (filterFieldsStub = stub(operators, 'filterFields').returns(filterReturn)))
    afterEach(() => filterFieldsStub.restore())
    it('should assign data to pending response body', () => {
      const mockContext: any = { data: [{ teamId: Date.now() }], query: {}, res: { body: {} } }
      prepDataResponse()(mockContext)
      expect(mockContext.res.body.data).to.deep.equal(mockContext.data)
    })
    it('should filter each data item with filterFields', () => {
      const numCalls = 20
      const data = new Array(numCalls).map(() => ({ teamId: Date.now() }))
      const mockContext: any = { data, query: {}, res: { body: {} } }
      prepDataResponse()(mockContext)
      // expect(mockContext.res.body.data)
      mockContext.res.body.data.forEach(item => {
        expect(item).to.deep.equal(filterReturn)
      })
      expect(mockContext.res.body.data).to.be.lengthOf(numCalls)
    })
  })
})
