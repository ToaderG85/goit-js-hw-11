// import picApi from "./pic-api.js";
import Notiflix from 'notiflix'; 
import throttle from 'lodash.throttle';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector("#search-form");
// const loadMoreBtn = document.querySelector(".load-more");
const gallery = document.querySelector(".gallery");

const lightbox = new SimpleLightbox('.gallery a', { 
    captionsData: "alt",
    captionDelay: 250,
})

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

let page = 1;
const perPage = 40;
let inputValue;
let totalHits;

form.addEventListener("submit", onSubmit);

async function onSubmit(e) {
    e.preventDefault();
    page = 1;
    // loadMoreBtn.classList.add("hidden");
    gallery.innerHTML = "";
  
    const form = e.currentTarget;
    inputValue = form.elements.searchQuery.value;
  
    try {
      const result = await getImages(inputValue, page, perPage);
      const images = result.hits;
      totalHits = result.totalHits;
  
      if (images.length === 0) {
        Notiflix.Notify.failure(`❌ Sorry, there are no images matching your search query. Please try again.`);
        return;
      }

        Notiflix.Notify.success(`✅ Hooray! We found ${totalHits} images.`);  
        const markup = images.reduce((markup, image) => 
        createMarkup(image) + markup, '');  
        updateImageList(markup); 
        // loadMoreBtn.classList.remove("hidden");
        lightbox.refresh();


    } catch (error) {
      onError(error);
      
    } finally {
      form.reset();
    }
  }

// loadMoreBtn.addEventListener("click", async (event) => {
//     if ((page *perPage) >= totalHits ) {
//         loadMoreBtn.classList.add("hidden");
//         Notiflix.Notify.failure(`❌ We're sorry, but you've reached the end of search results.`);
//         return;
//     }
//     try {           
//         page++;
//         const result = await api.getImages(inputValue, page, perPage);
//         const images = result.hits;             
//         const markup = images.reduce((markup, image) => 
//         createMarkup(image) + markup, '');  
//         updateImageList(markup);
//         lightbox.refresh();

//         const { height: cardHeight } = document
//                 .querySelector(".gallery")
//                 .firstElementChild.getBoundingClientRect();

//                 window.scrollBy({
//                     top: cardHeight * 2,
//                     behavior: "smooth",
//                 });
  
//       } catch (error) {
//         onError(error);        
//       } 
// }) 

  function updateImageList(markup) {
    gallery.insertAdjacentHTML("beforeend", markup);
  }

  function createMarkup({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) {
    return `
    <div class="photo-card">
    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${largeImageURL}" loading="lazy" /></a>
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
  
  const handleInfiniteScroll = async () => {
    const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight;
    if (endOfPage) {
        if ((page *perPage) >= totalHits ) {
            removeInfiniteScroll();
            Notiflix.Notify.failure(`❌ We're sorry, but you've reached the end of search results.`);
            return;
        }
        try {           
            page++;
            const result = await getImages(inputValue, page, perPage);
            const images = result.hits;             
            const markup = images.reduce((markup, image) => 
            createMarkup(image) + markup, '');  
            updateImageList(markup);
            lightbox.refresh();
    
            const { height: cardHeight } = document
                    .querySelector(".gallery")
                    .firstElementChild.getBoundingClientRect();
    
                    window.scrollBy({
                        top: cardHeight * 2,
                        behavior: "smooth",
                    });
      
          } catch (error) {
            onError(error);        
          } 
    }
  };

  window.addEventListener("scroll", throttle(handleInfiniteScroll, 1000));

  const removeInfiniteScroll = () => {
    window.removeEventListener("scroll", handleInfiniteScroll);
  };
