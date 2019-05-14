// library imports
import { exists, writeFile } from 'fs'
import { dirname } from 'path'

export const saveGameData = (data: any[]) => {
  return new Promise((resolve, reject) => {
    const root = (require.main && require.main.filename) || ''
    exists(`${__dirname}/data/temp`, condition => {
      console.log(__dirname + '/data/temp')
      // console.log('got data', data)
      if (!condition) reject(new Error(`no temp folder found at ${__dirname}/data/temp to save data into`))
      writeFile('games.json', JSON.stringify(data), err => {
        if (err) {
          reject(err)
        } else {
          console.log('successfully saved game data in temp')
          resolve()
        }
      })
    })
  })
}
