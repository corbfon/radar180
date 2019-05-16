// library imports
import { expect } from 'chai'
import { assert, stub, SinonStub } from 'sinon'

// project imports
import { withQueryValidator, Validator } from './validator'
import { BadRequestError } from '../schemas/errors'

describe('validator', () => {
  describe('withQueryValidator', () => {
    const value = { prop: Date.now() }
    const validateStub = stub().returns({ value })
    const mockSchema = { validate: validateStub }
    let mockContext: any
    beforeEach(() => {
      validateStub.resetHistory()
      mockContext = { query: {} }
    })
    it('should call validate on schema', () => {
      withQueryValidator(<any>mockSchema)(mockContext)
      assert.calledOnce(validateStub)
    })
    it('should set context.query to the result of validation', () => {
      withQueryValidator(<any>mockSchema)(mockContext)
      expect(mockContext.query).to.be.equal(value)
    })
    it('should throw validation errors', () => {
      const message = 'a mock error message'
      validateStub.resetBehavior()
      validateStub.returns({ error: { details: [{ message }] } })
      try {
        withQueryValidator(<any>mockSchema)(mockContext)
      } catch (err) {
        expect(err.message).to.be.equal(message)
        return // this is expected
      }
      throw new Error('expected validator to throw an error')
    })
  })
  describe('Validator', () => {
    it('should allow stringArray casting', () => {
      const schema = Validator.object().keys({
        returnFields: Validator.stringArray(),
      })
      const { error, value } = schema.validate({ returnFields: 'one,two,three' })
      if (error) throw error
      expect(value).to.deep.equal({ returnFields: ['one', 'two', 'three'] })
    })
  })
})
