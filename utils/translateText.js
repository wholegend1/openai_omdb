// utils/translateText.js
import translations from "../public/translations.json";

export const normalTranslateText = (language, text) => {
  return translations[language][text] || text;
};

export const movieTranslateText = (language, text) => {
  return translations[language][text] || text;
};

