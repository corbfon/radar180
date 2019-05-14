// library imports
import { Document } from 'mongoose'

// project imports
import { retrieveGames } from './../services/nfl'
import { gameFromRawGame } from '../model/game'
import { teamsFromRawGame } from '../model/team'

export const retrieveAndStoreGames = async () => {
  try {
    const games = await retrieveGames({ season: 2017 })
    let promises: Promise<Document>[] = []
    games.forEach(game => {
      promises.push(gameFromRawGame(game))
      promises = promises.concat(teamsFromRawGame(game))
    })
    await Promise.all(promises)
  } catch (err) {
    console.error(err)
  }
}
