// library imports
import { Validator } from './../utils/validator'

export const teamsQuery = Validator.object().keys({
  season: Validator.number().required(),
  team: Validator.string(),
  returnFields: Validator.stringArray(),
  seasonScoresStart: Validator.alternatives().try(
    Validator.number()
      .greater(0)
      .less(16), // consideration for these might have to change if functionality was added for querying other season types
    Validator.string().valid('byeWeek'),
  ),
})
