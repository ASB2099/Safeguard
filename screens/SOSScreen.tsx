
import React, { useState, useEffect } from 'react';
import { Page, Service } from '../types';
import Header from '../components/Header';
import { getNearbyServices } from '../services/geminiService';

interface SOSScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  userLocation: { lat: number; lng: number };
  locationLoading: boolean;
}

const SOSScreen: React.FC<SOSScreenProps> = ({ navigateTo, theme, toggleTheme, userLocation, locationLoading }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locationLoading) {
        setLoading(true);
        
        const emergencyServiceKeywords = ['hospital', 'police', 'ambulance', 'medical'];

        getNearbyServices(userLocation.lat, userLocation.lng)
            .then(allServices => {
                const emergencyServices = allServices.filter(service => 
                    emergencyServiceKeywords.some(keyword => 
                        service.type.toLowerCase().includes(keyword)
                    )
                );
                setServices(emergencyServices);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }
  }, [userLocation, locationLoading]);


  const allLocations = [userLocation, ...services.map(s => s.location)];
  const bounds = {
    minLat: Math.min(...allLocations.map(l => l.lat)),
    minLng: Math.min(...allLocations.map(l => l.lng)),
    maxLat: Math.max(...allLocations.map(l => l.lat)),
    maxLng: Math.max(...allLocations.map(l => l.lng)),
  };

  const padding = 0.01;
  const bbox = `${bounds.minLng - padding},${bounds.minLat - padding},${bounds.maxLng + padding},${bounds.maxLat + padding}`;
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${userLocation.lat},${userLocation.lng}`;
  
  const SOSIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

  return (
    <div className="flex flex-col h-full bg-transparent animate-pulse-bg transition-colors duration-500">
      <Header title="SOS Activated" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex-grow relative map-container">
        {locationLoading ? (
             <div className="w-full h-full flex flex-col items-center justify-center bg-white/60 dark:bg-black/60">
                <div className="relative w-24 h-24 rounded-full bg-red-500 animate-sos-pulse flex items-center justify-center">
                    <SOSIcon />
                </div>
                <p className="mt-4 text-black dark:text-white">Broadcasting distress signal...</p>
            </div>
        ) : (
            <>
                <iframe
                title="SOS Map with user and nearby services"
                src={mapUrl}
                className="absolute w-full h-full border-0"
                />
                <div className="absolute top-2 right-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm p-2 rounded-lg shadow-lg text-xs max-w-[150px]">
                    <p className="font-bold text-green-600 dark:text-green-500">Your Location (Marker)</p>
                    <p className="text-gray-700 dark:text-white/80">Other icons are nearby services visible on the map.</p>
                </div>
            </>
        )}
      </div>
      
      <div className="bg-green-600 dark:bg-green-600 text-white p-4 transition-colors duration-500">
        <div className="text-center">
            <h3 className="font-bold text-lg">Help is on the way!</h3>
            <p className="text-sm text-green-100 dark:text-green-100">Emergency services have been informed.</p>
        </div>
        <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2 text-center">Notified Services:</h4>
            <div className="text-xs space-y-1 text-center">
                {loading ? (
                    <div className="space-y-1">
                        <div className="h-3 bg-green-400/50 rounded w-3/4 mx-auto"></div>
                        <div className="h-3 bg-green-400/50 rounded w-1/2 mx-auto"></div>
                        <div className="h-3 bg-green-400/50 rounded w-2/3 mx-auto"></div>
                    </div>
                ) : services.length > 0 ? (
                    services.map(service => (
                        <div key={service.id}><strong>{service.name}</strong> ({service.type})</div>
                    ))
                ) : (
                    <p>No immediate emergency services found nearby.</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SOSScreen;