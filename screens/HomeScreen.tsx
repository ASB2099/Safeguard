import React from 'react';
import { Page } from '../types';
import Header from '../components/Header';

interface HomeScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigateTo, theme, toggleTheme }) => {
    const handleSOS = () => {
        alert("SOS Activated! The nearby services have been informed, help is on its way.");
        navigateTo(Page.SOS);
    };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C203A]">
      <Header title="Safeguard">
          <button onClick={toggleTheme} className="text-gray-800 dark:text-white p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
      </Header>
      <div className="flex-grow bg-[#F1F3F6] dark:bg-gray-900 rounded-t-[40px] p-6 space-y-4 overflow-y-auto">
        
        <button 
            onClick={handleSOS}
            className="w-full bg-red-600 text-white font-bold py-5 px-6 rounded-2xl text-xl flex items-center justify-center shadow-lg hover:bg-red-700 transition-transform transform hover:scale-105 duration-300 mb-4"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            SOS
        </button>

        <div className="grid grid-cols-2 gap-4">
            <MenuButton icon={<SupportIcon />} label="Support Chat" onClick={() => navigateTo(Page.Chat)} />
            <MenuButton icon={<LocationIcon />} label="My Location" onClick={() => navigateTo(Page.Location)} />
            <MenuButton icon={<ServicesIcon />} label="Nearby Services" onClick={() => navigateTo(Page.Services)} />
            <MenuButton icon={<WeatherIcon />} label="Weather" onClick={() => navigateTo(Page.Weather)} />
        </div>

        <div className="space-y-4">
            <MenuButtonWide icon={<RouteIcon />} label="Travel Routes" onClick={() => navigateTo(Page.Travel)} />
            <MenuButtonWide icon={<ShieldIcon />} label="Disaster Preparedness" onClick={() => navigateTo(Page.Preparedness)} />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 mt-2 shadow">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2">Quick Tip</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Always keep a digital copy of your passport and important documents.</p>
        </div>

      </div>
    </div>
  );
};

const MenuButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md flex flex-col items-center justify-center space-y-2 text-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform transform hover:-translate-y-1 duration-300">
        <div className="text-[#F95C5C]">{icon}</div>
        <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{label}</span>
    </button>
);

const MenuButtonWide: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
    <button onClick={onClick} className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md flex items-center text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-transform transform hover:-translate-y-1 duration-300">
        <div className="text-[#F95C5C] pr-4">{icon}</div>
        <span className="font-semibold text-gray-700 dark:text-gray-200">{label}</span>
    </button>
);


const SunIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;

const SupportIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const ServicesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
const WeatherIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const RouteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>;
const ShieldIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;

export default HomeScreen;