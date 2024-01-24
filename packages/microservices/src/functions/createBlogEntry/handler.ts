import type {ValidatedEventAPIGatewayProxyEvent} from '@libs/api-gateway';
import {createEntry} from '@libs/dynamo-wrapper';
import schema from './schema';

const createBlogEntry: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
    try {
        console.log('event: ', event);
        const data = await createEntry(event);
        return {statusCode: 200, body: JSON.stringify(data)};
    } catch (error) {
        console.log('DynamoDB error: ', error);
        return {
            statusCode: 500,
            body: JSON.stringify(error),
        };
    }
};

export const main = createBlogEntry;