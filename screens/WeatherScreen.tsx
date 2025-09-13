import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import Header from '../components/Header';
import { getWeather } from '../services/geminiService';

interface WeatherScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  userLocation: { lat: number; lng: number };
  locationLoading: boolean;
}

interface WeatherData {
  cityName: string;
  current: {
    temp: number;
    description: string;
    feelsLike: number;
  };
  forecast: {
    time: string;
    temp: number;
    description: string;
  }[];
}

const WeatherScreen: React.FC<WeatherScreenProps> = ({ navigateTo, theme, toggleTheme, userLocation, locationLoading }) => {
  const [disasterAlert] = useState(true); // This can be driven by API in future
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    if (!locationLoading) {
      setLoading(true);
      getWeather(userLocation.lat, userLocation.lng)
        .then(setWeatherData)
        .catch((err) => setError(err.message || "Could not fetch weather data. Please try again later."))
        .finally(() => setLoading(false));
    }
  }, [userLocation, locationLoading]);

  const getWeatherIcon = (description: string, large = false) => {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear')) return <SunIcon large={large} />;
    if (desc.includes('cloud')) return <CloudIcon large={large} />;
    if (desc.includes('moon') || desc.includes('night')) return <MoonIcon large={large} />;
    return <CloudIcon large={large} />;
  };

  const renderLoadingState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent py-10 opacity-70">
      <div className="relative w-40 h-40">
        <div className="absolute top-0 left-0 text-green-500 dark:text-red-500">
          <SunIcon large />
        </div>
        <div className="absolute top-8 left-4 text-green-400 dark:text-red-400">
           <CloudIcon large />
        </div>
      </div>
      <p className="mt-4 text-lg text-black dark:text-white animate-pulse">Forecasting the skies...</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-transparent">
      <Header title="Weather" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex-grow rounded-t-[40px] p-6 overflow-y-auto transition-colors duration-500">
        {disasterAlert && (
          <div className="bg-green-500/80 dark:bg-red-500/80 backdrop-blur-md border-l-4 border-green-700 dark:border-red-700 text-white p-4 rounded-lg mb-6 shadow-colored-lg animate-pulse-bg animate-fadeIn">
            <div className="flex">
              <div className="py-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <div>
                <p className="font-bold">Weather Alert</p>
                <p className="text-sm">Heavy monsoon rains expected. Avoid travel near rivers and low-lying areas.</p>
              </div>
            </div>
          </div>
        )}

        {loading || locationLoading ? renderLoadingState() : error ? <div className="text-center p-4 text-red-500 dark:text-red-400">{error}</div> : weatherData && (
            <>
                <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-white/30 dark:border-red-500/30 rounded-2xl p-6 text-center shadow-colored-md mb-6 animate-fadeInUp transition-colors duration-500" style={{animationDelay: '100ms'}}>
                    <p className="text-black/70 dark:text-white/70">{weatherData.cityName}</p>
                    <p className="text-sm text-black/70 dark:text-white/70 mt-1">{currentDate}</p>
                    <div className="flex items-center justify-center my-4">
                        <div className="text-green-500 dark:text-red-500 mr-4 transition-colors duration-500">{getWeatherIcon(weatherData.current.description, true)}</div>
                        <h1 className="text-6xl font-bold text-black dark:text-white">{Math.round(weatherData.current.temp)}°C</h1>
                    </div>
                    <p className="font-semibold text-black dark:text-white">{weatherData.current.description}</p>
                    <p className="text-sm text-black/70 dark:text-white/70">Feels like {Math.round(weatherData.current.feelsLike)}°C</p>
                </div>

                <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md border border-white/30 dark:border-red-500/30 rounded-2xl p-6 shadow-colored-md animate-fadeInUp transition-colors duration-500" style={{animationDelay: '200ms'}}>
                    <h3 className="font-bold text-black dark:text-white mb-4">Upcoming Forecast</h3>
                    <div className="flex justify-between overflow-x-auto -mx-6 px-6">
                        {weatherData.forecast.map((item, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2 flex-shrink-0 px-2">
                                <p className="text-sm font-semibold text-black/70 dark:text-white/70">{item.time}</p>
                                <div className={`text-2xl transition-colors duration-500 text-green-500 dark:text-red-400`}>{getWeatherIcon(item.description)}</div>
                                <p className="font-bold text-black dark:text-white">{Math.round(item.temp)}°</p>
                            </div>
                        ))}
                    </div>
                </div>
            </>
        )}

      </div>
    </div>
  );
};

const SunIcon: React.FC<{ large?: boolean }> = ({ large }) => <svg xmlns="http://www.w3.org/2000/svg" className={`${large ? "h-16 w-16" : "h-8 w-8"} animate-spin-slow`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={large? 1.5 : 2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const CloudIcon: React.FC<{ large?: boolean }> = ({ large }) => <svg xmlns="http://www.w3.org/2000/svg" className={`${large ? "h-16 w-16" : "h-8 w-8"} animate-bob`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={large? 1.5 : 2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const MoonIcon: React.FC<{ large?: boolean }> = ({ large }) => <svg xmlns="http://www.w3.org/2000/svg" className={`${large ? "h-16 w-16" : "h-8 w-8"} animate-wobble`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={large? 1.5 : 2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;

export default WeatherScreen;