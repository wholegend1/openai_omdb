export async function getMovieInfo(searchTerm, key) {
  const url = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${key}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "True") {
    return data.Search;
  } else {
    return [];
  }
}

export async function getMovieDetail(imdbID, key) {
  const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${key}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === "True") {
    return [data];
  } else {
    return [];
  }
}

export async function getMovieRecommend(imdbID, key) {
  const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${key}`;
  const response = await fetch(url);
  const data = await response.json();
  if (data.Response === "True") {
    return [data.Poster, data.Title];
  } else {
    return [];
  }
}