// MovieDetail.js
import { Image, Button } from "antd";
import { TrophyOutlined } from "@ant-design/icons";
import styles from "../styles/MovieDetail.module.css";
import { useRouter } from "next/router";

const MovieDetail = ({ movieDetail }) => {
  if (movieDetail.Poster === "N/A") {
    movieDetail.Poster = "/image-not-found-icon.svg";
  }
  const {
    Poster,
    Title,
    Year,
    Rated,
    Released,
    Genre,
    Writer,
    Actors,
    Plot,
    Language,
    Awards,
  } = movieDetail;

  const router = useRouter(); // Get the router object

  return (
    <>
      <div className={styles.resultWrapper}>
        {/* header */}
        <header className={styles.resultHeader}>
          <Button onClick={handleGoBack}>Back</Button>
        </header>
        {/* body */}
        <div className={styles.resultContainer}>
          <div id="result-grid" className={styles.resultGrid}>
            <div className={styles.moviePoster}>
              <Image
                className={styles.antImage}
                src={Poster}
                alt="movie poster"
              />
            </div>
            <div className={styles.movieInfo}>
              <h3 className={styles.movieTitle}>{Title}</h3>
              <ul className={styles.movieMiscInfo}>
                <li className={styles.year}>{Year}</li>
                <li className={styles.rated}>{Rated}</li>
                <li className={styles.released}>{Released}</li>
              </ul>
              <p className={styles.genre}>
                <b>Genre: </b>
                {Genre}
              </p>
              <p className={styles.writer}>
                <b>Writer: </b>
                {Writer}
              </p>
              <p className={styles.actors}>
                <b>Actors: </b>
                {Actors}
              </p>
              <p className={styles.plot}>
                <b>Plot:</b>
                {Plot}
              </p>
              <p className={styles.language}>
                <b>Language: </b>
                {Language}
              </p>
              <p className={styles.awards}>
                <b className={styles.subtitle}>
                  <TrophyOutlined />
                </b>
                {Awards}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieDetail;
