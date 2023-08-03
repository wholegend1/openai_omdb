const API_KEY = "5454f4b0";

export async function searchMovies(searchTerm) {
  const url = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "True") {
    return data.Search;
  } else {
    return [];
  }
}

export async function getMovieDetail(imdbID) {
  const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "True") {
    return [data];
  } else {
    return [];
  }
}

export async function getMoviePoster(imdbID) {
  const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.Response === "True") {
    return data.Poster;
  } else {
    return [];
  }
}
