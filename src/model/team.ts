// library imports
import { Document, Model, Schema } from 'mongoose'

// project imports
import createModel from './create-model'
import { getScoreByTeam } from './game'
import { sumObjectsByKey, divideObjectByConstant } from './../utils/operators'

const rawSchema = {
  teamId: { type: String, index: true },
  abbr: { type: String, index: true },
  cityState: String,
  fullName: String,
  nick: String,
  teamType: String,
  conferenceAbbr: String,
  divisionAbbr: String,
}

export const buildPipeline = ({ season, team }: any): any[] => {
  let $match = team ? { abbr: team } : {}
  return [
    { $match },
    {
      $lookup: {
        from: 'games',
        localField: 'teamId',
        foreignField: 'homeTeamId',
        as: 'homeGames',
      },
    },
    {
      $lookup: {
        from: 'games',
        localField: 'teamId',
        foreignField: 'visitorTeamId',
        as: 'awayGames',
      },
    },
    {
      $addFields: {
        games: {
          $filter: {
            input: { $concatArrays: ['$homeGames', '$awayGames'] },
            as: 'game',
            cond: {
              $and: [{ $eq: ['$$game.season', season] }, { $eq: ['$$game.seasonType', 'REG'] }],
            },
          },
        },
        season,
      },
    },
    {
      // get rid of fields intended only in aggregation
      $project: { homeGames: 0, awayGames: 0 },
    },
    {
      // filter out teams without games this season
      $match: {
        'games.0': { $exists: true },
      },
    },
  ]
}

export const Team: TeamModel = <TeamModel>createModel('Team', rawSchema, (schema: Schema) => {
  schema.static('withGames', function() {
    return async query => {
      const { returnFields } = query
      const data = await this.aggregate(buildPipeline(query))
      data.forEach(({ games }) => {
        games.sort(({ week: a }, { week: b }) => (a >= b ? 1 : -1))
      })
      if (!returnFields || returnFields.includes('byeWeek') || query.seasonScoresStart === 'byeWeek') {
        addByeWeeks(data)
      }
      if (
        !returnFields ||
        returnFields
          .reduce((acc, val) => {
            return (acc += val.split('.'))
          })
          .includes('seasonScoresAvg')
      ) {
        addGamesAvg(data, query.seasonScoresStart)
      }
      return data
    }
  })
})

const allWeeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

/**
 * adds the season's bye week as the parameter byeWeek
 * @param data teams with populated games
 */
export const addByeWeeks = (data): void => {
  for (let i = 0; i < data.length; i++) {
    const team = data[i]
    if (team.games && team.games.length > 0) {
      const weeksPlayed: number[] = team.games.map(game => game.week)
      for (let j = 0; j < allWeeks.length; j++) {
        if (allWeeks[j] !== weeksPlayed[j]) {
          team.byeWeek = allWeeks[j]
          break
        }
      }
    }
  }
}

/**
 * adds seasonScores and scoresAvg to the team, assumes 1 <= x <= 17 for startWeek range
 * @param data teams with populated games
 * @todo don't take the ot games into account where ot wasn't played
 */
export const addGamesAvg = (data: any[], startWeek: SeasonScoresStart = 0): void => {
  data.forEach(team => {
    if (startWeek === 'byeWeek') {
      startWeek = team.byeWeek
    }

    if (team.games && team.games.length > 0) {
      const games = startWeek ? team.games.slice(<number>startWeek - 1) : team.games
      team.seasonScores = sumObjectsByKey(...games.map(game => getScoreByTeam(game, team.abbr)))
      team.seasonScoresAvg = divideObjectByConstant(team.seasonScores, games.length, 1)
    }
  })
}

export interface iTeam {
  teamId: string
  abbr: string
  cityState: string
  fullName: string
  nick: string
  teamType: string
  conferenceAbbr: string
  divisionAbbr: string
}

interface TeamDocument extends Document, iTeam {}

interface TeamModel extends Model<TeamDocument> {
  withGames: () => (query: {
    season: number
    team?: string
    returnFields?: string[]
    seasonScoresStart?: SeasonScoresStart
  }) => Promise<any>
}

type SeasonScoresStart = number | 'byeWeek'
