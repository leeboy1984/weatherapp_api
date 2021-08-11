import AWS from 'aws-sdk';
import createError from 'http-errors';
import commonMiddleware from '../lib/commonMiddleware';
import { v4 as uuid } from 'uuid';
import { getWeatherById } from './getWeather';
import _ from 'lodash';


const dynamodb = new AWS.DynamoDB.DocumentClient();

async function addFullCityWeather(event, context) {

  const weather = event.body;
  const { cityCode } = event.pathParameters;

  const cityWeather = {
    id: uuid(),
    cityCode,
    countryCode: cityCode.substring(0,2),
    timestamp: weather.dt,
    weather
  }

  await dynamodb.put({
    TableName: process.env.WEATHER_GENERIC_TABLE_NAME + "-" + cityCode.substring(0,2),
    Item: cityWeather
  }).promise();

  return {
    statusCode: 201,
    body: JSON.stringify(cityWeather),
  };
}

export const addHandler = commonMiddleware(addFullCityWeather);

async function fixCityWeather(event, context) {

  const weather = event.body;
  const { weatherId } = event.pathParameters;
  const { cityCode } = event.pathParameters;

  let oldWeather = await getWeatherById(weatherId, cityCode.substring(0,2));

  console.log(oldWeather);

  let updateExpression = "set ";
  let updateExpressionValues = {};

  for (var key in weather){
    //updateExpression += key + " = " + ":" + key 
    //updateExpressionValues[":" + key] = weather[key] 
    _.updateWith(oldWeather, key, _.constant(weather[key]));
  }

  for (var key in oldWeather){
    updateExpression += key + " = " + ":" + key + ","
    updateExpressionValues[":" + key] = oldWeather[key] 
  }

  console.log(oldWeather)

  const params = {
    TableName: process.env.WEATHER_GENERIC_TABLE_NAME + "-" + cityCode.substring(0,2),
    Key: { 'id': weatherId },
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: updateExpressionValues,
    ReturnValues: 'ALL_NEW',
  };

  let updatedWeather;

  console.log(params);

  try{
    const result = await dynamodb.update(params).promise();
    updatedWeather = result.Attributes;
  }catch(error){
    console.log(error);
    throw new createError.InternalServerError(error);
  }

  
  return {
    statusCode: 200,
    body: JSON.stringify(updatedWeather),
  };
}

export const fixCityWeatherHandler = commonMiddleware(fixCityWeather);