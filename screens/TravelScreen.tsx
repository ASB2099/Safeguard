import React, { useState, useEffect } from 'react';
import { Page, TravelService } from '../types';
import Header from '../components/Header';
import { getTravelRoutes } from '../services/geminiService';

interface TravelScreenProps {
  navigateTo: (page: Page) => void;
  viewTravelOnMap: (service: TravelService) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  userLocation: { lat: number; lng: number };
  locationLoading: boolean;
}

const TravelScreen: React.FC<TravelScreenProps> = ({ navigateTo, viewTravelOnMap, theme, toggleTheme, userLocation, locationLoading }) => {
  const [routes, setRoutes] = useState<TravelService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationLoading) {
      setLoading(true);
      getTravelRoutes(userLocation.lat, userLocation.lng)
        .then(setRoutes)
        .catch((err) => setError(err.message || "Could not fetch travel routes. Please try again later."))
        .finally(() => setLoading(false));
    }
  }, [userLocation, locationLoading]);


  const renderContent = () => {
    if (loading || locationLoading) {
        return Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-white/60 dark:bg-black/60 border border-green-200/50 dark:border-green-900/50 p-4 rounded-xl shadow-colored-md flex items-center animate-pulse">
                <div className="p-3 bg-green-100/30 dark:bg-green-900/30 rounded-full mr-4 text-green-500/50 dark:text-green-400/50 animate-pulse-slow">
                    <TrainIcon />
                </div>
                <div className='w-full space-y-2'>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        ));
    }
    if (error) {
        return <div className="text-center p-4 text-red-500 dark:text-green-400">{error}</div>;
    }

    return routes.map((service, index) => (
      <button 
        key={service.id} 
        onClick={() => viewTravelOnMap(service)}
        className="flippable-button group w-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-green-500/30 p-4 rounded-xl shadow-colored-md flex items-center justify-between text-left transition-all duration-500 ease-in-out hover:bg-white/30 dark:hover:bg-green-500/20 hover:shadow-colored-lg active:scale-95 animate-fadeInUp"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center">
            <div className="p-3 bg-green-100/80 dark:bg-green-900/50 rounded-full mr-4 text-green-500 dark:text-green-400 transition-transform duration-300 group-hover:scale-110">
                {service.type === 'Bus Station' && <BusIcon />}
                {service.type === 'Train Station' && <TrainIcon />}
            </div>
            <div>
                <h3 className="font-bold text-black dark:text-white">{service.name}</h3>
                <p className="text-sm text-black/70 dark:text-white/70">{service.type}</p>
            </div>
        </div>
          <div className="text-green-400 dark:text-green-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>
      </button>
    ));
  };


  return (
    <div className="flex flex-col h-full bg-transparent">
      <Header title="Travel Routes" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-black/70 dark:text-white/70 px-2 pb-2 animate-fadeIn">Select a service to view the route on the map.</p>
        {renderContent()}
      </div>
    </div>
  );
};

const BusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18.56 6.44a.5.5 0 00-.56-.44H2a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h16a.5.5 0 00.5-.5v-2zM2 11.5a.5.5 0 01.5-.5h15a.5.5 0 010 1H2.5a.5.5 0 01-.5-.5zM18 13a1 1 0 00-1-1H3a1 1 0 00-1 1v2a1 1 0 001 1h14a1 1 0 001-1v-2z" clipRule="evenodd" /></svg>;
const TrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M18.5 3A1.5 1.5 0 0017 1.5H3A1.5 1.5 0 001.5 3v11A1.5 1.5 0 003 15.5h1.5a1.5 1.5 0 103 0H12.5a1.5 1.5 0 103 0H17A1.5 1.5 0 0018.5 14V3zM3 13.5V3h14v10.5h-1.092a3.001 3.001 0 00-5.816 0H4.092A3.001 3.001 0 003 13.5z" /><path d="M7 8a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" /></svg>;

export default TravelScreen;