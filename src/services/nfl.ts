// library imports
import axios from 'axios'
import { stringify } from 'querystring'

export async function retrieveGames(options: GamesOptions): Promise<RawGameData[]> {
  const { data } = await axios.get(`https://api.ngs.nfl.com/league/schedule?${stringify(options)}`)
  return data
}

interface GamesOptions {
  season: number
  seasonType?: 'PRE' | 'REG' | 'POST'
}

export interface RawGameData {
  gameId: number
  homeTeam: RawTeam
  visitorTeam: RawTeam
}

interface RawTeam {
  season: number
  teamId: string
  abbr: string
  cityState: string
  fullName: string
  nick: string
  teamType: string
  conferenceAbbr: string
  divisionAbbr: string
}
