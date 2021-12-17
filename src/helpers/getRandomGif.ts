import giphy from '../utils/giphy';

export default async function getRandomGif() {
	const searchTerms = [
		{ term: 'yuh', range: 30 },
		{ term: 'doja cat yuh', range: 5 },
		{ term: '@dojacat', range: 20 },
		{ term: 'yeah!', range: 5 },
		{ term: 'yes!', range: 20 },
	];

	const gifs = [];
	for (let searchTerm of searchTerms) {
		// using a random offset minimizes network bandwidth
		const randomOffset = Math.floor(Math.random() * searchTerm.range);
		const response = await giphy.search(searchTerm.term, {
			rating: 'pg-13',
			lang: 'en',
			sort: 'relevant',
			type: 'gifs',
			limit: 1,
			offset: randomOffset,
		});
		gifs.push(...response.data);
	}

	const gif = gifs[Math.floor(Math.random() * gifs.length)];

	return gif;
}
