import { GifResult } from '@giphy/js-fetch-api';
import { HmacSHA256, SHA1 } from 'crypto-js';
import moment from 'moment';

const KEY = SHA1(process.env.GIPHY_API_SECRET);

export function generateUrl(url: string, data: string) {
	const urlObj = new URL(url);

	const time = moment().unix().toString();
	const signature = computeSignature(time, data);

	urlObj.searchParams.set('t', time);
	urlObj.searchParams.set('s', signature);
	urlObj.searchParams.set('d', data);

	return urlObj.toString();
}

export function validateSignature(
	time: string,
	data: string,
	signature: string
) {
	const correctSignature = computeSignature(time, data);
	return signature === correctSignature;
}

function computeSignature(time: string, data: string) {
	return HmacSHA256(`${time}.${data}`, KEY).toString();
}
