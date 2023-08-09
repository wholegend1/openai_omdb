// pages/movie/[id].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import MovieDetail from "../../components/MovieDetail";
import { Button } from "antd";
const MovieId = () => {
  const router = useRouter();
  const { id } = router.query; // Get the movie id from the router query

  const [movieDetail, setMovieDetail] = useState(null);

  useEffect(() => {
    if (id) {
      fetchMovieDetail(id)
        .then((res) => {
          setMovieDetail(res);
        })
        .catch((error) => {
          console.error("Error fetching movie detail:", error);
        });
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

const fetchMovieDetail = async (id) => {
 try {
   const movieDetailResponse = await fetch(
     `/api/movie?imdbID=${id}&type=detail`
   );
   if (!movieDetailResponse.ok) {
     throw new Error("Network response was not ok");
   }
   const movieDetail = await movieDetailResponse.json();
   return movieDetail[0];
 } catch (error) {
   console.error("Error fetching and parsing JSON:", error);
   return {}; 
 }
};


export default MovieId;
