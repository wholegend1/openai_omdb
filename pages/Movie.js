import { useState } from "react";
import { Layout,Input,Image } from "antd";
import { VideoCameraTwoTone } from "@ant-design/icons";
import styles from "../styles/Movie.module.css";
import { searchMovies } from "../utils/omdb";
const { Header, Footer, Content } = Layout;
import MovieItem from "../components/MovieItem";
import RecommendInfo from "../components/MovieRecommendInfo";

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
const generateReview = async (movieTitle, callback) => {
  try {
    const response = await axios.post("/api/generateReview", {
      movieTitle: movieTitle,
    });
    console.log(response);
    const generatedText = response.data.generatedReview;
    callback(null, generatedText);
  } catch (error) {
    callback(error, null);
    console.error("Failed to generate review:", error);
  }
};
const findMovies = async (searchTerm ,callback) => {
  let search = searchTerm.toString().trim();
  if (search.length > 0) {
    console.log("search", search);
    const moviesInfo = await searchMovies(search);
    callback(null,{searchListVisible:true, moviesInfo:moviesInfo})
  } else {
    callback(null, { searchListVisible: false, moviesInfo: [] });
  }
};

const Movie = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchListVisible, setSearchListVisible] = useState(false);
  const [moviesInfo, setMoviesInfo] = useState([]);

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
              onKeyUp={(e) => {
                findMovies(e.target.value, (error, result) => {
                  if (!error) {
                    setSearchListVisible(result.searchListVisible);
                    setMoviesInfo(result.moviesInfo);
                  } else {
                    console.error(error);
                    setSearchListVisible(false);
                    setMoviesInfo(result.moviesInfo);
                  }
                });
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div
              className={`${styles.searchList} ${
                searchListVisible ? "" : styles.hideSearchList
              }`}
              id="search-list"
            >
              <MoviesInfo moviesInfo={moviesInfo} />
            </div>
          </div>
          <div className={styles.recommendElement}>
            <RecommendInfo />
          </div>
        </div>
      </Content>
      <Footer style={footerStyle}>wildoinglab</Footer>
    </div>
  );
};

const MoviesInfo = ({ moviesInfo }) => {
  return moviesInfo.map((movie) => (
    <MovieItem key={movie.imdbID} movie={movie}  />
  ));
};




export default Movie;
