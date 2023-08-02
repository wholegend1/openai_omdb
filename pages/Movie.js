import { useState } from "react";
import { Layout, Space, Input, Image, Button, Tooltip } from "antd";
import { VideoCameraTwoTone, TrophyOutlined } from "@ant-design/icons";
import styles from "../styles/Movie.module.css";
import axios from "axios";
import MovieItem  from "../components/MovieItem";
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
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
};

const Movie = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchListVisible, setSearchListVisible] = useState(false);
  const [moviesInfo, setMoviesInfo] = useState([]);

  const generateReview = async (movieTitle) => {
    try {
      const response = await axios.post("/api/generateReview", {
        movieTitle: movieTitle,
      });
      console.log(response);
      const generatedText = response.data.generatedReview;
      setGeneratedReview(generatedText);
    } catch (error) {
      console.error("Failed to generate review:", error);
    }
  };
  const findMovies = async () => {
    const search = searchTerm.trim();
    if (search.length > 0) {
      setSearchListVisible(true);
      const moviesInfo = await searchMoviesAPI(search);
      setMoviesInfo(moviesInfo);
    } else {
      setSearchListVisible(false);
    }
  };

  const searchMoviesAPI = async (searchTerm) => {
    const response = await fetch(
      `/api/movies?searchTerm=${encodeURIComponent(searchTerm)}`
    );
    const data = await response.json();
    return data;
  };

  const displayMovies = () => {
    return moviesInfo.map((movie) => (
      <MovieItem key={movie.imdbID} movie={movie} findMovie={findMovie} />
    ));
  };

  const findMovie = async (imdbID) => {
    const movieDetail = await getMovieDetailAPI(imdbID);
    setMovieDetail(movieDetail);
    setSelectedMovie(true);
    setSearchListVisible(false);
    setSearchTerm("");
    console.log(searchTerm);
  };

  const getMovieDetailAPI = async (imdbID) => {
    const response = await fetch(
      `/api/movies?imdbID=${encodeURIComponent(imdbID)}`
    );
    const data = await response.json();
    return data;
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
              onChange={(e) => setSearchTerm(e.target.value)}
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
      </Content>
      <Footer style={footerStyle}>wildoinglab</Footer>
    </div>
  );
};

export default Movie;
