import AWS from 'aws-sdk';
import middy from '@middy/core';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getCountry(event, context) {

  let country;
  const { countryCode } = event.pathParameters;

  console.log(countryCode);

  try{

    const result = await dynamodb.get({
      TableName: process.env.COUNTRIES_TABLE_NAME,
      Key: { 'countryCode': countryCode }
    }).promise();

    country = result.Item;

  }catch(error){
    console.error(error);
    //To Be Removed in prod
    throw new createError.InternalServerError(error);
  }


  if (!country){
    throw new createError.NotFound(`Country with countryCode "${countryCode}" not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(country),
  };
}

export const handler = commonMiddleware(getCountry);