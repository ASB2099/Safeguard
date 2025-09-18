import React, { useState, useEffect } from 'react';
import { Page } from '../types';
import Header from '../components/Header';
import { getWeather } from '../services/geminiService';

interface HomeScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  userLocation: { lat: number; lng: number };
  locationLoading: boolean;
}

interface WeatherData {
  cityName: string;
  current: { temp: number; description: string; };
  hasAlert: boolean;
  alertDescription: string;
}

const WeatherAlert: React.FC<{ weather: WeatherData | null; loading: boolean; error: string | null; onNavigate: () => void }> = ({ weather, loading, error, onNavigate }) => {
    if (loading) {
        return (
            <div className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md rounded-xl p-3 flex items-center animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 mr-3"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        );
    }
    
    if (error || !weather) return null;

    if (!weather.hasAlert) {
        return (
            <button onClick={onNavigate} className="w-full text-left bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md rounded-xl p-3 flex items-center transition-all duration-300 hover:shadow-lg hover:bg-gray-50 dark:hover:bg-dark-surface/80">
                <WeatherIcon color="weather" />
                <div className="ml-3">
                    <p className="font-semibold text-sm text-light-text dark:text-dark-text">{weather.cityName}: {Math.round(weather.current.temp)}°C, {weather.current.description}</p>
                    <p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">View full forecast</p>
                </div>
            </button>
        );
    }
    
    return (
        <button onClick={onNavigate} className="w-full text-left bg-accent/80 dark:bg-accent-dark/80 backdrop-blur-md rounded-xl p-3 flex items-center transition-all duration-300 shadow-lg animate-pulse-bg-accent">
             <div className="text-yellow-600 dark:text-yellow-400"><AlertTriangleIcon /></div>
            <div className="ml-3 flex-1">
                <p className="font-bold text-sm text-light-text dark:text-dark-text">Weather Alert: {weather.cityName}</p>
                <p className="text-xs text-light-text dark:text-dark-text">{weather.alertDescription}</p>
            </div>
        </button>
    );
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigateTo, theme, toggleTheme, userLocation, locationLoading }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!locationLoading) {
      setWeatherLoading(true);
      getWeather(userLocation.lat, userLocation.lng)
        .then(setWeatherData)
        .catch((err) => setWeatherError(err.message))
        .finally(() => setWeatherLoading(false));
    }
  }, [userLocation, locationLoading]);

  const features = [
    { name: 'AI Assistant', page: Page.Chat, icon: <ChatIcon />, color: 'chat' },
    { name: 'My Location', page: Page.Location, icon: <LocationIcon />, color: 'location' },
    { name: 'Nearby Services', page: Page.Services, icon: <ServicesIcon />, color: 'location' },
    { name: 'Weather', page: Page.Weather, icon: <WeatherIcon color="weather" />, color: 'weather' },
    { name: 'Travel Routes', page: Page.Travel, icon: <TravelIcon />, color: 'travel' },
    { name: 'Secure Zones', page: Page.SecureZones, icon: <ShieldCheckIcon />, color: 'secure' },
    { name: 'Emergency Contacts', page: Page.EmergencyContacts, icon: <ContactsIcon />, color: 'contacts'},
    { name: 'Local Guides', page: Page.LocalGuides, icon: <GuideIcon />, color: 'guide' },
  ];

  const sosFeature = { name: 'Emergency SOS', page: Page.SOS, icon: <SOSIcon /> };
  
  const iconColorClasses = (color: string) => {
    switch (color) {
        case 'chat': return 'bg-chat-primary/10 text-chat-primary dark:bg-chat-primary-dark/20 dark:text-chat-primary-dark';
        case 'location': return 'bg-location-primary/10 text-location-primary dark:bg-location-primary-dark/20 dark:text-location-primary-dark';
        case 'weather': return 'bg-weather-primary/10 text-weather-primary dark:bg-weather-primary-dark/20 dark:text-weather-primary-dark';
        case 'travel': return 'bg-travel-primary/10 text-travel-primary dark:bg-travel-primary-dark/20 dark:text-travel-primary-dark';
        case 'prep': return 'bg-prep-primary/10 text-prep-primary dark:bg-prep-primary-dark/20 dark:text-prep-primary-dark';
        case 'secure': return 'bg-secure-primary/10 text-secure-primary dark:bg-secure-primary-dark/20 dark:text-secure-primary-dark';
        case 'contacts': return 'bg-contacts-primary/10 text-contacts-primary dark:bg-contacts-primary-dark/20 dark:text-contacts-primary-dark';
        case 'guide': return 'bg-guide-primary/10 text-guide-primary dark:bg-guide-primary-dark/20 dark:text-guide-primary-dark';
        default: return 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark';
    }
  }

  // FIX: Cast the style object to React.CSSProperties to allow for custom CSS properties like '--shadow-color', resolving a TypeScript type error.
  const shadowStyle = (color: string): React.CSSProperties => {
    const getShadowColor = () => {
      switch (color) {
          case 'chat': return theme === 'light' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(192, 132, 252, 0.3)';
          case 'location': return theme === 'light' ? 'rgba(20, 184, 166, 0.2)' : 'rgba(45, 212, 191, 0.3)';
          case 'weather': return theme === 'light' ? 'rgba(249, 115, 22, 0.2)' : 'rgba(251, 146, 60, 0.3)';
          case 'travel': return theme === 'light' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(129, 140, 248, 0.3)';
          case 'prep': return theme === 'light' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(74, 222, 128, 0.3)';
          case 'secure': return theme === 'light' ? 'rgba(6, 182, 212, 0.2)' : 'rgba(34, 211, 238, 0.3)';
          case 'contacts': return theme === 'light' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(148, 163, 184, 0.3)';
          case 'guide': return theme === 'light' ? 'rgba(217, 119, 6, 0.2)' : 'rgba(245, 158, 11, 0.3)';
          default: return theme === 'light' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(96, 165, 250, 0.3)';
      }
    }
    return { '--shadow-color': getShadowColor() } as React.CSSProperties;
  }


  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title="Dashboard" theme={theme} toggleTheme={toggleTheme} showDateTime />
      
      <div className="flex-grow flex flex-col p-4 gap-4 overflow-y-auto no-scrollbar">
        <div className="animate-fadeInUp" style={{ animationDelay: `100ms` }}>
          <WeatherAlert weather={weatherData} loading={weatherLoading} error={weatherError} onNavigate={() => navigateTo(Page.Weather)} />
        </div>

        <div className="animate-fadeInUp" style={{ animationDelay: `200ms` }}>
            <button
                onClick={() => navigateTo(Page.Preparedness)}
                className="w-full p-4 bg-prep-primary/10 dark:bg-prep-primary-dark/20 border-2 border-prep-primary/50 dark:border-prep-primary-dark/50 rounded-2xl shadow-colored-lg flex items-center justify-between text-left text-prep-primary dark:text-prep-primary-dark transition-all duration-300 hover:bg-prep-primary/20 dark:hover:bg-prep-primary-dark/30 active:scale-[0.98]"
                style={shadowStyle('prep')}
            >
                <div>
                    <h2 className="font-bold text-lg">Disaster Guides</h2>
                    <p className="text-sm">Prepare for earthquakes, floods & more</p>
                </div>
                <div className="flex -space-x-3">
                    <span className="w-8 h-8 rounded-full bg-light-surface dark:bg-dark-surface flex items-center justify-center ring-2 ring-prep-primary/20"><SmallEarthquakeIcon /></span>
                    <span className="w-8 h-8 rounded-full bg-light-surface dark:bg-dark-surface flex items-center justify-center ring-2 ring-prep-primary/20"><SmallFloodIcon /></span>
                    <span className="w-8 h-8 rounded-full bg-light-surface dark:bg-dark-surface flex items-center justify-center ring-2 ring-prep-primary/20"><SmallStormIcon /></span>
                </div>
            </button>
        </div>


        <div className="flex-grow">
          <div className="h-full grid grid-cols-2 md:grid-cols-4 gap-3">
            {features.map((feature, index) => (
              <button
                key={feature.name}
                onClick={() => navigateTo(feature.page)}
                className={`h-full min-h-[100px] flex flex-col items-center justify-center flippable-button group p-2 bg-light-surface dark:bg-dark-surface backdrop-blur-md rounded-2xl shadow-colored-md transition-all duration-500 ease-in-out hover:shadow-colored-lg active:scale-95 animate-fadeInUp border border-light-border/50 dark:border-dark-border/50 hover:bg-gray-50 dark:hover:bg-dark-surface/80`}
                style={{ ...shadowStyle(feature.color), animationDelay: `${(index + 3) * 100}ms` }}
              >
                <div className={`mx-auto mb-2 w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 group-hover:-rotate-6 ${iconColorClasses(feature.color)}`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-xs text-center text-light-text dark:text-dark-text transition-colors duration-500">{feature.name}</h3>
              </button>
            ))}
          </div>
        </div>

        <div className="animate-fadeInUp" style={{ animationDelay: `${(features.length + 3) * 100}ms` }}>
            <button 
                onClick={() => navigateTo(sosFeature.page)}
                className="w-full p-6 bg-danger dark:bg-danger-dark rounded-2xl shadow-colored-lg flex flex-col items-center justify-center text-white dark:text-dark-bg font-bold text-center text-lg transition-transform active:scale-95 animate-pulse transition-colors duration-500"
                style={{ '--shadow-color': theme === 'light' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(248, 113, 113, 0.4)' } as React.CSSProperties}
            >
                <div className="mb-2">{sosFeature.icon}</div>
                {sosFeature.name}
            </button>
        </div>
      </div>
    </div>
  );
};

// SVG Icons
const ChatIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ServicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const WeatherIcon: React.FC<{color: string}> = ({ color }) => <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 text-${color}-primary dark:text-${color}-primary-dark`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const TravelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1zM21 11.243l-2-2.016v-3.23a1 1 0 00-1-1h-6a1 1 0 00-1 1v5.472l2 2.016a1 1 0 00.707.293h4.586a1 1 0 00.707-.293z" /></svg>;
const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const SOSIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ContactsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const GuideIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const SmallEarthquakeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16M8 4l4 4 4-4M8 20l4-4 4 4" /></svg>;
const SmallFloodIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-3.333 4-8 4-8 4s4.667 0 8 4c3.333-4 8-4 8-4s-4.667 0-8-4zm0 0V4m0 4c-3.333 4-8 4-8 4s4.667 0 8 4c3.333-4 8-4 8-4s-4.667 0-8-4zm0 0v4" /></svg>;
const SmallStormIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;

export default HomeScreen;