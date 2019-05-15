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
    it('should connect with the correct parameters', async () => {
      await init()
      assert.calledWithExactly(connectStub, 'mongodb://localhost:27017/radar180', { useNewUrlParser: true })
    })
  })
})
