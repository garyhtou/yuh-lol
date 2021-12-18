import { GifResult } from '@giphy/js-fetch-api';
import axios from 'axios';
import { Request, Response } from 'express';

export default async function streamUrl(
	req: Request,
	res: Response,
	url: string,
	filename: string
) {
	// Proxy gif from Giphy to response
	const stream = await axios.get(url, {
		responseType: 'stream',
	});

	// Set same content-type
	res.set('Content-Type', stream.headers['content-type']);
	res.set('Content-Disposition', `inline; filename="${filename}"`);

	// Pipe gif stream
	stream.data.pipe(res);
}
