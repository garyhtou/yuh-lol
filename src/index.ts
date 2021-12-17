import dotenv from 'dotenv';
dotenv.config(); // Load envrionment variables from .env file

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import nocache from 'nocache';

import router from './router';
import errorHandlers from './helpers/errorHandlers';

const PORT = process.env.PORT || 3000;
const app = express();

// Secure app with HTTP headers
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// Allow CORS
app.use(cors());

// Don't cache responses
app.use(nocache());

// Set EJS templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Add paths (router)
app.use(router);

// Handle errors
app.use(errorHandlers);

app.listen(PORT, () => {
	console.log(
		'\n=============================\n' +
			`Server listening on port ${PORT}` +
			'\n=============================\n'
	);
});
