import { useState, useEffect } from "react";
import { Image } from "antd";
import styles from "../styles/MovieRecommendInfo.module.css";
import Link from "next/link";
import { getStoredItem, setStoredItem } from "../utils/localStorageUtils";
import { useLanguage } from "../context/LanguageContext";
const RecommendInfo = ({ recommendData }) => {
  const [recommend, setRecommend] = useState([]);
  const { language, setLanguage } = useLanguage();
  useEffect(() => {
    fetchData(language,recommendData)
      .then((res) => {
        setRecommend(res);
      })
      .catch((error) => {
        console.error("Error fetching movie detail:", error);
      });
  }, [recommendData]);
  return (
    <>
      <div className={styles.recommendContainer}>
        {recommend.map((movie) => (
          <Link key={movie.imdbID} href={`/movie/${movie.imdbID}`}>
            <div className={styles.recommendItem}>
              <Image
                src={movie.Poster}
                alt="Movie Poster"
                className={styles.poster}
                preview={false}
              />
              <div className={styles.title}>{movie.Title}</div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

const fetchData = async (language, recommendData) => {
  try {
    const movieData = await Promise.all(
      recommendData.map(async (movie) => {
        let id = movie.omdbid;
        const storedMovieRecommend = getStoredItem(`${language}_movie_${id}`);
        if (storedMovieRecommend) {
          return {
            imdbID: id,
            Poster: storedMovieRecommend.Poster,
            Title: storedMovieRecommend.Title,
          };
        } else {
          let posterResponse = await fetch(
            `/api/movie?imdbID=${id}&type=poster`
          );

          if (!posterResponse.ok) {
            throw new Error("Network response was not ok");
          }

          let dataJson = await posterResponse.json();
          let res = { imdbID: id, Poster: dataJson[0], Title: dataJson[1] };
          console.log(dataJson);
          setStoredItem(`${language}_movie_${id}`, res);
          return res;
        }
      })
    );

    return movieData;
  } catch (error) {
    console.error("Error fetching and parsing JSON:", error);
    return []; // Return an empty array in case of error
  }
};

export default RecommendInfo;
