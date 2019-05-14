// library imports
import { expect } from 'chai'
import { stub, assert, SinonStub } from 'sinon'
import * as mongoose from 'mongoose'

// project imports
import createModel from './create-model'

describe('create-model', () => {
  const schemaReturn = {
    prop: Date.now(),
  }
  let modelStub: SinonStub
  let schemaStub: SinonStub
  beforeEach(() => {
    modelStub = stub(mongoose, 'model')
    schemaStub = stub(mongoose, 'Schema').returns(schemaReturn)
  })
  afterEach(() => {
    modelStub.restore()
    schemaStub.restore()
  })
  it('should create a model with the given name', () => {
    createModel('amazingModel', {})
    assert.calledWith(modelStub, 'amazingModel')
  })
  it('should create a schema based on the given schema', () => {
    const mockSchema = {
      uniqueProp: Date.now(),
    }
    createModel('anotherAmazingOne', mockSchema)
    assert.calledOnce(schemaStub)
    expect(schemaStub.getCall(0).args[0]).to.deep.equal(mockSchema)
  })
  it('should call the decorator if it is passed', () => {
    const decorator = stub()
    createModel('thisIsAModel', {}, decorator)
    assert.calledWithExactly(decorator, schemaReturn)
  })
})
