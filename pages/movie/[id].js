// pages/movie/[id].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import MovieDetail from "../../components/MovieDetail";
import { getMovieDetail } from "../../utils/omdb";
import { Button } from "antd";
const MovieId = () => {
  const router = useRouter();
  const { id } = router.query; // Get the movie id from the router query

  const [movieDetail, setMovieDetail] = useState(null);

  useEffect(() => {
    if (id) {
      getMovieDetail(id).then((res) => setMovieDetail(res[0]));
    }
  }, [id]);

  const handleGoBack = () => {
    router.back(); // Function to navigate back to the previous page
  };

  return (
    <div>
      {movieDetail ? (
        <MovieDetail movieDetail={movieDetail} handleGoBack={handleGoBack} />
      ) : (
        <div>
          <Button onClick={handleGoBack}>Back</Button>
          <p>Loading...</p>
        </div>
      )}
    </div>
  );
};

export default MovieId;
