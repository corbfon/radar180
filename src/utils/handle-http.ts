// library imports
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler, Context } from 'aws-lambda'

// project imports
import { BadRequestError } from '../schemas/errors'

export const initContext: (event: APIGatewayProxyEvent) => iHttpRequestContext = event => {
  try {
    const body = event.body ? JSON.parse(event.body) : null
    return {
      body,
      params: event.pathParameters || {},
      query: event.queryStringParameters || {},
      res: {
        statusCode: 200,
        body: {},
      },
    }
  } catch (err) {
    throw new BadRequestError('could not parse body as json', 400)
  }
}

const sendResponse: ({ statusCode: number, body: any }, event: APIGatewayProxyEvent) => APIGatewayProxyResult = (
  { statusCode, body }: { statusCode: number; body: object },
  event,
) => {
  const headers = {}
  if (event && event.headers && event.headers.origin) {
    headers['Access-Control-Allow-Origin'] = event.headers.origin
    headers['Access-Control-Allow-Credentials'] = true
  }
  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  }
}

const sendError = (error: BadRequestError, event: APIGatewayProxyEvent) => {
  return sendResponse({ statusCode: error.status || 500, body: { message: error.message } }, event)
}

export const handleHttpRequest: iHttpRequestHandler = middlewares => {
  return async (event, meta) => {
    try {
      const context = initContext(event)
      for (const fn of middlewares) {
        await fn(context, event, meta)
      }

      return sendResponse({ statusCode: context.res.statusCode, body: context.res.body }, event)
    } catch (err) {
      return sendError(err, event)
    }
  }
}
type iHttpRequestHandler = (middlewares: Array<iHttpRequestMiddleware>) => APIGatewayProxyHandler

export interface iHttpRequestMiddleware {
  (context: iHttpRequestContext, event?: APIGatewayProxyEvent, meta?: Context): void | Promise<void>
}

export interface iHttpRequestContext {
  body: any
  params: any
  query: any
  res: {
    statusCode: number
    body: any
  }
  [key: string]: any
}
