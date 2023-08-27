// utils.js

export async function checkStoredReview(
  language,
  movieDetail,
  getStoredItem,
  translateData
) {
  const storedMovieReview = getStoredItem(
    `${language}_movieReview_${movieDetail.imdbID}`
  );

  console.log("Ready setReview");

  if (storedMovieReview) {
    const hasChineseContent =
      containsEnglish(storedMovieReview.Title) ||
      containsEnglish(storedMovieReview.Introduction) ||
      containsEnglish(storedMovieReview.Review);

    if (hasChineseContent && language==="tc") {
      const tc_translatedData = { ...storedMovieReview };

      if (
        containsEnglish(storedMovieReview.Title) &&
        !containsChinese(storedMovieReview.Title)
      ) {
        tc_translatedData.Title = await translateData(
          "Title",
          storedMovieReview.Title
        );
      }

      if (
        containsEnglish(storedMovieReview.Introduction) &&
        !containsChinese(storedMovieReview.Introduction)
      ) {
        tc_translatedData.Introduction = await translateData(
          "Introduction",
          storedMovieReview.Introduction
        );
      }

      if (
        containsEnglish(storedMovieReview.Review) &&
        !containsChinese(storedMovieReview.Review)
      ) {
        tc_translatedData.Review = await translateData(
          "Review",
          storedMovieReview.Review
        );
      }

      return {
        ...tc_translatedData,
        isGenerated: true,
        isLoading: false,
      };
    } else {
      return {
        ...storedMovieReview,
        isGenerated: true,
        isLoading: false,
      };
    }
  } else {
    return {
      isGenerated: false,
      isLoading: false,
    };
  }
}

function containsChinese(text) {
  const chinesePattern = /[\u4e00-\u9fa5]/; // 正则表达式匹配中文字符的范围
  return chinesePattern.test(text);
}

function containsEnglish(text) {
  const englishPattern = /[a-zA-Z]/; // 正则表达式匹配英文字符的范围
  return englishPattern.test(text);
}