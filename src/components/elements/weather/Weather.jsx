import React, { useState, useEffect } from 'react';
import './weather.scss';

const Weather = () => {
    const [city, setCity] = useState('Bielefeld'); 
    const [temperature, setTemperature] = useState(null);
    const [humidity, setHumidity] = useState(null);
    const [description, setDescription] = useState('');
    const [icon, setIcon] = useState(''); 
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=62f9e42b03d163507b0cdb56d144e489&units=metric`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }
                const data = await response.json();
                setTemperature(data.main.temp);
                setHumidity(data.main.humidity);
                setDescription(data.weather[0].description);
                setIcon(data.weather[0].icon); 
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, [city]);

    const handleCityChange = (e) => {
        setCity(e.target.value);
    };

    return (
        <div className='row'>
            <div className="weather-widget">
            <div className="city-selector">
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={handleCityChange}
                    className="city-input"
                />
            
            </div>

            {error ? (
                <p className="error">Error: {error}</p>
            ) : (
                <div className="weather-info">
                    <h2>Weather in {city}</h2>
                    <img
                        src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                        alt={description}
                        className="weather-icon"
                    />
                    <p>Temperature: {temperature}°C</p>
                    <p>Humidity: {humidity}%</p>
                    <p>Description: {description}</p>
                </div>
            )}
        </div>
        </div>
    );
};

export default Weather;
