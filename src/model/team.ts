// library imports
import { Document, Model, Schema } from 'mongoose'

// project imports
import createModel from './create-model'
import { RawGameData } from '../services/nfl'
import { iHttpRequestMiddleware } from '../utils/handle-http'

const rawSchema = {
  teamId: String,
  abbr: String,
  cityState: String,
  fullName: String,
  nick: String,
  teamType: String,
  conferenceAbbr: String,
  divisionAbbr: String,
}

export const Team: TeamModel = <TeamModel>createModel('Team', rawSchema, (schema: Schema) => {
  schema.static('withGames', function() {
    return ({ season, team }: { season: number; team?: string }) => {
      let $match = team ? { abbr: team } : {}
      return this.aggregate([
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
          },
        },
        {
          $project: { homeGames: 0, awayGames: 0 },
        },
      ])
    }
  })
})

export const teamsFromRawGame = (game: RawGameData) => {
  return [
    Team.findOneAndUpdate({ teamId: game.homeTeam.teamId }, game.homeTeam, { new: true, upsert: true }).exec(),
    Team.findOneAndUpdate({ teamId: game.visitorTeam.teamId }, game.visitorTeam, { new: true, upsert: true }).exec(),
  ]
}

const allWeeks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]

export const addByeWeeks = (): iHttpRequestMiddleware => {
  return context => {
    for (let i = 0; i < context.data.length; i++) {
      const team = context.data[i]
      if (team.games && team.games.length > 0) {
        const weeksPlayed: number[] = team.games.map(game => game.week).sort((a, b) => (a >= b ? 1 : -1))
        for (let j = 0; j < allWeeks.length; j++) {
          if (allWeeks[j] !== weeksPlayed[j]) {
            team.byeWeek = allWeeks[j]
            break
          }
        }
      }
    }
  }
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
  withGames: () => (query: { season: number; team?: string }) => Promise<any>
}
