// library imports
import * as joi from 'joi'

export const teamsQuery = joi.object().keys({
  season: joi.number().required(),
  team: joi.string(),
})
