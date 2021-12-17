import express, { Router, Request, Response } from 'express';
import axios from 'axios';
import getRandomGif from './helpers/getRandomGif';

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
	console.log(gif.id);

	// Proxy gif from Giphy to response
	const stream = await axios.get(gif.images.original.url, {
		responseType: 'stream',
	});

	// Set same content-type
	res.set('Content-Type', stream.headers['content-type']);
	res.set(
		'Content-Disposition',
		`inline; filename="${encodeURIComponent(gif.title)}.gif"`
	);

	// Pipe gif stream
	stream.data.pipe(res);
});

export default router;
