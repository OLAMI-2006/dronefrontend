import React, { useState, useEffect } from 'react';

export default function WeatherWidget({ onWeatherChange }) {
    const [weather, setWeather] = useState({
        temp: '29°C',
        condition: 'Light Showers / Humid',
        humidity: '85%',
        location: 'Lagos, Nigeria',
        isSevere: false
    });

    useEffect(() => {
        const nigerianConditions = [
            { temp: '28°C', condition: 'Light Showers / Humid', humidity: '88%', isSevere: false },
            { temp: '31°C', condition: 'Partly Cloudy', humidity: '75%', isSevere: false },
            { temp: '26°C', condition: 'Thunderstorm Warning', humidity: '92%', isSevere: true },
            { temp: '30°C', condition: 'Hazy / Clear Sky', humidity: '70%', isSevere: false },
            { temp: '27°C', condition: 'Heavy Tropical Rain', humidity: '95%', isSevere: true }
        ];

        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * nigerianConditions.length);
            const newWeather = nigerianConditions[randomIndex];
            setWeather(prev => ({ ...prev, ...newWeather }));

            // Pass the weather status back up to App.jsx
            if (onWeatherChange) {
                onWeatherChange(newWeather);
            }
        }, 12000);

        return () => clearInterval(interval);
    }, [onWeatherChange]);

    return (
        <div className={`border rounded-xl p-4 text-white shadow-lg flex items-center justify-between transition-colors duration-500 ${weather.isSevere ? 'bg-rose-950/40 border-rose-600/50' : 'bg-slate-900 border-slate-700'}`}>
            <div>
                <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">Flight Zone Weather</span>
                    {weather.isSevere && (
                        <span className="text-[10px] bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full border border-rose-500/40 font-bold animate-pulse">
              ADVISORY: GROUNDING ACTIVE
            </span>
                    )}
                </div>
                <h3 className="text-lg font-bold">{weather.location}</h3>
                <p className={`text-sm ${weather.isSevere ? 'text-rose-300 font-medium' : 'text-slate-300'}`}>{weather.condition}</p>
            </div>
            <div className="text-right">
                <span className="text-3xl font-extrabold text-blue-400">{weather.temp}</span>
                <p className="text-xs text-slate-400">Humidity: {weather.humidity}</p>
            </div>
        </div>
    );
}