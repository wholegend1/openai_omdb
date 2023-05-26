import { Layout, Space } from "antd";
import { Input, Image } from "antd";
import { VideoCameraTwoTone, TrophyOutlined } from "@ant-design/icons";
import styles from "../styles/Movie.module.css";
const { Header, Footer, Content } = Layout;
const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 50,
  lineHeight: "64px",
  backgroundColor: "#7dbcea",
};
const contentStyle = {
  paddingLeft: "10px",
  paddingRight: "10px",
  paddingTop: "15px",
};
const footerStyle = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#7dbcea",
};
const MoviePage = () => (
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
      {/*Start search-container*/}
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
          />
          <div className={styles.searchList} id="search-list">
            <div className={styles.searchListItem}>
              <div className={styles.searchItemThumbnail}>
                <Image className={styles.antImage} src="/medium-cover.jpg" />
              </div>
              <div className={styles.searchItemInfo}>
                <h3>星際特攻隊</h3>
                <p>2017</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End search-container*/}
      {/*Start result-container*/}
      <div className={styles.container}>
        <div className={styles.resultContainer}>
          <div id="result-grid" className={styles.resultGrid}>
            {/* movie information here */}
            <div className={styles.moviePoster}>
              <Image
                className={styles.antImage}
                src="/medium-cover.jpg"
                alt="movie poster"
              ></Image>
            </div>
            <div className={styles.movieInfo}>
              <h3 className={styles.movieTitle}>星際特攻隊</h3>
              <ul className={styles.movieMiscInfo}>
                <li className={styles.year}>Year: 2017</li>
                <li className={styles.rated}>Ratings: PG-13</li>
                <li className={styles.released}>Released: 05 May 2017</li>
              </ul>
              <p className={styles.genre}>
                <b>Genre: </b>Action,Adenwqewqe
              </p>
              <p className={styles.writer}>
                <b>Writer: </b>josh
              </p>
              <p className={styles.actors}>
                <b>Actors: </b>josh
              </p>
              <p className={styles.plot}>
                <b>Plot:</b>
                joshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjoshjosh
              </p>
              <p className={styles.language}>
                <b>Language: </b>
                English
              </p>
              <p className={styles.awards}>
                <b>
                  <TrophyOutlined />{" "}
                </b>
                oscar
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* End of result-container*/}
    </Content>
    <Footer style={footerStyle}></Footer>
  </div>
);
export default MoviePage;
