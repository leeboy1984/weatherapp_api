import AWS from 'aws-sdk';
import middy from '@middy/core';
import commonMiddleware from '../lib/commonMiddleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createCity(event, context) {

  const body = event.body;

  const city = {
    "cityCode": body.cityCode,
    "cityName": body.cityName,
    "countryCode": body.countryCode
  }

  await dynamodb.put({
    TableName: process.env.CITIES_TABLE_NAME,
    Item: city
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(city),
  };
}

export const handler = commonMiddleware(createCity);