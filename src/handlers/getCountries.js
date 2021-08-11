import AWS from 'aws-sdk';
import middy from '@middy/core';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getCountries(event, context) {

  let countries;

  try{

    const result = await dynamodb.scan({
      TableName: process.env.COUNTRIES_TABLE_NAME
    }).promise();

    console.log(result);

    countries = result.Items;

  }catch(error){
    console.error(error);
    //To Be Removed
    throw new createError.InternalServerError(error);
  }

  if (countries.length === 0 ){
    throw new createError.NotFound(`No Countries found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(countries),
  };
}

export const handler = commonMiddleware(getCountries);