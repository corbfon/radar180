// library imports
import * as chai from 'chai'
import * as sorted from 'chai-sorted'
chai.use(sorted)
import { expect } from 'chai'
import { assert, stub, SinonStub } from 'sinon'

// project imports
import { Team, addByeWeeks, addGamesAvg, buildPipeline } from './team'
import * as helpers from './team'
import * as game from './game'

describe('Team model', () => {
  describe('addByeWeeks', () => {
    it('should add bye weeks to teams with sorted games', () => {
      const data: any = [
        {
          games: [{ week: 1 }, { week: 2 }, { week: 4 }],
        },
        {
          games: [{ week: 1 }, { week: 2 }, { week: 3 }, { week: 4 }, { week: 5 }],
        },
      ]
      addByeWeeks(data)
      expect(data[0].byeWeek).to.be.equal(3)
      expect(data[1].byeWeek).to.be.equal(6)
    })
    it('should add bye weeks to teams with unsorted games', () => {
      const data: any = [
        {
          games: [{ week: 4 }, { week: 2 }, { week: 1 }],
        },
        {
          games: [{ week: 3 }, { week: 2 }, { week: 5 }, { week: 1 }, { week: 4 }],
        },
      ]
      addByeWeeks(data)
      expect(data[0].byeWeek).to.be.equal(3)
      expect(data[1].byeWeek).to.be.equal(6)
    })
    it('should not add a bye week if there are no games', () => {
      const data: any = [{}, {}]
      addByeWeeks(data)
      data.forEach(team => {
        expect(team.byeWeek).to.be.undefined
      })
    })
  })
  describe('addGamesAvg', () => {
    let scoresByTeamStub: SinonStub
    let data: any
    beforeEach(() => {
      scoresByTeamStub = stub(game, 'getScoreByTeam').returns({
        pointTotal: 354,
        pointQ1: 60,
        pointQ2: 128,
        pointQ3: 46,
        pointQ4: 120,
        pointOT: 0,
        timeoutsRemaining: 20,
      })
      data = [
        {
          abbr: 'DAL',
          games: [{}, {}],
        },
      ]
    })
    afterEach(() => {
      scoresByTeamStub.restore()
    })
    it('should add seasonScores and seasonScoresAvg to the team', () => {
      addGamesAvg(data)
      expect(data).to.deep.equal([
        {
          abbr: 'DAL',
          games: [{}, {}],
          seasonScores: {
            pointOT: 0,
            pointQ1: 120,
            pointQ2: 256,
            pointQ3: 92,
            pointQ4: 240,
            pointTotal: 708,
            timeoutsRemaining: 40,
          },
          seasonScoresAvg: {
            pointOT: 0,
            pointQ1: 60,
            pointQ2: 128,
            pointQ3: 46,
            pointQ4: 120,
            pointTotal: 354,
            timeoutsRemaining: 20,
          },
        },
      ])
    })
    it('should add seasonScores and seasonScoresAvg for all weeks after the given start week', () => {
      addGamesAvg(data, 1)
      expect(data).to.deep.equal([
        {
          abbr: 'DAL',
          games: [{}, {}],
          seasonScores: {
            pointOT: 0,
            pointQ1: 60,
            pointQ2: 128,
            pointQ3: 46,
            pointQ4: 120,
            pointTotal: 354,
            timeoutsRemaining: 20,
          },
          seasonScoresAvg: {
            pointOT: 0,
            pointQ1: 60,
            pointQ2: 128,
            pointQ3: 46,
            pointQ4: 120,
            pointTotal: 354,
            timeoutsRemaining: 20,
          },
        },
      ])
    })
    it('should accept an empty array', () => {
      const data = []
      addGamesAvg(data)
      expect(data).to.deep.equal([])
    })
  })
  describe('model', () => {
    it('should create a valid team with all fields', async () => {
      const fields = {
        teamId: '2700',
        abbr: 'MIA',
        cityState: 'Miami',
        fullName: 'Miami Dolphins',
        nick: 'Dolphins',
        teamType: 'TEAM',
        conferenceAbbr: 'AFC',
        divisionAbbr: 'ACE',
      }
      const team = new Team(fields)
      await team.validate()
      for (let field in fields) {
        expect(team[field]).to.be.equal(fields[field])
      }
    })
    it('should create a valid team with only required fields', async () => {
      const team = new Team({})
      await team.validate()
    })
  })
  describe('withGames', () => {
    let aggregateStub: SinonStub
    let buildPipelineStub: SinonStub
    let addByeWeeksStub: SinonStub
    let addGamesAvgStub: SinonStub
    const pipelineReturn = { mockQuery: Date.now() }
    const aggregateReturn = [{ teamId: '12345' }]
    beforeEach(() => {
      aggregateStub = stub(Team, 'aggregate').resolves(aggregateReturn)
      buildPipelineStub = stub(helpers, 'buildPipeline')
      addByeWeeksStub = stub(helpers, 'addByeWeeks')
      addGamesAvgStub = stub(helpers, 'addGamesAvg')
    })
    afterEach(() => {
      aggregateStub.restore()
      buildPipelineStub.restore()
      addByeWeeksStub.restore()
      addGamesAvgStub.restore()
    })
    it('should call buildPipeline with the query', async () => {
      await Team.withGames()({ season: 2019 })
      assert.calledWithExactly(buildPipelineStub, { season: 2019 })
    })
    it('should add bye weeks if no returnFields are specified', async () => {
      await Team.withGames()({ season: 2019 })
      assert.calledOnce(addByeWeeksStub)
    })
    it('should add bye weeks if specified by returnFields', async () => {
      await Team.withGames()({ season: 2019, returnFields: ['byeWeek'] })
      assert.calledOnce(addByeWeeksStub)
    })
    it('should not add bye weeks if byeWeeks is not included in returnFields', async () => {
      await Team.withGames()({ season: 2019, returnFields: ['games'] })
      assert.notCalled(addByeWeeksStub)
    })
    it('should add games averages if no returnFields are specified', async () => {
      await Team.withGames()({ season: 2019 })
      assert.calledOnce(addGamesAvgStub)
    })
    it('should add games averages if specified in returnFields', async () => {
      await Team.withGames()({ season: 2019, returnFields: ['seasonScoresAvg'] })
      assert.calledOnce(addGamesAvgStub)
    })
    it('should not add games averages if seasonScoresAvg is not included in returnFields', async () => {
      await Team.withGames()({ season: 2019, returnFields: ['games'] })
      assert.notCalled(addGamesAvgStub)
    })
    it('should indicate the start week for scores if a number is passed', async () => {
      await Team.withGames()({ season: 2019, returnFields: ['seasonScoresAvg'], seasonScoresStart: 15 })
      assert.calledWithExactly(addGamesAvgStub, aggregateReturn, 15)
    })
    it('should indicate the start week for scores if byeWeek is passed', async () => {
      await Team.withGames()({ season: 2019, returnFields: ['seasonScoresAvg'], seasonScoresStart: 'byeWeek' })
      assert.calledOnce(addByeWeeksStub)
      assert.calledWithExactly(addGamesAvgStub, aggregateReturn, 'byeWeek')
    })
  })
  describe('buildPipeline', () => {
    it('should build a pipeline for a single team', () => {
      expect(buildPipeline({ season: 2000, team: 'CAR' })).to.deep.equal([
        {
          $match: {
            abbr: 'CAR',
          },
        },
        {
          $lookup: { as: 'homeGames', foreignField: 'homeTeamId', from: 'games', localField: 'teamId' },
        },
        {
          $lookup: {
            as: 'awayGames',
            foreignField: 'visitorTeamId',
            from: 'games',
            localField: 'teamId',
          },
        },
        {
          $addFields: {
            games: {
              $filter: {
                as: 'game',
                cond: {
                  $and: [{ $eq: ['$$game.season', 2000] }, { $eq: ['$$game.seasonType', 'REG'] }],
                },
                input: { $concatArrays: ['$homeGames', '$awayGames'] },
              },
            },
            season: 2000,
          },
        },
        { $project: { awayGames: 0, homeGames: 0 } },
        { $match: { 'games.0': { $exists: true } } },
      ])
    })
    it('should build a pipeline to query all teams for a season', () => {
      expect(buildPipeline({ season: 2016 })).to.deep.equal([
        { $match: {} },
        {
          $lookup: { as: 'homeGames', foreignField: 'homeTeamId', from: 'games', localField: 'teamId' },
        },
        {
          $lookup: {
            as: 'awayGames',
            foreignField: 'visitorTeamId',
            from: 'games',
            localField: 'teamId',
          },
        },
        {
          $addFields: {
            games: {
              $filter: {
                as: 'game',
                cond: {
                  $and: [{ $eq: ['$$game.season', 2016] }, { $eq: ['$$game.seasonType', 'REG'] }],
                },
                input: { $concatArrays: ['$homeGames', '$awayGames'] },
              },
            },
            season: 2016,
          },
        },
        { $project: { awayGames: 0, homeGames: 0 } },
        { $match: { 'games.0': { $exists: true } } },
      ])
    })
  })
})
