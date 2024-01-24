import { APIGatewayProxyHandler } from 'aws-lambda';
import {getEntry} from "@libs/dynamo-wrapper";


export const getBlogEntries: APIGatewayProxyHandler = async () => {
  try {
    const entries = await getEntry()

    return {
      statusCode: 200,
      body: JSON.stringify(entries),
    };
  } catch (error) {
    console.log('DynamoDB error: ', error);
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const main = getBlogEntries;

