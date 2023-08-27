import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useRouter } from "next/router";
import { normalTranslateText } from "../../utils/translateText";
import { useLanguage } from "../../context/LanguageContext";
const GoBackButton = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const {language,setLanguage} = useLanguage();
  const handleGoBack = () => {
    router.back();
  };
  useEffect(() => {}, [language]);
  const buttonStyle = {
    backgroundColor: isHovered ? "#ff4500" : "var(--yellow-color)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "18px",
    padding: "10px 20px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  };

  return (
    <Button
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleGoBack}
    >
      {normalTranslateText(language, "back")}
    </Button>
  );
};

export default GoBackButton;
