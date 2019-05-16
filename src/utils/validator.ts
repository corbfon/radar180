// library imports
import * as Joi from 'joi'

// project imports
import { iHttpRequestMiddleware } from './handle-http'
import { BadRequestError } from '../schemas/errors'

export const withQueryValidator = (schema: Joi.Schema): iHttpRequestMiddleware => {
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

const stringArrayRegex = new RegExp(/^,+|,+$/gm)

const customJoi: Validator = Joi.extend(joi => ({
  base: joi.array(),
  name: 'stringArray',
  coerce: (value, state, options) => value && value.replace(stringArrayRegex, '').split(','),
}))

export { customJoi as Validator }

interface Validator extends Joi.Root {
  stringArray(): Joi.ArraySchema
}
