import React from 'react';
import DateTimeDisplay from './DateTimeDisplay';
import { Page } from '../types';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  children?: React.ReactNode;
  theme?: 'light' | 'dark';
  toggleTheme?: (event: React.MouseEvent) => void;
  showDateTime?: boolean;
  page?: Page;
}

const getPageColorClasses = (page?: Page) => {
    switch(page) {
        case Page.Chat:
            return 'text-chat-primary dark:text-chat-primary-dark hover:bg-chat-primary/10 dark:hover:bg-chat-primary-dark/10';
        case Page.Location:
        case Page.Services:
        case Page.ServiceMap:
            return 'text-location-primary dark:text-location-primary-dark hover:bg-location-primary/10 dark:hover:bg-location-primary-dark/10';
        case Page.Weather:
            return 'text-weather-primary dark:text-weather-primary-dark hover:bg-weather-primary/10 dark:hover:bg-weather-primary-dark/10';
        case Page.Travel:
        case Page.TravelMap:
            return 'text-travel-primary dark:text-travel-primary-dark hover:bg-travel-primary/10 dark:hover:bg-travel-primary-dark/10';
        case Page.Preparedness:
            return 'text-prep-primary dark:text-prep-primary-dark hover:bg-prep-primary/10 dark:hover:bg-prep-primary-dark/10';
        case Page.SecureZones:
        case Page.SecureZoneMap:
            return 'text-secure-primary dark:text-secure-primary-dark hover:bg-secure-primary/10 dark:hover:bg-secure-primary-dark/10';
        case Page.EmergencyContacts:
            return 'text-contacts-primary dark:text-contacts-primary-dark hover:bg-contacts-primary/10 dark:hover:bg-contacts-primary-dark/10';
        case Page.LocalGuides:
            return 'text-guide-primary dark:text-guide-primary-dark hover:bg-guide-primary/10 dark:hover:bg-guide-primary-dark/10';
        case Page.SOS:
            return 'text-danger dark:text-danger-dark hover:bg-danger/10 dark:hover:bg-danger-dark/10';
        default:
            return 'text-primary dark:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10';
    }
}

const Header: React.FC<HeaderProps> = ({ title, onBack, children, theme, toggleTheme, showDateTime = false, page }) => {
  const colorClasses = getPageColorClasses(page);
  
  return (
    <div className="bg-light-surface/80 dark:bg-dark-surface/80 backdrop-blur-md p-5 pt-8 flex items-center justify-between z-10 border-b border-light-border dark:border-dark-border transition-colors duration-500">
      <div className="flex items-center space-x-4">
        {onBack && (
          <button onClick={onBack} className={`rounded-full p-1 transition-colors duration-300 ${colorClasses}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-2xl font-bold text-light-text dark:text-dark-text">{title}</h1>
      </div>
      <div className="flex items-center">
        {children}
        {showDateTime && <DateTimeDisplay />}
        {toggleTheme && theme && (
            <button onClick={(e) => toggleTheme(e)} className="p-2 rounded-full text-primary dark:text-primary-dark hover:bg-primary/10 dark:hover:bg-primary-dark/10 transition-colors duration-300">
                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
            </button>
        )}
      </div>
    </div>
  );
};

const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;


export default Header;