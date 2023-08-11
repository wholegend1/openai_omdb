// pages/movie/[id].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import MovieDetail from "../../components/MovieDetail";
import { Button } from "antd";
import {getStoredItem,setStoredItem} from "../../utils/localStorageUtils";
import { useLanguage } from "../../context/LanguageContext";
import styles from "../../styles/MovieDetail.module.css";
import GoBackButton from "../../components/button/GoBackButton";
const Movie = () => {
  const router = useRouter();
  const { id } = router.query; // Get the movie id from the router query
  const [movieDetail, setMovieDetail] = useState(null);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (id) {
      const storedMovieDetail = getStoredItem(`${language}_movie_${id}`);
      console.log("language", language);
      if (storedMovieDetail && storedMovieDetail.Actors) {
        setMovieDetail(storedMovieDetail);
      } else {
        fetchMovieDetail(id)
          .then((res) => {
            setMovieDetail(res);
            // Update localStorage with the fetched detail
            setStoredItem(`${language}_movie_${id}`, res);
          })
          .catch((error) => {
            console.error("Error fetching movie detail:", error);
          });
      }
    }
  }, [id]);

  return (
    <div>
      {movieDetail ? (
        <MovieDetail movieDetail={movieDetail}/>
      ) : (
        <div className={styles.resultWrapper}>
          <GoBackButton />
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


export default Movie;
