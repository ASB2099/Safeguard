import React from 'react';
import { Page } from '../types';
import Header from '../components/Header';
import { USER_LOCATION, NEARBY_SERVICES } from '../constants';

interface SOSScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const SOSScreen: React.FC<SOSScreenProps> = ({ navigateTo, theme, toggleTheme }) => {
  // Combine user location and service locations for bounding box calculation
  const allLocations = [USER_LOCATION, ...NEARBY_SERVICES.map(s => s.location)];

  // Calculate a bounding box to fit all points
  const bounds = {
    minLat: Math.min(...allLocations.map(l => l.lat)),
    minLng: Math.min(...allLocations.map(l => l.lng)),
    maxLat: Math.max(...allLocations.map(l => l.lat)),
    maxLng: Math.max(...allLocations.map(l => l.lng)),
  };

  // Add some padding to the bounding box
  const padding = 0.01;
  const bbox = `${bounds.minLng - padding},${bounds.minLat - padding},${bounds.maxLng + padding},${bounds.maxLat + padding}`;

  // The map URL will center on the area containing all points and place a marker on the user's location.
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${USER_LOCATION.lat},${USER_LOCATION.lng}`;

  return (
    <div className="flex flex-col h-full bg-green-50 dark:bg-gray-900 animate-pulse-bg">
      <Header title="SOS Activated" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex-grow relative bg-gray-300 overflow-hidden">
        <iframe
          title="SOS Map with user and nearby services"
          src={mapUrl}
          className="absolute w-full h-full border-0"
        />
         <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/80 p-2 rounded-lg shadow-lg text-xs max-w-[150px]">
            <p className="font-bold text-green-600 dark:text-red-500">Your Location (Marker)</p>
            <p className="text-gray-700 dark:text-gray-300">Other icons are nearby services visible on the map.</p>
        </div>
      </div>
      
      <div className="bg-green-600 dark:bg-red-600 text-white p-4">
        <div className="text-center">
            <h3 className="font-bold text-lg">Help is on the way!</h3>
            <p className="text-sm text-green-100 dark:text-red-100">Nearby services have been informed.</p>
        </div>
        <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2 text-center">Notified Services:</h4>
            <ul className="text-xs space-y-1 text-center">
                {NEARBY_SERVICES.map(service => (
                    <li key={service.id}><strong>{service.name}</strong> ({service.type})</li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default SOSScreen;