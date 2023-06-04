import axios from "axios";

const API_KEY = process.env.OMDB_API_KEY;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { searchTerm, imdbID } = req.query;

    if (searchTerm) {
      const moviesInfo = await searchMovies(searchTerm);
      res.status(200).json(moviesInfo);
    } else if (imdbID) {
      const movieDetail = await getMovieDetail(imdbID);
      res.status(200).json(movieDetail);
    } else {
      res.status(400).json({ error: 'Invalid request' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

async function searchMovies(searchTerm) {
  const url = `https://www.omdbapi.com/?s=${searchTerm}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === 'True') {
    return data.Search;
  } else {
    return [];
  }
}

async function getMovieDetail(imdbID) {
  const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.Response === 'True') {
    return [data];
  } else {
    return [];
  }
}
