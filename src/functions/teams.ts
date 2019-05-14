// library imports
import { APIGatewayProxyHandler } from 'aws-lambda'

// project imports
import { handleHttpRequest } from './../utils/handle-http'
import { Team, addByeWeeks } from '../model/team'
import { withData, prepDataResponse } from './../middleware/http'
import { withQueryValidator } from './../utils/validator'
import { teamsQuery } from './../schemas/team'

// export const retrieve: APIGatewayProxyHandler = async (event, context) => {
//   const data = await Team.withGames({ season: 2018 })

//   return {
//     statusCode: 200,
//     body: JSON.stringify(data),
//   }
// }

export const retrieve: APIGatewayProxyHandler = handleHttpRequest([
  withQueryValidator(teamsQuery),
  withData(Team.withGames()),
  addByeWeeks(),
  prepDataResponse(),
])

// export const retrieveByes: APIGatewayProxyHandler = handleHttpRequest([
//   withData(Team.withGames),
//   addByeWeeks(),
//   prepDataResponse(),
// ])
