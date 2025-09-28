import React from 'react';
import { Page } from '../types';
import Header from '../components/Header';
import { useTranslation } from '../LanguageContext';

interface LocationScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  location: { lat: number; lng: number } | null;
  locationError: string | null;
  locationLoading: boolean;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ navigateTo, theme, toggleTheme, location, locationError, locationLoading }) => {
  const { t } = useTranslation();

  const handleShareLocation = () => {
    if (!location) return;
    const locationString = `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`;
    alert(`Live location shared! (Simulated)\nYour current location: ${locationString}`);
  };

  const mapUrl = location ? `https://www.openstreetmap.org/export/embed.html?bbox=${location.lng - 0.01},${location.lat - 0.005},${location.lng + 0.01},${location.lat + 0.005}&layer=mapnik&marker=${location.lat},${location.lng}`: '';

  const LocationPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-location-primary dark:text-location-primary-dark" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title={t('my_location_title')} onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} page={Page.Location} showLanguageSwitcher/>
      
      {locationError && (
        <div className="bg-red-100/80 dark:bg-red-900/50 backdrop-blur-md border-l-4 border-danger dark:border-danger-dark text-danger dark:text-danger-dark p-4 m-4 rounded-md animate-fadeIn" role="alert">
          <p className="font-bold">{t('error_location')}</p>
          <p className="text-sm">{locationError}</p>
        </div>
      )}

      <div className="flex-grow relative map-container">
        {locationLoading ? (
           <div className="w-full h-full flex flex-col items-center justify-center bg-light-surface/60 dark:bg-dark-surface/60">
             <div className="relative flex items-center justify-center w-24 h-24" style={{'--scan-color': theme === 'light' ? 'rgba(20, 184, 166, 0.4)' : 'rgba(45, 212, 191, 0.4)'} as React.CSSProperties}>
                <div className="absolute w-full h-full rounded-full bg-location-primary/20 dark:bg-location-primary-dark/20 animate-radar-scan"></div>
                <LocationPinIcon />
             </div>
             <p className="mt-4 text-light-text dark:text-dark-text">Pinpointing your location...</p>
          </div>
        ) : location ? (
          <iframe
            title="Map showing user location"
            src={mapUrl}
            className="absolute w-full h-full border-0"
          />
        ) : null}
      </div>
      
      <div className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md p-4 border-t border-light-border dark:border-dark-border transition-colors duration-500">
        <div className="text-center mb-4">
            <h3 className="font-bold text-lg text-light-text dark:text-dark-text">{location ? t('your_current_location') : t('location_unavailable')}</h3>
            {location && <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}</p>}
        </div>
        <button
          onClick={handleShareLocation}
          disabled={!location}
          className="flippable-button w-full bg-location-primary dark:bg-location-primary-dark text-white dark:text-dark-bg font-bold py-3 px-6 rounded-xl text-md flex items-center justify-center shadow-md hover:bg-teal-600 dark:hover:bg-teal-500 transition-all duration-500 disabled:bg-gray-400 dark:disabled:bg-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          {t('share_live_location_button')}
        </button>
      </div>
    </div>
  );
};

export default LocationScreen;
