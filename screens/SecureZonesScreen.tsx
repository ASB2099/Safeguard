import React, { useState, useEffect } from 'react';
import { Page, SecureZone } from '../types';
import Header from '../components/Header';
import { getSecureZones } from '../services/geminiService';
import { useTranslation } from '../LanguageContext';

interface SecureZonesScreenProps {
  navigateTo: (page: Page) => void;
  viewSecureZoneOnMap: (zone: SecureZone) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  location: { lat: number; lng: number } | null;
  locationLoading: boolean;
  locationError: string | null;
}

const SecureZonesScreen: React.FC<SecureZonesScreenProps> = ({ navigateTo, viewSecureZoneOnMap, theme, toggleTheme, location, locationLoading, locationError }) => {
  const [zones, setZones] = useState<SecureZone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useTranslation();

  useEffect(() => {
    if (location) {
      setLoading(true);
      getSecureZones(location.lat, location.lng, language)
        .then(setZones)
        .catch((err) => setError(t(err.message as any) || "Could not fetch secure zones. Please try again later."))
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [location, language, t]);

  const renderContent = () => {
    if (loading || locationLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border p-4 rounded-xl shadow-md animate-pulse">
            <div className='w-full space-y-3'>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
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

    return zones.map((zone, index) => (
      <button 
        key={zone.id} 
        onClick={() => viewSecureZoneOnMap(zone)}
        className="flippable-button group w-full bg-light-surface dark:bg-dark-surface border border-light-border/80 dark:border-dark-border/80 p-4 rounded-xl shadow-md flex items-center justify-between text-left transition-all duration-500 ease-in-out hover:bg-gray-50 dark:hover:bg-dark-surface/80 hover:shadow-lg active:scale-95 animate-fadeInUp"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-start">
            <div className="p-3 bg-secure-primary/10 dark:bg-secure-primary-dark/20 rounded-full mr-4 mt-1 text-secure-primary dark:text-secure-primary-dark transition-transform duration-300 group-hover:scale-110">
                <ShieldCheckIcon />
            </div>
            <div className='flex-1'>
                <h3 className="font-bold text-light-text dark:text-dark-text">{zone.name}</h3>
                <p className="text-sm font-semibold text-secure-primary dark:text-secure-primary-dark">{zone.type}</p>
                <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mt-1">{zone.description}</p>
            </div>
        </div>
          <div className="text-secure-primary/50 dark:text-secure-primary-dark/50"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>
      </button>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title={t('secure_zones_title')} onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} page={Page.SecureZones} showLanguageSwitcher/>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary px-2 pb-2 animate-fadeIn">{t('secure_zones_description')}</p>
        {renderContent()}
      </div>
    </div>
  );
};

const ShieldCheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export default SecureZonesScreen;
