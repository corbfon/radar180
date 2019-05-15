// library imports
import { Model, Document } from 'mongoose'

// project imports
import createModel from './create-model'
import { iTeam } from './team'

const schema = {
  gameId: { type: Number, index: true },
  gameDate: Date,
  gameKey: Number,
  gameTimeEastern: String, // overlap with isoTime
  gameTimeLocal: String, // overlap with isoTime
  gameType: String,
  homeDisplayName: String,
  homeNickname: String,
  homeTeam: {
    season: Number,
    teamId: String,
    abbr: String,
    cityState: String,
    fullName: String,
    nick: String,
    teamType: String,
    conferenceAbbr: String,
    divisionAbbr: String,
  },
  homeTeamAbbr: String,
  homeTeamId: { type: String, index: true },
  isoTime: Date,
  networkChannel: String,
  ngsGame: Boolean,
  season: { type: Number, index: true },
  seasonType: String,
  site: {
    siteId: Number,
    siteCity: String,
    siteFullname: String,
    siteState: String,
    roofType: String,
  },
  visitorDisplayName: String,
  visitorNickname: String,
  visitorTeam: {
    season: Number,
    teamId: String,
    abbr: String,
    cityState: String,
    fullName: String,
    nick: String,
    teamType: String,
    conferenceAbbr: String,
    divisionAbbr: String,
  },
  visitorTeamAbbr: String,
  visitorTeamId: { type: String, index: true },
  week: Number,
  weekName: String,
  weekNameAbbr: String,
  score: {
    // time: '00:01', // not sure what this is
    phase: String,
    visitorTeamScore: {
      pointTotal: Number,
      pointQ1: Number,
      pointQ2: Number,
      pointQ3: Number,
      pointQ4: Number,
      pointOT: Number,
      timeoutsRemaining: Number,
    },
    homeTeamScore: {
      pointTotal: Number,
      pointQ1: Number,
      pointQ2: Number,
      pointQ3: Number,
      pointQ4: Number,
      pointOT: Number,
      timeoutsRemaining: Number,
    },
  },
  validated: Boolean,
  releasedToClubs: Boolean,
}

export const Game: Model<GameModel> = <Model<GameModel>>createModel('game', schema)

/**
 * Returns the scores, optionally by period, for the given team abbreviation. Note that it relies on the team abbreviation existing on the game.
 * @param game game data
 * @param teamAbbr abbreviation for team
 */
export const getScoreByTeam = (game: iGame, teamAbbr: string): iTeamScore | undefined => {
  if (!game.score) return
  /** @todo decide how to handle the 2013 season, which does not have scores */
  const teamScoreField = game.homeTeamAbbr === teamAbbr ? 'homeTeamScore' : 'visitorTeamScore'
  return game.score[teamScoreField]
}

interface iGame {
  gameId: number
  homeTeam: iTeam
  homeTeamAbbr: string
  visitorTeam: iTeam
  visitorTeamAbbr: string
  score?: {
    homeTeamScore: iTeamScore
    visitorTeamScore: iTeamScore
  }
}

interface iTeamScore {
  pointTotal?: number
  pointQ1?: number
  pointQ2?: number
  pointQ3?: number
  pointQ4?: number
  pointOT?: number
  timeoutsRemaining?: number
}

export interface GameModel extends iGame, Document {}
