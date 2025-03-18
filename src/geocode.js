export const fetchCoordinates = async (city) => {
    try {
        const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=sv&format=json`
        );
        const data = await response.json();

        if (!data.results) {
            throw new Error("Platsen kunde inte hittas.");
        }

        const { latitude, longitude } = data.results[0];
        return { latitude, longitude };
    } catch (error) {
        console.error("Fel vid hämtning av koordinater:", error);
        return null;
    }
};