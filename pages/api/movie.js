
const API_KEY = process.env.OMDB_API_KEY;
import {
  getMovieDetail,
  getMovieInfo,
  getMovieRecommend,
} from "../../utils/getMovies";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { searchTerm, imdbID, type } = req.query;

    if (searchTerm) {
      const moviesInfo = await getMovieInfo(searchTerm, API_KEY);
      res.status(200).json(moviesInfo);
    } else if (imdbID && type ==="detail") {
      const movieDetail = await getMovieDetail(imdbID, API_KEY);
      res.status(200).json(movieDetail);
    } else if (imdbID && type === "poster") {
      const MovieRecommendInfo = await getMovieRecommend(imdbID, API_KEY);
      res.status(200).json(MovieRecommendInfo);
    } else {
      res.status(400).json({ error: "Invalid request" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}


