import React, { useState } from "react";
import "./SearchBar.css";

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState("");

    const handleSearch = () => {
        if (city.trim() !== "") {
            onSearch(city);
            setCity("");
        }
    };

    return (
        <div className="search-bar">
            <input
                type="text"
                placeholder="Sök stad..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
            />
            <button onClick={handleSearch}>Sök</button>
        </div>
    );
};

export default SearchBar;