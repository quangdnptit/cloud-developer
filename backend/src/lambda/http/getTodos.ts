import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getUserId } from '../utils';
import { findTodosByUserId } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger'

// TODO: Get all TODO items for a current user
const logger = createLogger('lambdaGetUser')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('event: ' + JSON.stringify(event));
    const sortBy = event.queryStringParameters.sortBy
    const userId = getUserId(event)
    const result = await findTodosByUserId(userId, sortBy)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        items: result
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
