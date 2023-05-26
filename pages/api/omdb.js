import axios from "axios";

const API_KEY = "YOUR_OMDB_API_KEY";

export const getMovieDetails = async (movieTitle) => {
  try {
    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${API_KEY}&t=${movieTitle}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
};
