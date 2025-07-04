import React, { useEffect, useState } from "react";
import logo from "../assets/mobileLogo.png";
import "./SplashScreen.css";

const SplashScreen = ({ onFinish }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHide(true);
      setTimeout(onFinish, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`splash-screen ${hide ? "hide" : ""}`}>
      <img src={logo} alt="Mister Mobile Logo" className="logo" />
    </div>
  );
};

export default SplashScreen;
