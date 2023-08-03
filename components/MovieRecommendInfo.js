import { useState, useEffect } from "react";
import { recommendData } from "../recommendData";
import { getMoviePoster } from "../utils/omdb";
import { Image } from "antd";
import  styles  from "../styles/MovieRecommendInfo.module.css";
import Link from "next/link"; 

const RecommendInfo = ({  }) => {
  const [recommend, setRecommend] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const movieData = await Promise.all(
        recommendData.map(async (movie) => {
          let id = movie.omdbid;
          let poster = await getMoviePoster(id);
          return { id, poster };
        })
      );
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