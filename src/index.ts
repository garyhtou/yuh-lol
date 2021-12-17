import dotenv from 'dotenv';
dotenv.config(); // Load envrionment variables from .env file

import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import nocache from 'nocache';
import crypto from 'crypto';

import router from './router';
import errorHandlers from './helpers/errorHandlers';

const PORT = process.env.PORT || 3000;
const app = express();

// Create nonce for helment's CSP
app.use((req, res, next) => {
	res.locals.nonce = crypto.randomBytes(16).toString('hex');
	next();
});

// Secure app with HTTP headers
app.use((req: Request, res: Response, next: NextFunction) => {
	helmet({
		crossOriginResourcePolicy: { policy: 'cross-origin' },
		contentSecurityPolicy: {
			useDefaults: true,
			directives: {
				scriptSrc: ["'self'", `'nonce-${res.locals.nonce}'`],
			},
		},
	})(req, res, next);
});

// Allow CORS
app.use(cors());

// Don't cache responses
app.use(nocache());

// Set EJS templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Add static files
app.use(express.static(__dirname + '/public'));

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
