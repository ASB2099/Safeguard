import React from 'react';
import { Page, SecureZone } from '../types';
import Header from '../components/Header';

interface SecureZoneMapScreenProps {
  navigateTo: (page: Page) => void;
  zone: SecureZone;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  userLocation: { lat: number; lng: number };
}

const SecureZoneMapScreen: React.FC<SecureZoneMapScreenProps> = ({ navigateTo, zone, theme, toggleTheme, userLocation }) => {
  // Calculate a bounding box to fit both user and the secure zone
  const bounds = {
    minLat: Math.min(userLocation.lat, zone.location.lat),
    minLng: Math.min(userLocation.lng, zone.location.lng),
    maxLat: Math.max(userLocation.lat, zone.location.lat),
    maxLng: Math.max(userLocation.lng, zone.location.lng),
  };

  const padding = 0.01;
  const bbox = `${bounds.minLng - padding},${bounds.minLat - padding},${bounds.maxLng + padding},${bounds.maxLat + padding}`;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${zone.location.lat},${zone.location.lng}`;
  
  const handleGetDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${zone.location.lat},${zone.location.lng}`;
    window.open(directionsUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title={zone.name} onBack={() => navigateTo(Page.SecureZones)} theme={theme} toggleTheme={toggleTheme} page={Page.SecureZoneMap} />
      
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
          Get Directions
        </button>
      </div>
    </div>
  );
};

export default SecureZoneMapScreen;