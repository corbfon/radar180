// library imports
import axios from 'axios'
import { stringify } from 'querystring'
import { pick } from 'lodash'
import { expect } from 'chai'

const baseUrl = process.env.BASE_URL || 'http://localhost:4200'
const req = (query: any = {}) => {
  return axios.get(`${baseUrl}/teams?${stringify(query)}`)
}

describe('teams integration', () => {
  describe('retrieve', () => {
    it('should return teams per season', async () => {
      const res = await req({ season: 2018 })
      expect(res.status).to.be.equal(200)
      expect(res.data).to.haveOwnProperty('data')
      expect(res.data.data).to.be.instanceOf(Array)
      expect(res.data.data).to.be.lengthOf(32) // known number of teams with games this season
      res.data.data.forEach(team => {
        expect(team).to.haveOwnProperty('_id')
        expect(team).to.haveOwnProperty('teamId')
        expect(team).to.haveOwnProperty('abbr')
        expect(team).to.haveOwnProperty('cityState')
        expect(team).to.haveOwnProperty('fullName')
        expect(team).to.haveOwnProperty('nick')
        expect(team).to.haveOwnProperty('teamType')
        expect(team).to.haveOwnProperty('conferenceAbbr')
        expect(team).to.haveOwnProperty('games')
        expect(team.games.length).to.be.above(0)
        team.games.forEach(game => {
          expect(game).to.haveOwnProperty('gameId')
          expect(game).to.haveOwnProperty('week')
          expect(game).to.haveOwnProperty('visitorTeamAbbr')
          expect(game).to.haveOwnProperty('homeTeamAbbr')
        })
      })
    })
    it('should filter by team', async () => {
      const propsToVerify = [
        'teamId',
        'abbr',
        'cityState',
        'fullName',
        'nick',
        'teamType',
        'conferenceAbbr',
        'divisionAbbr',
        'byeWeek',
      ]
      const res = await req({ season: 2018, team: 'MIN' })
      expect(res.status).to.be.equal(200)
      expect(res.data).to.haveOwnProperty('data')
      expect(res.data.data).to.be.lengthOf(1)
      const team = res.data.data[0]
      expect(pick(team, propsToVerify)).to.deep.equal({
        abbr: 'MIN',
        byeWeek: 10,
        cityState: 'Minnesota',
        conferenceAbbr: 'NFC',
        divisionAbbr: 'NCN',
        fullName: 'Minnesota Vikings',
        nick: 'Vikings',
        teamId: '3000',
        teamType: 'TEAM',
      })
      expect(team.games).to.be.lengthOf(16)
    })
    it('should filter by season', async () => {
      const season = 2017
      const res = await req({ season, team: 'BAL' })
      expect(res.status).to.be.equal(200)
      expect(res.data).to.haveOwnProperty('data')
      res.data.data[0].games.forEach(game => {
        expect(game.season).to.be.equal(season)
      })
    })
    it('should return an error if season is not specified', async () => {
      try {
        await req({ team: 'CHI' })
      } catch (err) {
        expect(err.response.status).to.be.equal(400)
        return
      }
      throw new Error('expected to receive bad request error')
    })
    it('should return an error if an unknown query parameter is sent', async () => {
      try {
        await req({ nothing: 'something' })
      } catch (err) {
        expect(err.response.status).to.be.equal(400)
        return
      }
      throw new Error('expected to receive bad request error')
    })
  })
})
