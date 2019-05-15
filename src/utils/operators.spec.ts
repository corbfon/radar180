// library imports
import { expect } from 'chai'

// project imports
import { sumObjectsByKey, divideObjectByConstant } from './operators'

describe('operators', () => {
  describe('sumObjectsByKey', () => {
    it('should return a single object with the sum of other objects', () => {
      const objs: any = [{ val1: 1 }, { val2: 2 }, { val1: 1, val2: 2 }]
      expect(sumObjectsByKey(...objs)).to.deep.equal({ val1: 2, val2: 4 })
    })
    it('should return an empty object if the array is length 0', () => {
      expect(sumObjectsByKey(<any>[])).to.deep.equal({})
    })
  })
  describe('avgObjectByConstant', () => {
    const obj = {
      val1: 20,
      val2: 50,
      val3: 200,
    }
    it('should divide every value by the constant', () => {
      expect(divideObjectByConstant(obj, 3)).to.deep.equal({
        val1: 7,
        val2: 17,
        val3: 67,
      })
    })
    it('should allow the specification of precision', () => {
      expect(divideObjectByConstant(obj, 3, 2)).to.deep.equal({
        val1: 6.67,
        val2: 16.67,
        val3: 66.67,
      })
    })
  })
})
