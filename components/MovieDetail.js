// MovieDetail.js
import { useEffect, useState } from "react";
import { Image, Button, Spin } from "antd";
import { TrophyOutlined, SwapOutlined } from "@ant-design/icons";
import styles from "../styles/MovieDetail.module.css";
import axios from "axios";
import GoBackButton from "./button/GoBackButton";
import LanguageButton from "./button/LanguageButton";
import { getStoredItem, setStoredItem } from "../utils/localStorageUtils";
import { normalTranslateText } from "../utils/translateText";
import { translateData } from "../utils/translateData";
import { checkStoredReview } from "../utils/checkStoredReview";

const MovieDetail = ({ language, movieDetail }) => {
  const [reviewData, setReviewData] = useState({
    Title: "",
    Introduction: "",
    Review: "",
    isGenerated: false,
    isLoading: false,
  });
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    async function fetchAndCheckReview() {
      if (isFetching) {
        return; 
      }

      setIsFetching(true); 

      try {
        const reviewData = await checkStoredReview(
          language,
          movieDetail,
          getStoredItem,
          translateData
        );
        setReviewData(reviewData);
        setShowGeneratedReview(reviewData.isGenerated);
      } catch (error) {
        // 错误处理
      } finally {
        setIsFetching(false); // 请求完成后重置为非请求状态
      }
    }

    fetchAndCheckReview();
  }, [language, movieDetail.imdbID]);
  const [showGeneratedReview, setShowGeneratedReview] = useState(false);
  if (movieDetail.Poster === "N/A") {
    movieDetail.Poster = "/image-not-found-icon.svg";
  }
  const {
    imdbID,
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
      const result = await generateReview(
        language,
        movieDetail,
        reviewData.isGenerated
      );
      console.log("result", result);
      setReviewData({
        Title: result.Title,
        Introduction: result.Introduction,
        Review: result.Review,
        isGenerated: true,
        isLoading: false,
      });
      setShowGeneratedReview(true);
    } catch (error) {
      console.error("handleGenerateReview", error);
      console.log("請稍後在試");
      setReviewData({ ...reviewData, isLoading: false });
    }
  };
  const handleChange = (show) => {
    setShowGeneratedReview(!show);
  };
  return (
    <>
      <div className={styles.resultWrapper}>
        {/* header */}
        <header className={styles.resultHeader}>
          <div className={styles.buttonGroup}>
            <GoBackButton />
            <LanguageButton />
          </div>
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
                      <h3>
                        {normalTranslateText(language, "review.introduction")}：
                      </h3>
                      {reviewData.Introduction}
                    </div>
                    <div className={styles.reviewContent}>
                      <h3>
                        {normalTranslateText(language, "review.review")}：
                      </h3>
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
                ? normalTranslateText(language, "anotherGenerateReview")
                : normalTranslateText(language, "generateReview")}
            </Button>
          )}
        </footer>
      </div>
    </>
  );
};
const generateAndStoreReview = async (id, language) => {
  try {
    const en_movieDetail = getStoredItem(`en_movie_${id}`);
    const response = await axios
      .post("/api/generateReview", {
        movieDetail: en_movieDetail,
      })
      .then((res) => res.data);

    setStoredItem(`${language}_movieReview_${id}`, {
      Title: response.Title,
      Introduction: response.Introduction,
      Review: response.Review,
    });
    const en_Review = getStoredItem(`en_movieReview_${id}`);
    const tc_translatedData = {
      Title: await translateData("Title", en_Review.Title),
      Introduction: await translateData("Introduction", en_Review.Introduction),
      Review: await translateData("Review", en_Review.Review),
    };

    setStoredItem(`tc_movieReview_${id}`, tc_translatedData);
    if (language === "tc") {
      response.Title = tc_translatedData.Title;
      response.Introduction = tc_translatedData.Introduction;
      response.Review = tc_translatedData.Review;
    }

    return response;
  } catch (error) {
    console.error("Error", error);
    if (error.message.includes("generateReview")) {
      alert("生成評論出現錯誤，請稍後在試");
    } else if (error.message.includes("translateData")) {
      alert("翻譯數據出錯中文暫無翻譯按下切換語言鍵即可重新翻譯，請稍後在試");
      alert("提示:不要快速切換");
    } else {
      alert("發生未知錯誤，請稍後在試");
    }
    throw error;
  }
};
const generateReview = async (language, movieDetail, forceGenerated) => {
  let id = movieDetail.imdbID;
  console.log("forceGenerated", forceGenerated);

  if (forceGenerated) {
    const response = await generateAndStoreReview(id, language);

    return response;
  } else {
    const storedMovieReview = getStoredItem(`${language}_movieReview_${id}`);
    if (storedMovieReview) {
      return {
        Title: storedMovieReview.Title,
        Introduction: storedMovieReview.Introduction,
        Review: storedMovieReview.Review,
      };
    } else {
      const response = await generateAndStoreReview(id, language);
      return response;
    }
  }
};
export default MovieDetail;
