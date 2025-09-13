import React, { useState, useEffect } from 'react';
import { Page, Service } from '../types';
import Header from '../components/Header';
import { getNearbyServices } from '../services/geminiService';

interface ServicesScreenProps {
  navigateTo: (page: Page) => void;
  viewServiceOnMap: (service: Service) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  userLocation: { lat: number; lng: number };
  locationLoading: boolean;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ navigateTo, viewServiceOnMap, theme, toggleTheme, userLocation, locationLoading }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!locationLoading) {
      setLoading(true);
      getNearbyServices(userLocation.lat, userLocation.lng)
        .then(setServices)
        .catch((err) => setError(err.message || "Could not fetch nearby services. Please try again later."))
        .finally(() => setLoading(false));
    }
  }, [userLocation, locationLoading]);

  const renderContent = () => {
    if (loading || locationLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="bg-white/60 dark:bg-black/60 border border-green-200/50 dark:border-green-900/50 p-4 rounded-xl shadow-colored-md flex items-center animate-pulse">
            <div className="p-3 bg-green-100/30 dark:bg-green-900/30 rounded-full mr-4 text-green-500/50 dark:text-green-400/50 animate-pulse-slow">
                <ServicesIcon />
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

    return services.map((service, index) => (
      <button 
        key={service.id} 
        onClick={() => viewServiceOnMap(service)}
        className="flippable-button group w-full bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-green-500/30 p-4 rounded-xl shadow-colored-md flex items-center justify-between text-left transition-all duration-500 ease-in-out hover:bg-white/30 dark:hover:bg-green-500/20 hover:shadow-colored-lg active:scale-95 animate-fadeInUp"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center">
            <div className="p-3 bg-green-100/80 dark:bg-green-900/50 rounded-full mr-4 text-green-500 dark:text-green-400 transition-transform duration-300 group-hover:scale-110">
                {getIconForServiceType(service.type)}
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
      <Header title="Nearby Services" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-black/70 dark:text-white/70 px-2 pb-2 animate-fadeIn">Select a service to view it on the map.</p>
        {renderContent()}
      </div>
    </div>
  );
};

const getIconForServiceType = (type: string) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('hospital')) return <HospitalIcon />;
    if (lowerType.includes('police')) return <PoliceIcon />;
    if (lowerType.includes('restaurant')) return <RestaurantIcon />;
    if (lowerType.includes('hotel')) return <HotelIcon />;
    if (lowerType.includes('pharmacy')) return <PharmacyIcon />;
    if (lowerType.includes('atm')) return <AtmIcon />;
    return <ServicesIcon />;
};

const HospitalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>;
const PoliceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v2h-2V5H6v2H4V5zm12 4a2 2 0 01-2 2H6a2 2 0 01-2-2V7h12v2zM4 13a2 2 0 012-2h8a2 2 0 012 2v2h-2v-2H6v2H4v-2z" clipRule="evenodd" /></svg>;
const RestaurantIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435A1 1 0 018 8V5a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 01-.119.467l-.74 4.435A1 1 0 0113.847 14H12a1 1 0 01-1-1v-1a1 1 0 011-1h.153a1 1 0 01.986.836l.245 1.469A2 2 0 0015.385 16H18a1 1 0 010 2H2a1 1 0 110-2h2.615a2 2 0 001.97-1.692l.246-1.469A1 1 0 018 11h.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.986 1.164H8a1 1 0 01-1-1v-1a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 01-.881.983l-1.436.24a1 1 0 01-1.159-.983l-.74-4.435A1 1 0 015.847 8H6a1 1 0 01-1-1V3z" /></svg>;
const HotelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>;
const PharmacyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12h10" /></svg>;
const AtmIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9.5A4.5 4.5 0 0112.5 14H12v4.5A4.5 4.5 0 017.5 14H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v2.5z" /></svg>;
const ServicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;

export default ServicesScreen;