import express, { Router, Request, Response, NextFunction } from 'express';
import getRandomGif from './helpers/getRandomGif';
import { generateUrl, validateSignature } from './helpers/protectUrl';
import getGifById from './helpers/getGifById';
import moment from 'moment';
import streamGiphy from './helpers/streamGiphy';

const router: Router = express.Router();

// Express body-parser
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Ping Pong (test endpoint)
router.get('/ping', (req: Request, res: Response) => {
	res.send('pong! 🏓');
});

router.get('/', async (req: Request, res: Response) => {
	// Choose a random gif
	const gif = await getRandomGif();
	console.log('HOME', gif.id);
	const domain = req.protocol + '://' + req.get('host');

	res.render('pages/index', {
		title: 'yuhhh!',
		domain: domain,
		url: generateUrl(`${domain}/gif`, gif.id.toString()),
		music: generateUrl(`${domain}/music.mp3`, 'heck yuh'),
		gif: gif,
		nonce: res.locals.nonce,
	});
});

router.get(
	'/gif',
	validateRequest(1000 * 60), // 1 minute
	async (req: Request, res: Response) => {
		const id = req.query.d as string;

		// Get gif
		const gif = await getGifById(id);
		console.log('GIF', gif.id);

		// Stream it
		await streamGiphy(req, res, gif);
	}
);

router.get(
	'/music.mp3',
	validateRequest(1000 * 60 * 60), // 1 hour
	async (req: Request, res: Response) => {
		res.sendFile(__dirname + '/assets/get_into_it_by_doja_cat.mp3');
	}
);

router.get('/json', async (req: Request, res: Response) => {
	if (process.env.NODE_ENV === 'production') {
		res.status(403).send("this ain't for you");
		return;
	}

	// Choose a random gif
	const gif = await getRandomGif();
	console.log('JSON', gif.id);

	res.json(gif);
});

function validateRequest(timeBuffer: number) {
	// Return a Express middleware
	return (req: Request, res: Response, next: NextFunction) => {
		const data = req.query.d as string;
		const time = req.query.t as string;
		const signature = req.query.s as string;

		try {
			const timestamp = parseInt(time);

			if (
				typeof data !== 'string' ||
				typeof signature !== 'string' ||
				!moment.unix(timestamp).isValid() ||
				!moment
					.unix(timestamp)
					.isBetween(
						moment().subtract(timeBuffer, 'milliseconds'),
						moment().add(1, 'second')
					) ||
				!validateSignature(time, data, signature)
			) {
				// Something's wrong with the request. It's invalid.
				throw '!YUHHH == NUHHH';
			}
		} catch (e) {
			// Return error
			res.status(400).send('Invalid request. NUHHH');
			console.log('INVALID REQUEST', data, time, signature);

			return;
		}

		// All good. continue
		next();
	};
}

export default router;
