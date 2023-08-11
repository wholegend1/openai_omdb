import React from "react";
import { Button } from "antd";
import { useLanguage } from "../../context/LanguageContext";

const LanguageButton = () => {
  const handleSetLanguage = () => {
    setLanguage(language === "en" ? "tc" : "en");
  };
  const { language, setLanguage } = useLanguage();
  return (
    <Button type="primary" onClick={handleSetLanguage}>
      {language === "en" ? "English" : "中文"}
    </Button>
  );
};

export default LanguageButton;
