// pages/movie/[id].js
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import MovieDetail from "../../components/MovieDetail";

const MovieId = () => {
  const router = useRouter();
  const { id } = router.query; // Get the movie id from the router query

  const [movieDetail, setMovieDetail] = useState(null);

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await axios.get(
          `/api/movies?imdbID=${encodeURIComponent(id)}`
        );
        setMovieDetail(response.data[0]);
      } catch (error) {
        console.error("Failed to fetch movie detail:", error);
      }
    };

    if (id) {
      fetchMovieDetail();
    }
  }, [id]);

  return (
    <div>
      {movieDetail ? (
        <MovieDetail movieDetail={movieDetail} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MovieId;
