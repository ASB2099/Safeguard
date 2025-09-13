
import React from 'react';
import { Page } from '../types';
import Header from '../components/Header';

interface LocationScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  location: { lat: number; lng: number } | null;
  locationError: string | null;
  locationLoading: boolean;
  userLocation: { lat: number; lng: number };
}

const LocationScreen: React.FC<LocationScreenProps> = ({ navigateTo, theme, toggleTheme, location, locationError, locationLoading, userLocation }) => {

  const handleShareLocation = () => {
    const locationString = `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}`;
    alert(`Live location shared! (Simulated)\nYour current location: ${locationString}`);
  };

  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${userLocation.lng - 0.01},${userLocation.lat - 0.005},${userLocation.lng + 0.01},${userLocation.lat + 0.005}&layer=mapnik&marker=${userLocation.lat},${userLocation.lng}`;

  const LocationPinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500 dark:text-green-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="flex flex-col h-full bg-transparent">
      <Header title="My Location" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} />
      
      {locationError && (
        <div className="bg-red-100/80 dark:bg-green-900/50 backdrop-blur-md border-l-4 border-red-500 dark:border-green-600 text-red-700 dark:text-green-200 p-4 m-4 rounded-md animate-fadeIn" role="alert">
          <p className="font-bold">Location Error</p>
          <p className="text-sm">{locationError}</p>
        </div>
      )}

      <div className="flex-grow relative map-container">
        {locationLoading ? (
           <div className="w-full h-full flex flex-col items-center justify-center bg-white/60 dark:bg-black/60">
             <div className="relative flex items-center justify-center w-24 h-24">
                <div className="absolute w-full h-full rounded-full bg-green-500/20 dark:bg-green-500/20 animate-radar-scan"></div>
                <LocationPinIcon />
             </div>
             <p className="mt-4 text-black dark:text-white">Pinpointing your location...</p>
          </div>
        ) : (
          <iframe
            title="Map showing user location"
            src={mapUrl}
            className="absolute w-full h-full border-0"
          />
        )}
      </div>
      
      <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md p-4 border-t border-green-200/50 dark:border-green-900/50 transition-colors duration-500">
        <div className="text-center mb-4">
            <h3 className="font-bold text-lg text-black dark:text-white">{location ? "Your Current Location" : "Default Location"}</h3>
            <p className="text-sm text-black/70 dark:text-white/70">Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}</p>
        </div>
        <button
          onClick={handleShareLocation}
          className="flippable-button w-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-green-500/30 text-black dark:text-white font-bold py-3 px-6 rounded-xl text-md flex items-center justify-center shadow-colored-md hover:bg-white/30 dark:hover:bg-green-500/20 transition-all duration-500"
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