// pages/movie/[id].js
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import MovieDetail from "../../components/MovieDetail";
import { getStoredItem, setStoredItem } from "../../utils/localStorageUtils";
import { useLanguage } from "../../context/LanguageContext";
import styles from "../../styles/MovieDetail.module.css";
import GoBackButton from "../../components/button/GoBackButton";
import axios from "axios";
import LanguageButton from "../../components/button/LanguageButton";
import { normalTranslateText } from "../../utils/translateText";
import { Spin } from "antd";
const Movie = () => {
  const router = useRouter();
  const { id } = router.query; // Get the movie id from the router query
  const [movieDetail, setMovieDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { language, setLanguage } = useLanguage();

  useEffect(() => {
    if (id) {
      const storedMovieDetail = getStoredItem(`${language}_movie_${id}`);
      console.log("language", language);
      if (storedMovieDetail && storedMovieDetail.Actors) {
        setMovieDetail(storedMovieDetail);
        setIsLoading(false);
      } else {
        fetchMovieDetail(language, id)
          .then((res) => {
            setMovieDetail(res);
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            console.error("Error fetching movie detail:", error);
          });
      }
    }
  }, [id, language]);

  return (
    <div>
      {isLoading ? (
        <div className={styles.resultWrapper}>
          <div className={styles.buttonGroup}>
            <GoBackButton />
            <LanguageButton />
          </div>
          <div className={styles.loadingGroup}>
            <h2>{normalTranslateText(language, "loading")}</h2>
            <Spin size="large" />
          </div>
        </div>
      ) : movieDetail ? (
        <MovieDetail movieDetail={movieDetail} language={language} />
      ) : (
        <div className={styles.resultWrapper}>
          <div className={styles.buttonGroup}>
            <GoBackButton />
            <LanguageButton />
          </div>
          <p>No movie detail available.</p>
        </div>
      )}
    </div>
  );
};

const fetchMovieDetail = async (language, id) => {
  try {
    const movieDetailResponse = await fetch(
      `/api/movie?imdbID=${id}&type=detail`
    );
    if (!movieDetailResponse.ok) {
      throw new Error("Network response was not ok");
    }
    const movieDetail = await movieDetailResponse.json();
    if (language === "en") {
      setStoredItem(`${language}_movie_${id}`, movieDetail[0]);
    } else {
      try {
        const translateResponse = await axios.post(
          `/api/openaiMovieTranslate`,
          {
            movieDetail: movieDetail[0],
          }
        );
        const translatedData = translateResponse.data;
        console.log("tc", translatedData);
        if (translatedData) {
          setStoredItem(`${language}_movie_${id}`, translatedData);
        }
        movieDetail[0] = translatedData;
      } catch (error) {
        alert("翻譯加載失敗請稍後在試");
        console.error("Error translating movie detail:", error);
      }
    }
    return movieDetail[0];
  } catch (error) {
    console.error("Error fetching and parsing JSON:", error);
    return {};
  }
};

export default Movie;
