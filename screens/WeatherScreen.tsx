import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import Header from '../components/Header';
import { getWeather } from '../services/geminiService';
import { useTranslation } from '../LanguageContext';

interface WeatherScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  location: { lat: number; lng: number } | null;
  locationLoading: boolean;
  locationError: string | null;
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

const WeatherScreen: React.FC<WeatherScreenProps> = ({ navigateTo, theme, toggleTheme, location, locationLoading, locationError }) => {
  const [disasterAlert] = useState(true); // This can be driven by API in future
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language, locale } = useTranslation();

  const currentDate = new Date().toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    if (location) {
      setLoading(true);
      getWeather(location.lat, location.lng, language)
        .then(setWeatherData)
        .catch((err) => setError(t(err.message as any) || "Could not fetch weather data. Please try again later."))
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [location, language, t]);

  const getWeatherIcon = (description: string, large = false) => {
    const desc = description.toLowerCase();
    if (desc.includes('sun') || desc.includes('clear') || desc.includes('धूप') || desc.includes('साफ़')) return <SunIcon large={large} />;
    if (desc.includes('cloud') || desc.includes('बादल')) return <CloudIcon large={large} />;
    if (desc.includes('moon') || desc.includes('night') || desc.includes('चाँद') || desc.includes('रात')) return <MoonIcon large={large} />;
    return <CloudIcon large={large} />;
  };

  const renderLoadingState = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent py-10 opacity-70">
      <div className="relative w-40 h-40">
        <div className="absolute top-0 left-0 text-weather-primary dark:text-weather-primary-dark">
          <SunIcon large />
        </div>
        <div className="absolute top-8 left-4 text-weather-primary/70 dark:text-weather-primary-dark/70">
           <CloudIcon large />
        </div>
      </div>
      <p className="mt-4 text-lg text-light-text dark:text-dark-text animate-pulse">{t('forecasting_the_skies')}</p>
    </div>
  );
  
  const renderErrorState = (errorMessage: string | null) => (
    <div className="bg-red-100/80 dark:bg-red-900/50 backdrop-blur-md border-l-4 border-danger dark:border-danger-dark text-danger dark:text-danger-dark p-4 rounded-md" role="alert">
        <p className="font-bold">{t('error_title')}</p>
        <p className="text-sm">{errorMessage}</p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title={t('weather_title')} onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} page={Page.Weather} showLanguageSwitcher/>
      
      <div className="flex-grow rounded-t-[40px] p-6 overflow-y-auto transition-colors duration-500">
        {disasterAlert && (
          <div className="bg-accent/80 dark:bg-accent-dark/80 backdrop-blur-md border-l-4 border-yellow-600 dark:border-yellow-400 text-light-text dark:text-dark-text p-4 rounded-lg mb-6 shadow-colored-lg animate-pulse-bg-accent animate-fadeIn" style={{ '--shadow-color': theme === 'light' ? 'rgba(250, 204, 21, 0.3)' : 'rgba(253, 224, 71, 0.4)' } as React.CSSProperties}>
            <div className="flex">
              <div className="py-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <div>
                <p className="font-bold">{t('weather_alert')}</p>
                <p className="text-sm">{t('heavy_monsoon_warning')}</p>
              </div>
            </div>
          </div>
        )}

        {loading || locationLoading ? renderLoadingState() : locationError ? renderErrorState(locationError) : error ? renderErrorState(error) : weatherData && (
            <>
                <div className="bg-light-surface dark:bg-dark-surface backdrop-blur-md border border-light-border dark:border-dark-border rounded-2xl p-6 text-center shadow-md mb-6 animate-fadeInUp transition-colors duration-500" style={{animationDelay: '200ms'}}>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">{weatherData.cityName}</p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">{currentDate}</p>
                    <div className="flex items-center justify-center my-4">
                        <div className="text-weather-primary dark:text-weather-primary-dark mr-4 transition-colors duration-500">{getWeatherIcon(weatherData.current.description, true)}</div>
                        <h1 className="text-6xl font-bold text-light-text dark:text-dark-text">{Math.round(weatherData.current.temp)}°C</h1>
                    </div>
                    <p className="font-semibold text-light-text dark:text-dark-text">{weatherData.current.description}</p>
                    <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('feels_like')} {Math.round(weatherData.current.feelsLike)}°C</p>
                </div>

                <div className="bg-light-surface dark:bg-dark-surface backdrop-blur-md border border-light-border dark:border-dark-border rounded-2xl p-6 shadow-md animate-fadeInUp transition-colors duration-500" style={{animationDelay: '400ms'}}>
                    <h3 className="font-bold text-light-text dark:text-dark-text mb-4">{t('upcoming_forecast')}</h3>
                    <div className="flex justify-between overflow-x-auto -mx-6 px-6">
                        {weatherData.forecast.map((item, index) => (
                            <div key={index} className="flex flex-col items-center space-y-2 flex-shrink-0 px-2">
                                <p className="text-sm font-semibold text-light-text-secondary dark:text-dark-text-secondary">{item.time}</p>
                                <div className={`text-2xl transition-colors duration-500 text-weather-primary dark:text-weather-primary-dark`}>{getWeatherIcon(item.description)}</div>
                                <p className="font-bold text-light-text dark:text-dark-text">{Math.round(item.temp)}°</p>
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