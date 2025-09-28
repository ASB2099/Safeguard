import React from 'react';
import { Page, SecureZone } from '../types';
import Header from '../components/Header';
import { useTranslation } from '../LanguageContext';

interface SecureZoneMapScreenProps {
  navigateTo: (page: Page) => void;
  zone: SecureZone;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  location: { lat: number; lng: number } | null;
}

const SecureZoneMapScreen: React.FC<SecureZoneMapScreenProps> = ({ navigateTo, zone, theme, toggleTheme, location }) => {
  const { t } = useTranslation();

  if (!location) {
    return (
        <div className="flex flex-col h-full bg-gradient-page">
            <Header title={t('error_title')} onBack={() => navigateTo(Page.SecureZones)} theme={theme} toggleTheme={toggleTheme} page={Page.SecureZoneMap} />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-red-100/80 dark:bg-red-900/50 backdrop-blur-md border-l-4 border-danger dark:border-danger-dark text-danger dark:text-danger-dark p-4 rounded-md" role="alert">
                  <p className="font-bold">{t('location_unavailable')}</p>
                  <p className="text-sm">{t('location_unavailable_message')}</p>
                </div>
            </div>
        </div>
    );
  }

  // Calculate a bounding box to fit both user and the secure zone
  const bounds = {
    minLat: Math.min(location.lat, zone.location.lat),
    minLng: Math.min(location.lng, zone.location.lng),
    maxLat: Math.max(location.lat, zone.location.lat),
    maxLng: Math.max(location.lng, zone.location.lng),
  };

  const padding = 0.01;
  const bbox = `${bounds.minLng - padding},${bounds.minLat - padding},${bounds.maxLng + padding},${bounds.maxLat + padding}`;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${zone.location.lat},${zone.location.lng}`;
  
  const handleGetDirections = () => {
    if (!location) return;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${zone.location.lat},${zone.location.lng}`;
    window.open(directionsUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title={zone.name} onBack={() => navigateTo(Page.SecureZones)} theme={theme} toggleTheme={toggleTheme} page={Page.SecureZoneMap} showLanguageSwitcher/>
      
      <div className="flex-grow relative map-container">
        <iframe
          title={`Map showing ${zone.name}`}
          src={mapUrl}
          className="absolute w-full h-full border-0"
        />
      </div>
      
      <div className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md p-4 border-t border-light-border dark:border-dark-border transition-colors duration-500">
        <div className="text-center mb-4">
            <h3 className="font-bold text-lg text-light-text dark:text-dark-text">{zone.name}</h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{zone.type}</p>
        </div>
        <button
          onClick={handleGetDirections}
          className="flippable-button w-full bg-secure-primary dark:bg-secure-primary-dark text-white dark:text-dark-bg font-bold py-3 px-6 rounded-xl text-md flex items-center justify-center shadow-md hover:bg-cyan-600 dark:hover:bg-cyan-500 transition-all duration-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {t('get_directions_button')}
        </button>
      </div>
    </div>
  );
};

export default SecureZoneMapScreen;
