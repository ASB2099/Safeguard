import React from 'react';
import { Page, TravelService } from '../types';
import Header from '../components/Header';

interface TravelMapScreenProps {
  navigateTo: (page: Page) => void;
  service: TravelService;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  location: { lat: number; lng: number } | null;
}

const TravelMapScreen: React.FC<TravelMapScreenProps> = ({ navigateTo, service, theme, toggleTheme, location }) => {
  
  if (!location) {
    return (
        <div className="flex flex-col h-full bg-gradient-page">
            <Header title="Error" onBack={() => navigateTo(Page.Travel)} theme={theme} toggleTheme={toggleTheme} page={Page.TravelMap} />
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="bg-red-100/80 dark:bg-red-900/50 backdrop-blur-md border-l-4 border-danger dark:border-danger-dark text-danger dark:text-danger-dark p-4 rounded-md" role="alert">
                  <p className="font-bold">Location Unavailable</p>
                  <p className="text-sm">Your location is required to display the map. Please enable location services and return to the previous screen.</p>
                </div>
            </div>
        </div>
    );
  }

  const handleGetDirections = () => {
    if (!location) return;
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${service.location.lat},${service.location.lng}`;
    window.open(directionsUrl, '_blank');
  };

  // The previous static map service was unreliable. We are switching to a more robust
  // interactive OpenStreetMap view, similar to the other map screens in the app.
  // We calculate a bounding box to ensure both the user and the destination are visible.

  const bounds = {
    minLat: Math.min(location.lat, service.location.lat),
    minLng: Math.min(location.lng, service.location.lng),
    maxLat: Math.max(location.lat, service.location.lat),
    maxLng: Math.max(location.lng, service.location.lng),
  };

  // Add some padding to the bounding box so markers aren't at the very edge of the map.
  const padding = 0.01;
  const bbox = `${bounds.minLng - padding},${bounds.minLat - padding},${bounds.maxLng + padding},${bounds.maxLat + padding}`;

  // This URL will show an embedded map focused on the area containing both points, with a marker on the destination.
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${service.location.lat},${service.location.lng}`;

  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title={service.name} onBack={() => navigateTo(Page.Travel)} theme={theme} toggleTheme={toggleTheme} page={Page.TravelMap} />
      
      <div className="flex-grow relative map-container">
        <iframe
          title={`Map showing route to ${service.name}`}
          src={mapUrl}
          className="absolute w-full h-full border-0"
        />
      </div>
      
      <div className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md p-4 border-t border-light-border dark:border-dark-border transition-colors duration-500">
        <div className="text-center mb-4">
            <h3 className="font-bold text-lg text-light-text dark:text-dark-text">{service.name}</h3>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{service.type}</p>
        </div>
        <button
          onClick={handleGetDirections}
          className="flippable-button w-full bg-travel-primary dark:bg-travel-primary-dark text-white dark:text-dark-bg font-bold py-3 px-6 rounded-xl text-md flex items-center justify-center shadow-md hover:bg-gray-700 dark:hover:bg-gray-400 transition-all duration-500"
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