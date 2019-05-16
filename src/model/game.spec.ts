// library imports
import { expect } from 'chai'

// project imports
import { getScoreByTeam } from './game'

describe('Game model', () => {
  describe('getScoreByTeam', () => {
    it('should return undefined if game score does not exist', () => {
      const score = getScoreByTeam(<any>{}, 'DAL')
      expect(score).to.be.undefined
    })
    it('should select the team matching the home team abbreviation', () => {
      const mockGame: any = {
        homeTeamAbbr: 'DAL',
        score: {
          homeTeamScore: {
            pointsQ1: 123,
          },
        },
      }
      const score = getScoreByTeam(mockGame, 'DAL')
      expect(score).to.deep.equal(mockGame.score.homeTeamScore)
    })
    it('should select the team matching the home team abbreviation', () => {
      const mockGame: any = {
        visitorTeamAbbr: 'BAL',
        score: {
          visitorTeamScore: {
            pointsQ1: 123,
          },
        },
      }
      const score = getScoreByTeam(mockGame, 'BAL')
      expect(score).to.deep.equal(mockGame.score.visitorTeamScore)
    })
  })
})
