import { GifResult } from '@giphy/js-fetch-api';
import axios from 'axios';
import { Request, Response } from 'express';

export default async function streamGiphy(
	req: Request,
	res: Response,
	gif: GifResult['data']
) {
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
}
