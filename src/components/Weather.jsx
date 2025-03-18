import React, { useState, useEffect } from "react";
import "./Weather.css";

const Weather = ({ city, weatherData }) => {
    const [currentTime, setCurrentTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, "0");
            const minutes = now.getMinutes().toString().padStart(2, "0");
            setCurrentTime(`${hours}:${minutes}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000); // Uppdatera varje minut
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="weather-card">
            <h2>{city}</h2>
            <p className="local-time">🕒 {currentTime}</p>
            <p className="date">{weatherData.date}</p>
            <p className="temp">{weatherData.temp}°C</p>
            <div className="weather-icon">{weatherData.weatherIcon}</div>
        </div>
    );
};

export default Weather;