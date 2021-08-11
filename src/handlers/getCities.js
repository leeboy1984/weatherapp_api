import AWS from 'aws-sdk';
import middy from '@middy/core';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getCities(event, context) {

  let cities;

  try{

    const result = await dynamodb.scan({
      TableName: process.env.CITIES_TABLE_NAME
    }).promise();

    console.log(result);

    cities = result.Items;

  }catch(error){
    console.error(error);
    //To Be Removed
    throw new createError.InternalServerError(error);
  }

  if (!cities || cities.length === 0){
    throw new createError.NotFound(`There are no cities!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(cities),
  };
}

export const handler = commonMiddleware(getCities);

async function getCitiesByCountry(event, context) {

  const { countryCode } = event.pathParameters;

  let cities;

  try{

    const params = {
      TableName: process.env.CITIES_TABLE_NAME,
      IndexName: 'CountryIndex',
      KeyConditionExpression: 'countryCode = :countryCode',
      ExpressionAttributeValues: {
        ':countryCode': countryCode,
      },
    };

    const result = await dynamodb.query(params).promise();

    cities = result.Items;

  }catch(error){
    console.error(error);
    //To Be Removed in prod
    throw new createError.InternalServerError(error);
  }


  if (!cities || cities.length == 0){
    throw new createError.NotFound(`There are no cities for country "${countryCode}" not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(cities),
  };
}


export const handlerByCountry = commonMiddleware(getCitiesByCountry);