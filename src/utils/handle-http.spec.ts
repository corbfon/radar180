// library imports
import { expect } from 'chai'
import { stub, assert } from 'sinon'

// project imports
import * as helpers from './handle-http'
const { handleHttpRequest } = helpers

describe('handle-http', () => {
  const mockContext = {
    body: {},
    params: {},
    query: {},
    res: {
      statusCode: 200,
      body: {},
    },
  }
  const initContextStub = stub(helpers, 'initContext').returns(mockContext)
  afterEach(() => {
    initContextStub.resetHistory()
  })
  it('should initialize context with event data', async () => {
    await handleHttpRequest([])(<any>{}, <any>{}, () => {})
    assert.calledOnce(initContextStub)
  })
  it('should call each middleware in sequence', async () => {
    const middlewares = [stub(), stub().resolves(), stub().resolves()]
    await handleHttpRequest(middlewares)(<any>{}, <any>{}, () => {})
    middlewares.forEach(ware => assert.calledOnce(ware))
  })
  it('should send the response if middleware is successful', async () => {
    const res = await handleHttpRequest([])(<any>{}, <any>{}, () => {})
    expect(res).to.deep.equal({
      body: '{}',
      headers: {},
      statusCode: 200,
    })
  })
  it('should send an error if the middleware is not successful', async () => {
    const res = await handleHttpRequest([
      () => {
        throw new Error('this is an error')
      },
    ])(<any>{}, <any>{}, () => {})
    expect(res).to.deep.equal({
      body: '{"message":"this is an error"}',
      headers: {},
      statusCode: 500,
    })
  })
})
