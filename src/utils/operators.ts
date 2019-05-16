// library imports
import { round, get } from 'lodash'

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

export const filterFields = (source: { [key: string]: any }, fields: string[]): { [key: string]: any } => {
  let target = {}
  fields.forEach(field => {
    traverse(target, source, field.split('.'))
  })
  return target
}

const traverse = (target: any, source: any, fields: string[]) => {
  const newRoot = fields[0]
  if (fields.length === 1) {
    if (source.hasOwnProperty(newRoot)) target[newRoot] = source[newRoot]
  } else {
    if (source[newRoot] instanceof Array) {
      if (!target[newRoot]) target[newRoot] = []
      source[newRoot].forEach((item, index) => {
        if (!target[newRoot][index]) target[newRoot][index] = {}
        traverse(target[newRoot][index], source[newRoot][index], fields.slice(1))
      })
    } else {
      if (!target[newRoot]) target[newRoot] = {}
      traverse(target[newRoot], source[newRoot], fields.slice(1))
    }
  }
}
