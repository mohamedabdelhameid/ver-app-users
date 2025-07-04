import { useState, useEffect } from "react";
import './LIGHT&DARK.css';

const ThemeSwitch = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem("darkmode") === "active");

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bodyDark");
      localStorage.setItem("darkmode", "active");
    } else {
      document.body.classList.remove("bodyDark");
      localStorage.setItem("darkmode", "inactive");
    }
  }, [darkMode]);

  return (
    <span id="theme_switch">
      <input
        type="checkbox"
        className="checkbox"
        id="checkbox"
        hidden
        checked={darkMode}
        onChange={() => setDarkMode(!darkMode)}
      />
      <label htmlFor="checkbox" className="checkbox-label">
        <i className="fas fa-moon"></i>
        <i className="fas fa-sun"></i>
        <span className="ball"></span>
      </label>
    </span>
  );
};

export default ThemeSwitch;
