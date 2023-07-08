const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '38102784-37e9ad2cc652dbc0da2d9323c';


async function getImages(query, page, perPage) {
  try {
    const response = await fetch(`${ENDPOINT}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`);
    if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
  } catch (error) {
    console.error;
    
  }
}

export default {getImages};