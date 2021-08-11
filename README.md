# WeatherApp Backend/API

## About this repo

This is an API developed using [Serverless Framework](https://www.serverless.com/) and deployed in AWS.

For this proyect I choose to develop all API in AWS Lambda Functions written in NodeJS (nodejs12.x).

This repo uses stages, so be careful when you deploy because you can handle different environments/stages with same code.

## How to deploy

### Pre-requisites

* Having an AWS account
* Use a programatic user. For this deployment you need to have a profile called 'weatherapp' in your AWS Credentials Profiles
* Have Serverless Framwork installed. Here you have the [Getting Started Page](https://www.serverless.com/framework/docs/getting-started/)

### Deploy

First clone the repo and install all dependencies
`gh repo clone leeboy1984/weatherapp_api 
cd weatherapp_api
npm install`

The easiest way to deploy is using the following command:
`sls deploy`

If you want to see more information regarding the deployment you can use verbose mode as follows:
`sls deploy -v`

For deploy different stages you need to provide stage to deploy command:
`sls deploy --stage STAGE_NAME`
Keep in mind that STAGE_NAME can be named as your preferences.

When deploy ends you will see something similar to this:
```
endpoints:
  POST - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/country
  GET - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/countries
  GET - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/country/{countryCode}
  POST - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/city
  GET - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/cities
  GET - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/cities/{countryCode}
  GET - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/city/{cityCode}
  GET - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/weather/{cityCode}
  GET - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/weather/{cityCode}/current
  POST - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/weather/{cityCode}
  PATCH - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/weather/{cityCode}/{weatherId}
  GET - https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/dev/weather/{cityCode}/{weatherId}
functions:
  createCountry: weather-app-api-dev-createCountry
  getCountries: weather-app-api-dev-getCountries
  getCountry: weather-app-api-dev-getCountry
  createCity: weather-app-api-dev-createCity
  getCities: weather-app-api-dev-getCities
  getCitiesByCountry: weather-app-api-dev-getCitiesByCountry
  getCity: weather-app-api-dev-getCity
  getWeatherFromCity: weather-app-api-dev-getWeatherFromCity
  getCurrentWeatherFromCity: weather-app-api-dev-getCurrentWeatherFromCity
  addCityWeather: weather-app-api-dev-addCityWeather
  fixCityWeather: weather-app-api-dev-fixCityWeather
  getCityWeatherById: weather-app-api-dev-getCityWeatherById
layers:
  None

Stack Outputs
AddCityWeatherLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-addCityWeather:1
FixCityWeatherLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-fixCityWeather:1
GetCountryLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-getCountry:1
GetCurrentWeatherFromCityLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-getCurrentWeatherFromCity:1
GetWeatherFromCityLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-getWeatherFromCity:1
ServerlessDeploymentBucketName: weather-app-api-STAGE_NAME-serverlessdeploymentbucket-1wdgbg52tsnqc
GetCitiesLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-getCities:1
GetCityWeatherByIdLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-getCityWeatherById:1
CreateCountryLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-createCountry:1
CreateCityLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-createCity:1
GetCountriesLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-getCountries:1
GetCitiesByCountryLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-getCitiesByCountry:1
ServiceEndpoint: https://grat3bhahi.execute-api.eu-west-1.amazonaws.com/STAGE_NAME
GetCityLambdaFunctionQualifiedArn: arn:aws:lambda:eu-west-1:XXXXXXXXXXXX:function:weather-app-api-STAGE_NAME-getCity:1
```

### Libraries used
* Folder structure used consistently across our projects.
* [serverless-pseudo-parameters plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Allows you to take advantage of CloudFormation Pseudo Parameters.
* [serverless-bundle plugin](https://www.npmjs.com/package/serverless-pseudo-parameters): Bundler based on the serverless-webpack plugin - requires zero configuration and fully compatible with ES6/ES7 features.
* [middy](https://github.com/middyjs/middy) From here I do not import the hole only the following modules: 
  * core --> middy core, this module allow us to create a middleware in your AWS Lambda Functions
  * http-cors --> apart of this middy middleware feature, this dependency allow lambda functions to deal with CORS in the easiest way
  * http-error-handler --> apart of this middy middleware feature, this dependency allow lambda functions to handle errors natively
  * http-event-normalizer --> apart of this middy middleware feature, this dependency wraps events received to JSON automatically
  * http-json-body-parser --> apart of this middy middleware feature, this dependency automatically converts lambda response to JSON format
* [aws-sdk](https://www.npmjs.com/package/aws-sdk) --> in ordre to access AWS resources natively (like DynamoDB)
* [lodash](https://www.npmjs.com/package/lodash) --> pretended to be used for merging objects when updating existing information
* [uuid](https://www.npmjs.com/package/uuid) --> used for generating uuids when inserting weather data in our database


## What will deploy

### AWS ApiGateway
This package will create an API Gateway with several EndPoints and will activate CORS for supporting requests from any browser

### Lambda Functions
Will generate as many lambda functions as needed in order tu support AWS ApiGateway requests

### CloudWatch
Since Serverless Framework uses CloudFormation, this deployment will also active CloudWatch Logs

### IAM Roles
There are some roles configured. At this stage I was not able to make a role working with indexes, due to this (even not a good practice) dynamodb:* is configured

### DynamoDB
Currently DynamoDB tables are generated with this framework. For testing purposes there are 4 DynamoDB tables created:
* weatherappCountries-STAGE_NAME
* weatherappCities-STAGE_NAME
* Weather Data Tables: 
  * weatherappCitiesData-STAGE_NAME
  * weatherappCitiesData-STAGE_NAME-es
  * weatherappCitiesData-STAGE_NAME-uk
  * weatherappCitiesData-STAGE_NAME-us

As extra, this package will also create the needed Global Secondary Indexes in Weather Data Tables(all the same for all tables):
* CityIndex
* CityOrderedIndex

## TO-DOs
* Move table creation to logic when adding a new country via API
* Fix IAM Roles in order to remove dynamodb:* policy and use less-priviledges posible
* Support PATCH for updating wheather info
* Support PUT for updating information related to countries & cities
* Add cache-tags in headers for caching-purposes
* Add custom domain configuration & certificates creation
* Support SNS notifications based on rules
* Support real-time changes based on websockets



