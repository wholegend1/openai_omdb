import { useState, useEffect } from "react";
import { Image } from "antd";
import styles from "../styles/MovieRecommendInfo.module.css";
import Link from "next/link";

const RecommendInfo = ({ recommendData }) => {
  const [recommend, setRecommend] = useState([]);

  useEffect(() => {
    fetchData(recommendData).then((res) => {
      setRecommend(res);
    });
  }, [recommendData]);
  return (
    <>
      <h2>推薦的電影清單：</h2>
      <div className={styles.recommendContainer}>
        {recommend.map((movie) => (
          <Link key={movie.id}  href={`/movie/${movie.id}`}>
            <div className={styles.recommendItem}>
              <Image
                src={movie.poster}
                alt="Movie Poster"
                className={styles.poster}
                preview={false}
              />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

const fetchData = async (recommendData) => {
  try {
    const movieData = await Promise.all(
      recommendData.map(async (movie) => {
        let id = movie.omdbid;
        let posterResponse = await fetch(`/api/movie?imdbID=${id}&type=poster`);

        if (!posterResponse.ok) {
          throw new Error("Network response was not ok");
        }

        let posterJson = await posterResponse.json();

        return { id: id, poster: posterJson };
      })
    );

    return movieData;
  } catch (error) {
    console.error("Error fetching and parsing JSON:", error);
    return []; // Return an empty array in case of error
  }
};

export default RecommendInfo;
