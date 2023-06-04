import { useState } from "react";
import { Layout, Space, Input, Image, Button, Tooltip } from "antd";
import { VideoCameraTwoTone, TrophyOutlined } from "@ant-design/icons";
import styles from "../styles/Movie.module.css";
import axios from "axios";
const { Header, Footer, Content } = Layout;

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "black",
};

const contentStyle = {
  paddingLeft: "10px",
  paddingRight: "10px",
  paddingTop: "15px",
};

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "black",
};

const MoviePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchListVisible, setSearchListVisible] = useState(false);
  const [moviesInfo, setMoviesInfo] = useState([]);
  const [movieDetail, setMovieDetail] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(false);
  const [generatedReview, setGeneratedReview] = useState("");

  const generateReview = async (movieTitle) => {
    try {
      const response = await axios.post("/api/generateReview", {
        movieTitle: movieTitle,
      });

      const generatedText = response.data.generatedReview;
      setGeneratedReview(generatedText);
    } catch (error) {
      console.error("Failed to generate review:", error);
    }
  };
  const findMovies = async () => {
    if (searchTerm.length > 0) {
      setSearchListVisible(true);
      const moviesInfo = await searchMoviesAPI(searchTerm);
      setMoviesInfo(moviesInfo);
    } else {
      setSearchListVisible(false);
    }
  };

  const searchMoviesAPI = async (searchTerm) => {
    const response = await fetch(`/api/movies?searchTerm=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();
    return data;
  };

  const displayMovies = () => {
    return moviesInfo.map((movie) => {
      if (movie.Poster === 'N/A') {
        movie.Poster = '/image-not-found-icon.svg';
      }

      return (
        <div
          key={movie.imdbID}
          className={styles.searchListItem}
          onClick={() => findMovie(movie.imdbID)}
        >
          <div className={styles.searchItemThumbnail}>
            <Image className={styles.antImage} src={movie.Poster} />
          </div>
          <div className={styles.searchItemInfo}>
            <h3>{movie.Title}</h3>
            <p>{movie.Year}</p>
          </div>
        </div>
      );
    });
  };

  const findMovie = async (imdbID) => {
    const movieDetail = await getMovieDetailAPI(imdbID);
    setMovieDetail(movieDetail);
    setSelectedMovie(true);
    setSearchListVisible(false);
    setSearchTerm('');
    console.log(searchTerm);
  };

  const getMovieDetailAPI = async (imdbID) => {
    const response = await fetch(`/api/movies?imdbID=${encodeURIComponent(imdbID)}`);
    const data = await response.json();
    return data;
  };

  const displayMovieDetail = () => {
    
    return movieDetail.map((movie) => {
      if (movie.Poster === 'N/A') {
        movie.Poster = '/image-not-found-icon.svg';
      }
      return (
        <><div className={styles.moviePoster}>
          <Image
            className={styles.antImage}
            src={movie.Poster}
            alt="movie poster"
          ></Image>
        </div><div className={styles.movieInfo}>
            <h3 className={styles.movieTitle}>{movie.Title}</h3>
            <ul className={styles.movieMiscInfo}>
              <li className={styles.year}>{movie.Year}</li>
              <li className={styles.rated}>{movie.Rated}</li>
              <li className={styles.released}>{movie.Released}</li>
            </ul>
            <p className={styles.genre}>
              <b>Genre: </b>
              {movie.Genre}
            </p>
            <p className={styles.writer}>
              <b>Writer: </b>
              {movie.Writer}
            </p>
            <p className={styles.actors}>
              <b>Actors: </b>
              {movie.Actors}
            </p>
            <p className={styles.plot}>
              <b>Plot:</b>
              {movie.Plot}
            </p>
            <p className={styles.language}>
              <b>Language: </b>
              {movie.Language}
            </p>
            <p className={styles.awards}>
              <b className={styles.subtitle}>
                <TrophyOutlined />
              </b>
              {movie.Awards}
            </p>
            <Tooltip placement="bottom" title={generatedReview}>
              <Button onClick={() => { generateReview(movie.Title); } }>Review</Button>
            </Tooltip>
          </div></>
      )

      });
  };

  return (
    <div className={styles.wrapper}>
      <Header style={headerStyle}>
        <div className={styles.logo}>
          <div className={styles.container}>
            <h1>
              <span>open</span>MovieReview
            </h1>
          </div>
        </div>
      </Header>
      <Content style={contentStyle}>
        {/* Start search-container */}
        <div className={styles.searchContainer}>
          <div className={styles.searchElement}>
            <h3>Search Movie:</h3>
            <Input
              type="text"
              size="large"
              placeholder="在此輸入你想查詢的電影"
              className={styles.formControl}
              id="movie-search-box"
              prefix={<VideoCameraTwoTone />}
              onKeyUp={findMovies}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value.trim())}
            />
            <div
              className={`${styles.searchList} ${
                searchListVisible ? "" : styles.hideSearchList
              }`}
              id="search-list"
            >
              {displayMovies()}
            </div>
          </div>
        </div>
        {/* End search-container */}
        {/* Start result-container */}
        <div className={styles.container}>
          <div className={styles.resultContainer}>
            <div id="result-grid" className={styles.resultGrid}>
              {/* movie information here */}
              {selectedMovie && displayMovieDetail()}
            </div>
          </div>
        </div>
        {/* End of result-container */}
      </Content>
      <Footer style={footerStyle}>wildoinglab</Footer>
    </div>
  );
};

export default MoviePage;
