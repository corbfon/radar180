// library imports
import { Document } from 'mongoose'

// project imports
import { retrieveGames } from './../services/nfl'
import { Game } from '../model/game'
import { Team } from '../model/team'

const availableSeasons = [2013, 2014, 2015, 2016, 2017, 2018]

export const retrieveAndStoreGames = async () => {
  /** bulk insert array for games */
  let gamesToIndex: Document[] = []
  /** bulk write array for teams */
  let teamsBulk: any[] = []
  try {
    for (let season of availableSeasons) {
      const rawGames = await retrieveGames({ season })
      rawGames.forEach(game => {
        gamesToIndex.push(new Game(game))
        teamsBulk.push({
          updateOne: {
            filter: { teamId: game.homeTeam.teamId },
            update: {
              $set: {
                ...game.homeTeam,
              },
            },
            upsert: true,
          },
        })
        teamsBulk.push({
          updateOne: {
            filter: { teamId: game.visitorTeam.teamId },
            update: {
              $set: {
                ...game.visitorTeam,
              },
            },
            upsert: true,
          },
        })
      })
    }
    await Game.collection.insert(gamesToIndex)
    await Team.bulkWrite(teamsBulk)
  } catch (err) {
    console.error(err)
  }
}
