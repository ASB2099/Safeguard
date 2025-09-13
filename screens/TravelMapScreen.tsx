import React from 'react';
import { Page, TravelService } from '../types';
import Header from '../components/Header';
import { USER_LOCATION } from '../constants';

interface TravelMapScreenProps {
  navigateTo: (page: Page) => void;
  service: TravelService;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const TravelMapScreen: React.FC<TravelMapScreenProps> = ({ navigateTo, service, theme, toggleTheme }) => {
  
  const handleGetDirections = () => {
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${USER_LOCATION.lat},${USER_LOCATION.lng}&destination=${service.location.lat},${service.location.lng}`;
    window.open(directionsUrl, '_blank');
  };

  // The previous static map service was unreliable. We are switching to a more robust
  // interactive OpenStreetMap view, similar to the other map screens in the app.
  // We calculate a bounding box to ensure both the user and the destination are visible.

  const bounds = {
    minLat: Math.min(USER_LOCATION.lat, service.location.lat),
    minLng: Math.min(USER_LOCATION.lng, service.location.lng),
    maxLat: Math.max(USER_LOCATION.lat, service.location.lat),
    maxLng: Math.max(USER_LOCATION.lng, service.location.lng),
  };

  // Add some padding to the bounding box so markers aren't at the very edge of the map.
  const padding = 0.01;
  const bbox = `${bounds.minLng - padding},${bounds.minLat - padding},${bounds.maxLng + padding},${bounds.maxLat + padding}`;

  // This URL will show an embedded map focused on the area containing both points, with a marker on the destination.
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${service.location.lat},${service.location.lng}`;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <Header title={service.name} onBack={() => navigateTo(Page.Travel)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex-grow relative bg-gray-300 overflow-hidden">
        <iframe
          title={`Map showing route to ${service.name}`}
          src={mapUrl}
          className="absolute w-full h-full border-0"
        />
      </div>
      
      <div className="bg-white dark:bg-black p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center mb-4">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">{service.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{service.type}</p>
        </div>
        <button
          onClick={handleGetDirections}
          className="w-full bg-green-500 dark:bg-red-500 text-white font-bold py-3 px-6 rounded-xl text-md flex items-center justify-center shadow-lg hover:bg-green-600 dark:hover:bg-red-600 transition-colors"
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

export default TravelMapScreen;