import React,{useState} from "react";
import { Button } from "antd";
import { useRouter } from "next/router";
const GoBackButton = () => {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const handleGoBack = () => {
    router.back();
  };
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
      Back
    </Button>
  );
};

export default GoBackButton;
