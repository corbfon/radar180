// library imports
import { Model, Document } from 'mongoose'

// project imports
import createModel from './create-model'
import { iTeam } from './team'
import { RawGameData } from './../services/nfl'

const schema = {
  gameId: Number,
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
  homeTeamId: String,
  isoTime: Date,
  networkChannel: String,
  ngsGame: Boolean,
  season: Number,
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
  visitorTeamId: String,
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

export const gameFromRawGame = (game: RawGameData) =>
  Game.findOneAndUpdate({ gameId: game.gameId }, game, { new: true, upsert: true }).exec()

export const retrieveByeWeeks = Game.find({ seasonType: 'REG' }).exec()

interface iGame {
  gameId: number
  homeTeam: iTeam
  visitorTeam: iTeam
}

export interface GameModel extends iGame, Document {}
