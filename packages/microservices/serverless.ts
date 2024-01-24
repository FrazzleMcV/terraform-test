import type {AWS} from '@serverless/typescript';
import getBlogEntries from '@functions/getBlogEntries';
import createBlogEntry from '@functions/createBlogEntry';

const region = 'us-east-1';

const serverlessConfiguration: AWS = {
    service: 'blog-service-1',
    frameworkVersion: '3',
    plugins: ['serverless-esbuild'],
    provider: {
        region,
        name: 'aws',
        runtime: 'nodejs18.x',
        apiGateway: {
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
        },
        iamRoleStatements: [
            {
                Effect: 'Allow',
                Action: [
                    'dynamodb:PutItem',
                    'dynamodb:GetItem',
                    'dynamodb:UpdateItem',
                    'dynamodb:Query',
                    'dynamodb:Scan',
                ],
                Resource: `arn:aws:dynamodb:${region}:891377342003:table/terra_test_blog`, // replace {region}, {accountId}, {tableName} with your values
            },
        ],
    },
    // import the function via paths
    functions: {createBlogEntry, getBlogEntries},
    package: {individually: true},
    custom: {
        esbuild: {
            bundle: true,
            minify: false,
            sourcemap: true,
            exclude: ['aws-sdk'],
            target: 'node18',
            define: {'require.resolve': undefined},
            platform: 'node',
            concurrency: 10,
        },
    },
};

module.exports = serverlessConfiguration;
