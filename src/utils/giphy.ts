// pollyfill `fetch` for @giphy/js-fetch-api
import 'isomorphic-fetch';
import { GiphyFetch } from '@giphy/js-fetch-api';

const API_KEY = process.env.GIPHY_API_KEY;
if (!API_KEY) {
	throw new Error('GIPHY_API_KEY envrionment variable is not set');
}

const gf = new GiphyFetch(API_KEY);

export default gf;
