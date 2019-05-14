// project imports
import { iHttpRequestMiddleware } from './../utils/handle-http'

export const withData = (query: (query: any) => Promise<any>): iHttpRequestMiddleware => {
  return async context => {
    context.data = await query(context.query)
  }
}

export const prepDataResponse = (): iHttpRequestMiddleware => {
  return context => {
    context.res.body.data = context.data
  }
}
