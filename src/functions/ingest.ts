// library imports
import { Document } from 'mongoose'

// project imports
import { retrieveGames } from './../services/nfl'
import { gameFromRawGame } from '../model/game'
import { teamsFromRawGame } from '../model/team'

const availableSeasons = [2013, 2014, 2015, 2016, 2017, 2018]

export const retrieveAndStoreGames = async () => {
  try {
    for (let season of availableSeasons) {
      const games = await retrieveGames({ season })
      let promises: Promise<Document>[] = []
      games.forEach(game => {
        promises.push(gameFromRawGame(game))
        promises = promises.concat(teamsFromRawGame(game))
      })
      await Promise.all(promises)
    }
  } catch (err) {
    console.error(err)
  }
}
