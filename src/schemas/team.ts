// library imports
import { Validator } from './../utils/validator'

export const teamsQuery = Validator.object().keys({
  season: Validator.number().required(),
  team: Validator.string(),
  returnFields: Validator.stringArray(),
})
