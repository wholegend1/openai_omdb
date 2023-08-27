// utils/translateText.js
import translations from "../public/translations.json";

export const normalTranslateText = (language, path) => {
  const pathArray = path.split("."); 
  let value = translations[language];
  for (const key of pathArray) {
    value = value[key]; 
    if (!value) {
      break; 
    }
  }
  return value || path; 
};


