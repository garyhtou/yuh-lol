import express, { Router, Request, Response } from 'express';
import getRandomGif from './helpers/getRandomGif';
import { generateGifUrl, validateSignature } from './helpers/gifUrl';
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
	const url = req.protocol + '://' + req.get('host');

	res.render('pages/index', {
		title: 'yuhhh!',
		domain: url,
		url: generateGifUrl(url, gif),
		gif: gif,
	});
});

router.get('/gif/:id', async (req: Request, res: Response) => {
	const id = req.params.id;
	const time = req.query.t as string;
	const signature = req.query.s as string;

	// Validate request
	try {
		const timestamp = parseInt(time);

		if (
			typeof signature !== 'string' ||
			!moment.unix(timestamp).isValid() ||
			!moment
				.unix(timestamp)
				.isBetween(moment().subtract(1, 'minute'), moment().add(1, 'second')) ||
			!validateSignature(time, id, signature)
		) {
			throw '!YUHHH == NUHHH';
		}
	} catch (e) {
		res.status(400).send('Invalid request. NUHHH');
		return;
	}

	// Get gif
	const gif = await getGifById(id);
	console.log('GIF', gif.id);

	// Stream it
	await streamGiphy(req, res, gif);
});

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

export default router;
