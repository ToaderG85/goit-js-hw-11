import axios from "axios";

const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '38102784-37e9ad2cc652dbc0da2d9323c';


async function getImages(query) {
  try {
    const response = await axios.get(`${ENDPOINT}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true`);
    console.log(response.data.hits);
    return response.data.hits;
  } catch (error) {
    console.error;
  }
}

const form = document.querySelector("#search-form");

form.addEventListener("submit", onSubmit);

async function onSubmit(e) {
    e.preventDefault();
  
    const form = e.currentTarget;
    const inputValue = form.elements.searchQuery.value;
  
    try {
      const images = await getImages(inputValue);
  
      if (images.length === 0) throw new Error('No data');
  
      const markup = images.reduce((markup, image) => 
      createMarkup(image) + markup, '');
  
      updateImageList(markup);
    } catch (error) {
      onError(error);
    } finally {
      form.reset();
    }
  }

  function updateImageList(markup) {
    document.querySelector('.gallery').innerHTML = markup;
  }

  function createMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
    return `
    <div class="photo-card">
    <img src="${webformatURL}" alt="${largeImageURL}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
  </div>
      `;
  }

  function onError(err) {
    console.error(err);
  }