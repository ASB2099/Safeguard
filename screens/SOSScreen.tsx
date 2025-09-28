import React, { useState, useEffect } from 'react';
import { Page, Service } from '../types';
import Header from '../components/Header';
import { getNearbyServices } from '../services/geminiService';
import { useTranslation } from '../LanguageContext';

interface SOSScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  location: { lat: number; lng: number } | null;
  locationLoading: boolean;
  locationError: string | null;
}

const SOSScreen: React.FC<SOSScreenProps> = ({ navigateTo, theme, toggleTheme, location, locationLoading, locationError }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, language } = useTranslation();

  useEffect(() => {
    if (location) {
        setLoading(true);
        
        const emergencyServiceKeywords = ['hospital', 'police', 'ambulance', 'medical'];

        getNearbyServices(location.lat, location.lng, language)
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
    } else {
        setLoading(false);
    }
  }, [location, language]);

  const mapUrl = location ? (() => {
      const allLocations = [location, ...services.map(s => s.location)];
      const bounds = {
        minLat: Math.min(...allLocations.map(l => l.lat)),
        minLng: Math.min(...allLocations.map(l => l.lng)),
        maxLat: Math.max(...allLocations.map(l => l.lat)),
        maxLng: Math.max(...allLocations.map(l => l.lng)),
      };
      const padding = 0.01;
      const bbox = `${bounds.minLng - padding},${bounds.minLat - padding},${bounds.maxLng + padding},${bounds.maxLat + padding}`;
      return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${location.lat},${location.lng}`;
  })() : '';
  
  const SOSIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

  return (
    <div className="flex flex-col h-full bg-danger dark:bg-danger animate-sos-bg-pulse transition-colors duration-500">
      <Header title={t('sos_activated_title')} onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} page={Page.SOS} />
      
      <div className="flex-grow relative map-container">
        {locationLoading ? (
             <div className="w-full h-full flex flex-col items-center justify-center bg-light-surface/60 dark:bg-dark-surface/60">
                <div className="relative w-24 h-24 rounded-full bg-danger animate-sos-pulse flex items-center justify-center">
                    <SOSIcon />
                </div>
                <p className="mt-4 text-light-text dark:text-dark-text">{t('sos_broadcasting_distress')}</p>
            </div>
        ) : location ? (
            <>
                <iframe
                title="SOS Map with user and nearby services"
                src={mapUrl}
                className="absolute w-full h-full border-0"
                />
                <div className="absolute top-2 right-2 bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-sm p-2 rounded-lg shadow-lg text-xs max-w-[150px]">
                    <p className="font-bold text-light-text dark:text-dark-text">{t('sos_map_user_location_info')}</p>
                    <p className="text-light-text-secondary dark:text-dark-text-secondary">{t('sos_map_services_info')}</p>
                </div>
            </>
        ) : (
             <div className="w-full h-full flex flex-col items-center justify-center bg-light-surface/60 dark:bg-dark-surface/60 p-4">
                 <div className="bg-red-100/80 dark:bg-red-900/50 backdrop-blur-md border-l-4 border-danger dark:border-danger-dark text-danger dark:text-danger-dark p-4 rounded-md" role="alert">
                  <p className="font-bold">{t('location_unavailable')}</p>
                  <p className="text-sm">{locationError}</p>
                </div>
            </div>
        )}
      </div>
      
      <div className="bg-danger-dark dark:bg-black/50 text-white p-4 transition-colors duration-500">
        <div className="text-center">
            <h3 className="font-bold text-lg">{t('sos_help_on_the_way')}</h3>
            <p className="text-sm text-red-100 dark:text-red-100">{t('sos_services_informed')}</p>
        </div>
        <div className="mt-4">
            <h4 className="font-semibold text-sm mb-2 text-center">{t('sos_notified_services')}</h4>
            <div className="text-xs space-y-1 text-center">
                {loading || locationLoading ? (
                    <div className="space-y-1">
                        <div className="h-3 bg-red-400/50 rounded w-3/4 mx-auto"></div>
                        <div className="h-3 bg-red-400/50 rounded w-1/2 mx-auto"></div>
                        <div className="h-3 bg-red-400/50 rounded w-2/3 mx-auto"></div>
                    </div>
                ) : services.length > 0 ? (
                    services.map(service => (
                        <div key={service.id}><strong>{service.name}</strong> ({service.type})</div>
                    ))
                ) : locationError ? (
                    <p>{t('sos_could_not_determine_services')}</p>
                ) : (
                    <p>{t('sos_no_services_found')}</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default SOSScreen;
