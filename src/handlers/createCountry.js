import AWS from 'aws-sdk';
import middy from '@middy/core';
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createCountry(event, context) {

  const body = event.body;

  const country = {
    "countryCode": body.countryCode,
    "countryName": body.countryName
  }

  await dynamodb.put({
    TableName: process.env.COUNTRIES_TABLE_NAME,
    Item: country
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(country),
  };
}

export const handler = commonMiddleware(createCountry);