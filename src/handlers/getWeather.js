import AWS from 'aws-sdk';
import middy from '@middy/core';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getWeatherById(id, countryCode){
  
  let weather;
  
  console.log(id);

  try{

    const params = {
      TableName: process.env.WEATHER_GENERIC_TABLE_NAME + "-" + countryCode,
      Key: { 'id': id }
    };

    const result = await dynamodb.get(params).promise();

    weather = result.Item;

  }catch(error){
    console.error(error);
    //To Be Removed in prod
    throw new createError.InternalServerError(error);
  }


  if (!weather || weather.length == 0){
    throw new createError.NotFound(`No weather data for City with code: "${cityCode}"`);
  }

  return weather;
}

async function getWeather(event, context) {

  const { weatherId } = event.pathParameters;
  const { cityCode } = event.pathParameters;

  const weather = await getWeatherById(weatherId, cityCode.substring(0,2));

  return {
    statusCode: 200,
    body: JSON.stringify(weather),
  };
}

export const getWeatherHandler = commonMiddleware(getWeather);