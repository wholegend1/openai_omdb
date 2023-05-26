import { useState } from "react";
import { getMovieDetails } from "../utils/omdb";

const Movie = () => {
  const [movieTitle, setMovieTitle] = useState("");
  const [movieDetails, setMovieDetails] = useState(null);

  const handleSearch = async () => {
    const details = await getMovieDetails(movieTitle);
    setMovieDetails(details);
  };

  return (
    <div>
      <h1>Movie Review Website</h1>
      <input
        type="text"
        value={movieTitle}
        onChange={(e) => setMovieTitle(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {movieDetails && (
        <div>
          <h2>{movieDetails.Title}</h2>
          <p>{movieDetails.Plot}</p>
          <p>Rating: {movieDetails.imdbRating}</p>
        </div>
      )}
    </div>
  );
};

export default Movie;
