import {DynamoDB} from '@aws-sdk/client-dynamodb';
import {marshall, unmarshall} from '@aws-sdk/util-dynamodb';

const region = process.env.AWS_REGION;
const tableName = 'terra_test_blog';

const client = new DynamoDB({region});

const createEntry = async (blogEntry) => {
    const params = {
        TableName: tableName,
        Item: marshall({TestTableHashKey: blogEntry.id, blog: {...blogEntry}})
    };

    await client.putItem(params);
    return blogEntry;
}

const getEntry = async () => {
    const params = {
        TableName: tableName,
    };

    const {Items} = await client.scan(params);
    return Items ? Items.map(item => unmarshall(item)) : [];
}

export {createEntry, getEntry};