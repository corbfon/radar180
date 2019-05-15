// library imports
import { round } from 'lodash'

export const sumObjectsByKey = (...objs: { [key: string]: number }[]) => {
  return objs.reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k]
    }
    return a
  }, {})
}

export const divideObjectByConstant = (obj: { [key: string]: number }, constant: number, precision: number = 0) => {
  return combineObjects(
    ...Object.keys(obj).map(key => {
      return { [key]: round(obj[key] / constant, precision) }
    }),
  )
}

const combineObjects = (...objs: { [key: string]: any }[]): { [key: string]: any } => {
  return Object.assign({}, ...objs)
}
