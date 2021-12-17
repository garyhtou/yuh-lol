import { GifResult } from '@giphy/js-fetch-api';
import { HmacSHA256, SHA1 } from 'crypto-js';
import moment from 'moment';

const KEY = SHA1(process.env.GIPHY_API_SECRET);

export function generateGifUrl(baseUrl: string, gif: GifResultData) {
	const url = new URL(`${baseUrl}/gif/${gif.id}`);

	const time = moment().unix().toString();
	const signature = computeSignature(time, gif.id.toString());

	url.searchParams.set('t', time);
	url.searchParams.set('s', signature);

	return url.toString();
}

export function validateSignature(
	time: string,
	gifId: string,
	signature: string
) {
	const correctSignature = computeSignature(time, gifId);
	return signature === correctSignature;
}

function computeSignature(time: string, gifId: string) {
	return HmacSHA256(`${time}.${gifId}`, KEY).toString();
}

type GifResultData = GifResult['data'];
