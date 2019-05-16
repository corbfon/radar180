// library imports
import { expect } from 'chai'

// project imports
import { sumObjectsByKey, divideObjectByConstant, filterFields } from './operators'

describe('operators', () => {
  describe('sumObjectsByKey', () => {
    it('should return a single object with the sum of other objects', () => {
      const objs: any = [{ val1: 1 }, { val2: 2 }, { val1: 1, val2: 2 }]
      expect(sumObjectsByKey(...objs)).to.deep.equal({ val1: 2, val2: 4 })
    })
    it('should return an empty object if the array is length 0', () => {
      expect(sumObjectsByKey(<any>[])).to.deep.equal({})
    })
  })
  describe('avgObjectByConstant', () => {
    const obj = {
      val1: 20,
      val2: 50,
      val3: 200,
    }
    it('should divide every value by the constant', () => {
      expect(divideObjectByConstant(obj, 3)).to.deep.equal({
        val1: 7,
        val2: 17,
        val3: 67,
      })
    })
    it('should allow the specification of precision', () => {
      expect(divideObjectByConstant(obj, 3, 2)).to.deep.equal({
        val1: 6.67,
        val2: 16.67,
        val3: 66.67,
      })
    })
  })
  describe('filterFields', () => {
    const source = {
      _id: '5cdc6596e085be88c21cfeb7',
      teamId: '1200',
      abbr: 'DAL',
      cityState: 'Dallas',
      conferenceAbbr: 'NFC',
      divisionAbbr: 'NCE',
      fullName: 'Dallas Cowboys',
      nick: 'Cowboys',
      teamType: 'TEAM',
      games: [
        {
          _id: '5cdc659469c5321636202fbd',
          score: {
            visitorTeamScore: {
              pointTotal: 3,
              pointQ1: 0,
              pointQ2: 0,
              pointQ3: 3,
              pointQ4: 0,
              pointOT: 0,
              timeoutsRemaining: 0,
            },
            homeTeamScore: {
              pointTotal: 19,
              pointQ1: 3,
              pointQ2: 13,
              pointQ3: 0,
              pointQ4: 3,
              pointOT: 0,
              timeoutsRemaining: 3,
            },
            phase: 'FINAL',
          },
          gameId: 2017091012,
          season: 2017,
          seasonType: 'REG',
          week: 1,
          gameKey: 57247,
          gameDate: '2017-09-10T05:00:00.000Z',
          gameTimeEastern: '20:30:00',
          gameTimeLocal: '19:30:00',
          isoTime: '2017-09-11T00:30:00.000Z',
          homeTeamId: '1200',
          visitorTeamId: '3410',
          homeTeamAbbr: 'DAL',
          visitorTeamAbbr: 'NYG',
          homeDisplayName: 'Dallas Cowboys',
          visitorDisplayName: 'New York Giants',
          homeNickname: 'Cowboys',
          visitorNickname: 'Giants',
          gameType: 'REG',
          weekNameAbbr: 'Week 1',
          weekName: 'Week 1',
          visitorTeam: {
            season: 2017,
            teamId: '3410',
            abbr: 'NYG',
            cityState: 'New York Giants',
            fullName: 'New York Giants',
            nick: 'Giants',
            teamType: 'TEAM',
            conferenceAbbr: 'NFC',
            divisionAbbr: 'NCE',
          },
          homeTeam: {
            season: 2017,
            teamId: '1200',
            abbr: 'DAL',
            cityState: 'Dallas',
            fullName: 'Dallas Cowboys',
            nick: 'Cowboys',
            teamType: 'TEAM',
            conferenceAbbr: 'NFC',
            divisionAbbr: 'NCE',
          },
          site: {
            siteId: 4948,
            siteCity: 'Arlington',
            siteFullname: 'AT&T Stadium',
            siteState: 'TX',
            roofType: 'RETRACTABLE',
          },
          networkChannel: 'NBC',
          ngsGame: true,
          validated: true,
          releasedToClubs: true,
        },
      ],
      season: 2017,
      byeWeek: 6,
      seasonScores: {
        pointTotal: 354,
        pointQ1: 60,
        pointQ2: 128,
        pointQ3: 46,
        pointQ4: 120,
        pointOT: 0,
        timeoutsRemaining: 20,
      },
      scoresAvg: {
        pointTotal: 22.1,
        pointQ1: 3.8,
        pointQ2: 8,
        pointQ3: 2.9,
        pointQ4: 7.5,
        pointOT: 0,
        timeoutsRemaining: 1.3,
      },
      concessions: [{ item: 'chocolate', price: 3.0 }, { item: 'hotdog', price: 5.5 }],
      emptyArray: [],
    }
    // it('should return the correct fields from an object', () => {
    //   const result = filterFields(obj, ['games.gameId', 'scoresAvg.pointTotal', 'byeWeek'])
    //   expect(result).to.deep.equal({
    //     games: [
    //       {
    //         gameId: 2017091012,
    //       },
    //     ],
    //     scoresAvg: {
    //       pointTotal: 22.1,
    //     },
    //     byeWeek: 6,
    //   })
    // })
    // it('should return the correct fields from an object', () => {
    //   const result = filterFields(source, ['games.gameId', 'scoresAvg.pointTotal', 'byeWeek'])
    //   expect(result).to.deep.equal({
    //     games: [
    //       {
    //         gameId: 2017091012,
    //       },
    //     ],
    //     scoresAvg: {
    //       pointTotal: 22.1,
    //     },
    //     byeWeek: 6,
    //   })
    // })
    it('should return a single value picked off the source', () => {
      const result = filterFields(source, ['teamId'])
      expect(result).to.deep.equal({ teamId: '1200' })
    })
    it('should return multiple fields picked off the source', () => {
      const result = filterFields(source, ['teamId', 'season'])
      expect(result).to.deep.equal({ teamId: '1200', season: 2017 })
    })
    it('should return a full array picked off the source', () => {
      const result = filterFields(source, ['concessions'])
      expect(result).to.deep.equal({ concessions: [{ item: 'chocolate', price: 3.0 }, { item: 'hotdog', price: 5.5 }] })
    })
    it('should return a filtered array picked off the source', () => {
      const result = filterFields(source, ['concessions.item'])
      expect(result).to.deep.equal({ concessions: [{ item: 'chocolate' }, { item: 'hotdog' }] })
    })
    it('should return multple fileds of a filtered array picked off the source', () => {
      const result = filterFields(source, ['concessions.item', 'concessions.price'])
      expect(result).to.deep.equal({ concessions: [{ item: 'chocolate', price: 3.0 }, { item: 'hotdog', price: 5.5 }] })
    })
    it('should return a multi-nested value picked off the source', () => {
      const result = filterFields(source, ['seasonScores.pointTotal'])
      expect(result).to.deep.equal({ seasonScores: { pointTotal: 354 } })
    })
    it('should return multiple nested fields', () => {
      const result = filterFields(source, ['seasonScores.pointTotal', 'seasonScores.pointQ2'])
      expect(result).to.deep.equal({ seasonScores: { pointTotal: 354, pointQ2: 128 } })
    })
    it('should return multiple nested fields and filtered arrays', () => {
      const result = filterFields(source, ['seasonScores.pointTotal', 'seasonScores.pointQ2', 'concessions.item'])
      expect(result).to.deep.equal({
        seasonScores: { pointTotal: 354, pointQ2: 128 },
        concessions: [{ item: 'chocolate' }, { item: 'hotdog' }],
      })
    })
    it('should return an empty array when filtering an empty array', () => {
      const result = filterFields(source, ['emptyArray.item'])
      expect(result).to.deep.equal({ emptyArray: [] })
    })
    it('should not return a field which does not exist', () => {
      const result = filterFields(source, ['non_esiste'])
      expect(result).to.deep.equal({})
    })
  })
})
