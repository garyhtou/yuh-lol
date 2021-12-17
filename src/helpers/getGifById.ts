import giphy from '../utils/giphy';

export default async function getGifById(id: string) {
	const response = await giphy.gif(id);
	const gif = response.data;
	return gif;
}
