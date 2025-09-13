import React from 'react';
import { Page } from '../types';
import Header from '../components/Header';
import { USER_LOCATION } from '../constants';

interface LocationScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const LocationScreen: React.FC<LocationScreenProps> = ({ navigateTo, theme, toggleTheme }) => {
  const handleShareLocation = () => {
    const locationString = `Lat: ${USER_LOCATION.lat}, Lng: ${USER_LOCATION.lng}`;
    alert(`Live location shared! (Simulated)\nYour current location: ${locationString}`);
  };

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${USER_LOCATION.lng - 0.01},${USER_LOCATION.lat - 0.005},${USER_LOCATION.lng + 0.01},${USER_LOCATION.lat + 0.005}&layer=mapnik&marker=${USER_LOCATION.lat},${USER_LOCATION.lng}`;

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <Header title="My Location" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex-grow relative bg-gray-300 overflow-hidden">
        <iframe
          title="Map showing user location"
          src={mapUrl}
          className="absolute w-full h-full border-0"
        />
      </div>
      
      <div className="bg-white dark:bg-black p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-center mb-4">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Shaniwar Wada, Pune</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Lat: {USER_LOCATION.lat}, Lng: {USER_LOCATION.lng}</p>
        </div>
        <button
          onClick={handleShareLocation}
          className="w-full bg-green-500 dark:bg-red-500 text-white font-bold py-3 px-6 rounded-xl text-md flex items-center justify-center shadow-lg hover:bg-green-600 dark:hover:bg-red-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
          </svg>
          Share Live Location
        </button>
      </div>
    </div>
  );
};

export default LocationScreen;