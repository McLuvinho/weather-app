export const fetchWeatherData = async (latitude, longitude) => {
    try {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=Europe/Stockholm`
        );
        const data = await response.json();
        return {
            temp: Math.round(data.current_weather.temperature),
            weatherCode: data.current_weather.weathercode
        };
    } catch (error) {
        console.error("Fel vid hämtning av väderdata:", error);
        return null;
    }
};