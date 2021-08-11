import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';
import cors from '@middy/http-cors';

export default handler => middy(handler)
	.use([
		httpJsonBodyParser(),  //Automatically parse body request into JSON
		httpEventNormalizer(), //Protects event content for accessing non existing keys
		httpErrorHandler(),     //Help to manage errors
		cors()					//Help to manage cors
	]);