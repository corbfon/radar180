// library imports
import * as joi from 'joi'

// project imports
import { iHttpRequestMiddleware } from './handle-http'
import { BadRequestError } from '../schemas/errors'

export const withQueryValidator = (schema: joi.Schema): iHttpRequestMiddleware => {
  return context => {
    try {
      const { error, value } = schema.validate(context.query)
      if (error) throw new BadRequestError(error.details[0].message, 400)
      context.query = value
    } catch (err) {
      throw err
    }
  }
}
