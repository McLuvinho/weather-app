import React, { useEffect, useState } from "react";
import Weather from "./components/Weather";
import SearchBar from "./components/SearchBar";
import { fetchCoordinates } from "./geocode";
import weatherIcons from "./assets/weatherIcons";
import "./App.css";

const CITIES = ["Stockholm", "Göteborg", "Malmö"];

const fetchWeatherData = async (latitude, longitude, days = 1) => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,weathercode&timezone=Europe/Stockholm`
        );
        const data = await response.json();

        return data.daily.temperature_2m_max.slice(0, days).map((temp, index) => ({
            temp: Math.round(temp),  // Dagens max-temp
            weatherCode: data.daily.weathercode[index],
            date: new Date(Date.now() + index * 86400000).toISOString().split("T")[0]
        }));
    } catch (error) {
        console.error("Fel vid hämtning av väderdata:", error);
        return null;
    }
};

// Hämtar den aktuella temperaturen
const fetchCurrentTemperature = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Stockholm`
        );
        const data = await response.json();

        return data.current_weather ? Math.round(data.current_weather.temperature) : null;
    } catch (error) {
        console.error("Fel vid hämtning av aktuell temperatur:", error);
        return null;
    }
};

// Hämtar lokal tid via Open-Meteo
const fetchLocalTime = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Stockholm`
        );
        const data = await response.json();
        return data.current_weather
            ? new Date(data.current_weather.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "N/A";
    } catch (error) {
        console.error("Fel vid hämtning av lokal tid:", error);
        return "N/A";
    }
};

const App = () => {
    const [weatherData, setWeatherData] = useState({});
    const [localTimes, setLocalTimes] = useState({});
    const [searchedCity, setSearchedCity] = useState("");

    useEffect(() => {
        const fetchWeather = async () => {
            const newWeatherData = {};
            const newLocalTimes = {};

            for (const city of CITIES) {
                const coordinates = await fetchCoordinates(city);
                if (coordinates) {
                    const weatherArray = await fetchWeatherData(coordinates.latitude, coordinates.longitude, 1);
                    const currentTemp = await fetchCurrentTemperature(coordinates.latitude, coordinates.longitude);
                    const localTime = await fetchLocalTime(coordinates.latitude, coordinates.longitude);

                    console.log(currentTemp);
                    
                    if (weatherArray) {
                        newWeatherData[city] = weatherArray.map((day) => ({
                            city,
                            temp: day.temp,
                            currentTemp, // Nu hämtas aktuell temperatur separat
                            weatherIcon: weatherIcons[day.weatherCode] || "❓",
                            date: day.date
                        }));
                        newLocalTimes[city] = localTime;
                    }
                }
            }

            setWeatherData(newWeatherData);
            setLocalTimes(newLocalTimes);
        };

        fetchWeather();
    }, []);

    const handleSearch = async (city) => {
        setSearchedCity(city);
        const coordinates = await fetchCoordinates(city);
        if (coordinates) {
            const weatherArray = await fetchWeatherData(coordinates.latitude, coordinates.longitude, 5);
            const currentTemp = await fetchCurrentTemperature(coordinates.latitude, coordinates.longitude);
            const localTime = await fetchLocalTime(coordinates.latitude, coordinates.longitude);

            if (weatherArray) {
                setWeatherData({
                    [city]: weatherArray.map((day) => ({
                        city,
                        temp: day.temp,
                        currentTemp, // Nu hämtas aktuell temperatur separat
                        weatherIcon: weatherIcons[day.weatherCode] || "❓",
                        date: day.date
                    }))
                });
                setLocalTimes({ [city]: localTime });
            }
        }
    };

    return (
        <div className="container">
            <h1 className="title">Hitta din väderprognos</h1>
            <SearchBar onSearch={handleSearch} />
            <div className="weather-cards">
                {Object.keys(weatherData).map((city) =>
                    weatherData[city].map((day, index) => (
                        <Weather
                            key={`${city}-${index}`}
                            city={city}
                            weatherData={day}
                            localTime={localTimes[city]}
                            currentTemp={day.currentTemp} // Skickar aktuell temperatur till Weather
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default App;