// library imports
import * as chai from 'chai'
import * as sorted from 'chai-sorted'
chai.use(sorted)
import { expect } from 'chai'
import { assert, stub, SinonStub } from 'sinon'

// project imports
import { Team, addByeWeeks } from './team'

describe('Team model', () => {
  describe('addByeWeeks', () => {
    it('should add bye weeks to teams with sorted games', () => {
      let context: any = {
        data: [
          {
            games: [{ week: 1 }, { week: 2 }, { week: 4 }],
          },
          {
            games: [{ week: 1 }, { week: 2 }, { week: 3 }, { week: 4 }, { week: 5 }],
          },
        ],
      }
      addByeWeeks()(context)
      expect(context.data[0].byeWeek).to.be.equal(3)
      expect(context.data[1].byeWeek).to.be.equal(6)
    })
    it('should add bye weeks to teams with unsorted games', () => {
      let context: any = {
        data: [
          {
            games: [{ week: 4 }, { week: 2 }, { week: 1 }],
          },
          {
            games: [{ week: 3 }, { week: 2 }, { week: 5 }, { week: 1 }, { week: 4 }],
          },
        ],
      }
      addByeWeeks()(context)
      expect(context.data[0].byeWeek).to.be.equal(3)
      expect(context.data[1].byeWeek).to.be.equal(6)
    })
    it('should not add a bye week if there are no games', () => {
      let context: any = {
        data: [{}, {}],
      }
      addByeWeeks()(context)
      context.data.forEach(team => {
        expect(team.byeWeek).to.be.undefined
      })
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
    beforeEach(() => {
      aggregateStub = stub(Team, 'aggregate')
    })
    afterEach(() => {
      aggregateStub.restore()
    })
    it('should query for all teams', async () => {
      await Team.withGames()({ season: 2016 })
      assert.calledWithExactly(aggregateStub, [
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
          },
        },
        { $project: { awayGames: 0, homeGames: 0 } },
      ])
    })
    it('should query for a single team', async () => {
      await Team.withGames()({ season: 2000, team: 'CAR' })
      assert.calledWithExactly(aggregateStub, [
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
          },
        },
        { $project: { awayGames: 0, homeGames: 0 } },
      ])
    })
  })
})
