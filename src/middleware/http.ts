// project imports
import { iHttpRequestMiddleware } from './../utils/handle-http'
import { filterFields } from '../utils/operators'

export const withData = (query: (query: any) => Promise<any>): iHttpRequestMiddleware => {
  return async context => {
    context.data = await query(context.query)
  }
}

export const prepDataResponse = (): iHttpRequestMiddleware => {
  return context => {
    if (context.query.returnFields) {
      context.res.body.data = context.data.map(item => filterFields(item, context.query.returnFields))
    } else {
      context.res.body.data = context.data
    }
  }
}
