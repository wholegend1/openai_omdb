import { useState, useEffect } from "react";
import { Image } from "antd";
import  styles  from "../styles/MovieRecommendInfo.module.css";
import Link from "next/link"; 

const RecommendInfo = ({ recommendData }) => {
  const [recommend, setRecommend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await Promise.all(
        recommendData.map(async (movie) => {
          let id = movie.omdbid;
          let posterResponse = await fetch(
            `/api/movie?imdbID=${id}&type=poster`
          )
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .catch((error) => {
              console.error("Error fetching and parsing JSON:", error);
            });
          return { id: id, poster: posterResponse };
        })
      );
      console.log("movieRecommend", movieData);
      setRecommend(movieData);
    };

    fetchData();
  }, [recommendData]);
  return (
    <>
      <h2>推薦的電影清單：</h2>
      <div className={styles.recommendContainer}>
        {recommend.map((movie) => (
          <Link href={`/movie/${movie.id}`}>
            <div key={movie.id} className={styles.recommendItem}>
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

export default RecommendInfo;