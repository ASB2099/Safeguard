
import React from 'react';
import { Page, Service } from '../types';
import Header from '../components/Header';

interface ServiceMapScreenProps {
  navigateTo: (page: Page) => void;
  service: Service;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  userLocation: { lat: number; lng: number };
}

const ServiceMapScreen: React.FC<ServiceMapScreenProps> = ({ navigateTo, service, theme, toggleTheme, userLocation }) => {
  // Calculate a bounding box to try and fit both user and service
  const bounds = {
    minLat: Math.min(userLocation.lat, service.location.lat),
    minLng: Math.min(userLocation.lng, service.location.lng),
    maxLat: Math.max(userLocation.lat, service.location.lat),
    maxLng: Math.max(userLocation.lng, service.location.lng),
  };

  // Add some padding to the bounding box
  const padding = 0.01;
  const bbox = `${bounds.minLng - padding},${bounds.minLat - padding},${bounds.maxLng + padding},${bounds.maxLat + padding}`;

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${service.location.lat},${service.location.lng}`;
  
  const handleGetDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${service.location.lat},${service.location.lng}`;
    window.open(directionsUrl, '_blank');
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <Header title={service.name} onBack={() => navigateTo(Page.Services)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex-grow relative map-container">
        <iframe
          title={`Map showing ${service.name}`}
          src={mapUrl}
          className="absolute w-full h-full border-0"
        />
      </div>
      
      <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md p-4 border-t border-green-200/50 dark:border-red-900/50 transition-colors duration-500">
        <div className="text-center mb-4">
            <h3 className="font-bold text-lg text-black dark:text-white">{service.name}</h3>
            <p className="text-sm text-black/70 dark:text-white/70">{service.type}</p>
        </div>
        <button
          onClick={handleGetDirections}
          className="flippable-button w-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-red-500/30 text-black dark:text-white font-bold py-3 px-6 rounded-xl text-md flex items-center justify-center shadow-colored-md hover:bg-white/30 dark:hover:bg-red-500/20 transition-all duration-500"
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

export default ServiceMapScreen;