// library imports
import { APIGatewayProxyHandler } from 'aws-lambda'

// project imports
import { handleHttpRequest } from './../utils/handle-http'
import { Team } from '../model/team'
import { withData, prepDataResponse } from './../middleware/http'
import { withQueryValidator } from './../utils/validator'
import { teamsQuery } from './../schemas/team'

export const retrieve: APIGatewayProxyHandler = handleHttpRequest([
  withQueryValidator(teamsQuery),
  withData(Team.withGames()),
  prepDataResponse(),
])
