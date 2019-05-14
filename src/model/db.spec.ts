// library imports
import { expect } from 'chai'
import { stub, assert } from 'sinon'
import * as mongoose from 'mongoose'

// project imports
import { init } from './db'

describe('db', () => {
  describe('init', () => {
    const connectStub = stub(mongoose, 'connect')
    afterEach(() => connectStub.resetHistory())
    it('should call connect with a connection string', async () => {
      await init()
      assert.calledOnce(connectStub)
      expect(connectStub.getCall(0).args[0]).to.be.a('string')
    })
  })
})
