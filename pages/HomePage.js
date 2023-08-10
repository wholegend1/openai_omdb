import { useState } from "react";
import { Layout,Input,Image } from "antd";
import { VideoCameraTwoTone } from "@ant-design/icons";
import styles from "../styles/Movie.module.css";
const { Header, Footer, Content } = Layout;
import _ from "lodash"; 
import MovieItem from "../components/MovieItem";
import RecommendInfo from "../components/MovieRecommendInfo";
import { recommendData } from "../recommendData";

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

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchListVisible, setSearchListVisible] = useState(false);
  const [moviesInfo, setMoviesInfo] = useState([]);

  const throttledFindMovies = _.throttle((value) => {
    findMovies(value)
      .then((result) => {
        setSearchListVisible(result.searchListVisible);
        setMoviesInfo(result.moviesInfo);
      })
      .catch((error) => {
        setSearchListVisible(false);
        setMoviesInfo([]);
      });
  }, 3000, { trailing: false });

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
                throttledFindMovies(e.target.value);
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
            <RecommendInfo recommendData={recommendData} />
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

const findMovies = async (searchTerm) => {
  try {
    let search = searchTerm.toString().trim();
    if (search.length > 0) {
      console.log("search", search);
      const response = await fetch(`/api/movie?searchTerm=${searchTerm}`);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const moviesInfo = await response.json();
      console.log("moviesInfo", moviesInfo);

      return { searchListVisible: true, moviesInfo: moviesInfo };
    } else {
      return { searchListVisible: false, moviesInfo: [] };
    }
  } catch (error) {
    console.error("Error fetching and parsing JSON:", error);
    throw error;
  }
  
};


export default HomePage;
