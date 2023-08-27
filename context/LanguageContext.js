import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();

export const useLanguage = () => {
  return useContext(LanguageContext);
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en"); // 設定預設語言值

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}
