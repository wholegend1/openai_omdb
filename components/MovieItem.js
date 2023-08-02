// MovieItem.js
import { Image } from "antd";
import styles from "../styles/Movie.module.css";
import Link from "next/link"; // Import the Link component from Next.js

const MovieItem = ({ movie }) => {
  if (movie.Poster === "N/A") {
    movie.Poster = "/image-not-found-icon.svg";
  }

  return (
    <Link href={`/movie/${movie.imdbID}`}>
      {/* Use Link to navigate to movie/[id] */}
      <div className={styles.searchListItem}>
        <div className={styles.searchItemThumbnail}>
          <Image className={styles.antImage} src={movie.Poster} />
        </div>
        <div className={styles.searchItemInfo}>
          <h3>{movie.Title}</h3>
          <p>{movie.Year}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieItem;
