import AWS from 'aws-sdk';
import commonMiddleware from '../lib/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getCity(event, context) {

  let city;
  const { cityCode } = event.pathParameters;

  try{

    const result = await dynamodb.get({
      TableName: process.env.COUNTRIES_TABLE_NAME,
      Key: { 'cityCode': cityCode }
    }).promise();

    city = result.Item;

  }catch(error){
    console.error(error);
    //To Be Removed in prod
    throw new createError.InternalServerError(error);
  }


  if (!city){
    throw new createError.NotFound(`City with cityCode "${cityCode}" not found!`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(city),
  };
}