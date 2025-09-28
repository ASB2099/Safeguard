import React, { useState, useEffect } from 'react';
import { Page, LocalGuide } from '../types';
import Header from '../components/Header';
import { getLocalGuides } from '../services/geminiService';
import { useTranslation } from '../LanguageContext';

interface LocalGuidesScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
  location: { lat: number; lng: number } | null;
  locationLoading: boolean;
  locationError: string | null;
}

const LocalGuidesScreen: React.FC<LocalGuidesScreenProps> = ({ navigateTo, theme, toggleTheme, location, locationLoading, locationError }) => {
  const [guides, setGuides] = useState<LocalGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useTranslation();

  useEffect(() => {
    if (location) {
      setLoading(true);
      getLocalGuides(location.lat, location.lng, language)
        .then(setGuides)
        .catch((err) => setError(t(err.message as any) || "Could not fetch local guides. Please try again later."))
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [location, language, t]);
  
  const handleContact = (number: string) => {
    window.location.href = `tel:${number}`;
  };

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

    return guides.map((guide, index) => (
      <div 
        key={guide.id} 
        className="group bg-light-surface dark:bg-dark-surface border border-light-border/80 dark:border-dark-border/80 p-4 rounded-xl shadow-md flex items-center justify-between text-left transition-all duration-300 hover:shadow-lg animate-fadeInUp"
        style={{ animationDelay: `${index * 100}ms` }}
      >
        <div className="flex items-start">
            <div className="p-3 bg-guide-primary/10 dark:bg-guide-primary-dark/20 rounded-full mr-4 mt-1 text-guide-primary dark:text-guide-primary-dark">
                <GuideIcon />
            </div>
            <div className='flex-1'>
                <h3 className="font-bold text-light-text dark:text-dark-text">{guide.name}</h3>
                <p className="text-sm font-semibold text-guide-primary dark:text-guide-primary-dark">{guide.specialty}</p>
                <p className="text-sm font-mono text-light-text-secondary dark:text-dark-text-secondary mt-1">{guide.contact}</p>
            </div>
        </div>
         <button
              onClick={() => handleContact(guide.contact)}
              className="bg-guide-primary dark:bg-guide-primary-dark text-white dark:text-dark-bg font-bold py-2 px-4 rounded-lg flex items-center shadow-md hover:bg-amber-700 dark:hover:bg-amber-600 transition-all duration-300 active:scale-95"
            >
                <CallIcon />
                <span className="ml-2 hidden sm:inline">{t('contact_button')}</span>
            </button>
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title={t('local_guides_title')} onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} page={Page.LocalGuides} showLanguageSwitcher/>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary px-2 pb-2 animate-fadeIn">
            {t('local_guides_description')}
        </p>
        {renderContent()}
      </div>
    </div>
  );
};

const GuideIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const CallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;

export default LocalGuidesScreen;
