// library imports
import { Model, Document } from 'mongoose'

// project imports
import createModel from './create-model'
import { iTeam } from './team'
import { RawGameData } from './../services/nfl'

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

interface iGame {
  gameId: number
  homeTeam: iTeam
  visitorTeam: iTeam
}

export interface GameModel extends iGame, Document {}
