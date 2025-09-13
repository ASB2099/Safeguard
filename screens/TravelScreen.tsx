import React from 'react';
import { Page, TravelService } from '../types';
import Header from '../components/Header';
import { TRAVEL_SERVICES } from '../constants';

interface TravelScreenProps {
  navigateTo: (page: Page) => void;
  viewTravelOnMap: (service: TravelService) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const TravelScreen: React.FC<TravelScreenProps> = ({ navigateTo, viewTravelOnMap, theme, toggleTheme }) => {
  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <Header title="Travel Routes" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 px-2 pb-2 animate-fadeIn">Select a service to view the route on the map.</p>
        {TRAVEL_SERVICES.map((service, index) => (
          <button 
            key={service.id} 
            onClick={() => viewTravelOnMap(service)}
            className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between text-left transition-all duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md active:scale-95 animate-fadeInUp"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-red-900/50 rounded-full mr-4 text-green-500 dark:text-red-400">
                    {service.type === 'Bus Station' && <BusIcon />}
                    {service.type === 'Train Station' && <TrainIcon />}
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{service.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{service.type}</p>
                </div>
            </div>
             <div className="text-gray-400"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>
          </button>
        ))}
      </div>
    </div>
  );
};

const BusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18.56 6.44a.5.5 0 00-.56-.44H2a.5.5 0 00-.5.5v2a.5.5 0 00.5.5h16a.5.5 0 00.5-.5v-2zM2 11.5a.5.5 0 01.5-.5h15a.5.5 0 010 1H2.5a.5.5 0 01-.5-.5zM18 13a1 1 0 00-1-1H3a1 1 0 00-1 1v2a1 1 0 001 1h14a1 1 0 001-1v-2z" clipRule="evenodd" /></svg>;
const TrainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M18.5 3A1.5 1.5 0 0017 1.5H3A1.5 1.5 0 001.5 3v11A1.5 1.5 0 003 15.5h1.5a1.5 1.5 0 103 0H12.5a1.5 1.5 0 103 0H17A1.5 1.5 0 0018.5 14V3zM3 13.5V3h14v10.5h-1.092a3.001 3.001 0 00-5.816 0H4.092A3.001 3.001 0 003 13.5z" /><path d="M7 8a1 1 0 100-2 1 1 0 000 2zm6 0a1 1 0 100-2 1 1 0 000 2z" /></svg>;

export default TravelScreen;