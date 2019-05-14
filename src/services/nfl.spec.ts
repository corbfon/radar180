// library imports
import { stub, SinonStub, assert } from 'sinon'
import axios from 'axios'

// project imports
import { retrieveGames } from './nfl'

describe('nfl service', () => [
  describe('retrieveGames', () => {
    const fakeData = [
      {
        gameId: 12345,
      },
    ]
    let getStub: SinonStub
    beforeEach(() => {
      getStub = stub(axios, 'get').resolves(<any>{ data: fakeData })
    })
    afterEach(() => getStub.restore())
    it('should get the games from a single season', async () => {
      await retrieveGames({ season: 2010 })
      assert.calledWithExactly(getStub, 'https://api.ngs.nfl.com/league/schedule?season=2010')
    })
    it('should get the games for a season type', async () => {
      await retrieveGames({ season: 2010, seasonType: 'REG' })
      assert.calledWithExactly(getStub, 'https://api.ngs.nfl.com/league/schedule?season=2010&seasonType=REG')
    })
  }),
])
