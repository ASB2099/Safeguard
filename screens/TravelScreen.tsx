import React, { useState, useEffect } from 'react';
import { Page, TravelService } from '../types';
import Header from '../components/Header';
import { getTravelRoutes } from '../services/geminiService';
import { useTranslation } from '../LanguageContext';

interface TravelScreenProps {
  navigateTo: (page: Page) => void;
  viewTravelOnMap: (service: TravelService) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  location: { lat: number; lng: number } | null;
  locationLoading: boolean;
  locationError: string | null;
}

const TravelScreen: React.FC<TravelScreenProps> = ({ navigateTo, viewTravelOnMap, theme, toggleTheme, location, locationLoading, locationError }) => {
  const [routes, setRoutes] = useState<TravelService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useTranslation();

  useEffect(() => {
    if (location) {
      setLoading(true);
      getTravelRoutes(location.lat, location.lng, language)
        .then(setRoutes)
        .catch((err) => setError(t(err.message as any) || "Could not fetch travel routes. Please try again later."))
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [location, language, t]);


  const renderContent = () => {
    if (loading || locationLoading) {
        return Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border p-4 rounded-xl shadow-md flex items-center animate-pulse">
                <div className="p-3 bg-gray-200 dark:bg-dark-border rounded-full mr-4 text-gray-400 dark:text-gray-500 animate-pulse-slow">
                    <TrainIcon />
                </div>
                <div className='w-full space-y-2'>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
            </div>
        ));
    }

    if (locationError) {
        return (
            <div className="bg-red-100/80 dark:bg-red-900/50 backdrop-blur-md border-l-4 border-danger dark:border-danger-dark text-danger dark:text-danger-dark p-4 rounded-md" role="alert">
              <p className="font-bold">{t('error_location')}</p>
              <p className="text-sm">{locationError}</p>
            </div>
        )
    }

    if (error) {
        return <div className="text-center p-4 text-red-500 dark:text-red-400">{error}</div>;
    }

    return routes.map((service, index) => (
      <button 
        key={service.id} 
        onClick={() => viewTravelOnMap(service)}
        className="flippable-button group w-full bg-light-surface dark:bg-dark-surface border border-light-border/80 dark:border-dark-border/80 p-4 rounded-xl shadow-md flex items-center justify-between text-left transition-all duration-500 ease-in-out hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:shadow-lg active:scale-95 animate-fadeInUp"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-center">
            <div className="p-3 bg-travel-primary/10 dark:bg-travel-primary-dark/20 rounded-full mr-4 text-travel-primary dark:text-travel-primary-dark transition-transform duration-300 group-hover:scale-110">
                {service.type.toLowerCase().includes('bus') ? <BusIcon /> : <TrainIcon />}
            </div>
            <div>
                <h3 className="font-bold text-light-text dark:text-dark-text">{service.name}</h3>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{service.type}</p>
            </div>
        </div>
          <div className="text-travel-primary/50 dark:text-travel-primary-dark/50"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>
      </button>
    ));
  };


  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title={t('travel_routes_title')} onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} page={Page.Travel} showLanguageSwitcher/>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary px-2 pb-2 animate-fadeIn">{t('select_route_to_view_on_map')}</p>
        {renderContent()}
      </div>
    </div>
  );
};

const BusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18.56 6.44a.5.5 0 00-.56-.44H2a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h16a.5.5 0 00.5-.5v-2zM2 11.5a.5.5 0 01.5-.5h15a.5.5 0 010 1H2.5a.5.5 0 01-.5-.5zM18 13a1 1 0 00-1-1H3a1 1 0 00-1 1v2a1 1 0 001 1h14a1 1 0 001-1v-2z" clipRule="evenodd" /></svg>;
const TrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M18.5 3A1.5 1.5 0 0017 1.5H3A1.5 1.5 0 001.5 3v11A1.5 1.5 0 003 15.5h1.5a1.5 1.5 0 103 0H12.5a1.5 1.5 0 103 0H17A1.5 1.5 0 0018.5 14V3zM3 13.5V3h14v10.5h-1.092a3.001 3.001 0 00-5.816 0H4.092A3.001 3.001 0 003 13.5z" /><path d="M7 8a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" /></svg>;

export default TravelScreen;
