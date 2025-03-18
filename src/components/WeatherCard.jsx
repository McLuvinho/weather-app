import React from "react";
import "./WeatherCard.css";
import weatherIcons from "../assets/weatherIcons.js";

const WeatherCard = ({ city, temp, weather }) => {
  return (
    <div className="weather-card">
      <h2 className="city-name">{city}</h2>
      <div className="weather-info">
        <span className="weather-icon">{weatherIcons[weather] || "❓"}</span>
        <p className="temperature">{temp}°C</p>
      </div>
    </div>
  );
};

export default WeatherCard;