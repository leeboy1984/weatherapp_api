import AWS from 'aws-sdk';
import middy from '@middy/core';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getWeatherFromCity(event, context) {

  let weather;
  const { cityCode } = event.pathParameters;

  try{

    const params = {
      TableName: process.env.WEATHER_GENERIC_TABLE_NAME + "-" + cityCode.substring(0,2),
      IndexName: 'CityOrderedIndex',
      KeyConditionExpression: 'cityCode = :cityCode',
      Limit: 7,
      ExpressionAttributeValues: {
        ':cityCode': cityCode,
      },
    };

    const result = await dynamodb.query(params).promise();

    weather = result.Items;

  }catch(error){
    console.error(error);
    //To Be Removed in prod
    throw new createError.InternalServerError(error);
  }


  if (!weather || weather.length == 0){
    throw new createError.NotFound(`No weather data for City with code: "${cityCode}"`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(weather),
  };
}

export const handler = commonMiddleware(getWeatherFromCity);



async function getCurrentWeatherFromCity(event, context) {

  let weather;
  const { cityCode } = event.pathParameters;

  try{

    const params = {
      TableName: process.env.WEATHER_GENERIC_TABLE_NAME + "-" + cityCode.substring(0,2),
      IndexName: 'CityOrderedIndex',
      KeyConditionExpression: 'cityCode = :cityCode',
      Limit: 1,
      ExpressionAttributeValues: {
        ':cityCode': cityCode,
      },
    };

    const result = await dynamodb.query(params).promise();

    weather = result.Items[0];

  }catch(error){
    console.error(error);
    //To Be Removed in prod
    throw new createError.InternalServerError(error);
  }


  if (!weather ){
    throw new createError.NotFound(`No current weather data for City with code: "${cityCode}"`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(weather),
  };
}

export const currentWeatherFromCityHandler = commonMiddleware(getCurrentWeatherFromCity);