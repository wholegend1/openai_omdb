// MovieDetail.js
import { useState } from "react";
import { Image, Button, Spin } from "antd";
import { TrophyOutlined, SwapOutlined } from "@ant-design/icons";
import styles from "../styles/MovieDetail.module.css";
import axios from "axios";



const MovieDetail = ({ movieDetail, handleGoBack }) => {
  const [reviewData, setReviewData] = useState({
    Title:"",
    Introduction:"",
    Review:"",
    isGenerated: false,
    isLoading: false,
  });
  const [showGeneratedReview, setShowGeneratedReview] = useState(false);
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

  const handleGenerateReview = async () => {
    setReviewData({ ...reviewData, isLoading: true });
    try {
      const result = await generateReview(movieDetail);
      setReviewData({
        Title: result.Title,
        Introduction: result.Introduction,
        Review: result.Review,
        isGenerated: true,
        isLoading: false,
      });
      setShowGeneratedReview(true);
    } catch (error) {
      console.log("請稍後在試");
      setReviewData({ ...reviewData, isLoading: false });
    }
  };
  const handleChange = (show) => {
    setShowGeneratedReview(!show);
  }
  return (
    <>
      <div className={styles.resultWrapper}>
        {/* header */}
        <header className={styles.resultHeader}>
          <Button
            className={styles.customButton}
            type="primary"
            shape="round"
            size="large"
            onClick={handleGoBack}
          >
            Back
          </Button>
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
            <div className={styles.textContainer}>
              {reviewData.isGenerated ? (
                <Button onClick={() => handleChange(showGeneratedReview)}>
                  <SwapOutlined />
                </Button>
              ) : (
                <div></div>
              )}

              {/* 條件渲染，根據 reviewGenerated 狀態來決定渲染評論內容或影片資訊 */}
              {showGeneratedReview ? (
                <div className={styles.movieReviewContainer}>
                  <div className={styles.movieReview}>
                    <h3 className={styles.movieTitle}>{reviewData.Title}</h3>
                    <div className={styles.reviewIntroduction}>
                      <h3>Introduction：</h3> {reviewData.Introduction}
                    </div>
                    <div className={styles.reviewContent}>
                      <h3>Review：</h3>
                      {reviewData.Review}
                    </div>
                  </div>
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
        <footer className={styles.resultFooter}>
          {reviewData.isLoading ? (
            <Spin size="large" />
          ) : (
            <Button onClick={() => handleGenerateReview()}>
              {reviewData.isGenerated
                ? "Generate Another Review"
                : "Generate Review"}
            </Button>
          )}
        </footer>
      </div>
    </>
  );
};

const generateReview = async (movieDetail) => {
  try {
    const response = await axios.post("/api/generateReview", {
      movieDetail: movieDetail,
    });
    console.log(response);
    const { title, introduction, review } = response.data;
    return { Title: title, Introduction: introduction, Review: review };
  } catch (error) {
    console.error("Failed to generate review:", error);
    throw error; // 将错误重新抛出，以便在调用方处理
  }
};
export default MovieDetail;
