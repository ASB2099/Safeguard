import React from 'react';
import { Page, Service } from '../types';
import Header from '../components/Header';
import { NEARBY_SERVICES } from '../constants';

interface ServicesScreenProps {
  navigateTo: (page: Page) => void;
  viewServiceOnMap: (service: Service) => void;
}

const ServicesScreen: React.FC<ServicesScreenProps> = ({ navigateTo, viewServiceOnMap }) => {
  return (
    <div className="flex flex-col h-full bg-[#F1F3F6] dark:bg-gray-900">
      <Header title="Nearby Services" onBack={() => navigateTo(Page.Home)} />
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 px-2 pb-2">Select a service to view it on the map.</p>
        {NEARBY_SERVICES.map(service => (
          <button 
            key={service.id} 
            onClick={() => viewServiceOnMap(service)}
            className="w-full bg-white dark:bg-gray-800 p-4 rounded-xl shadow flex items-center justify-between text-left transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-95"
          >
            <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-gray-700 rounded-full mr-4 text-[#F95C5C]">
                    {service.type === 'Hospital' && <HospitalIcon />}
                    {service.type === 'Police' && <PoliceIcon />}
                    {service.type === 'Restaurant' && <RestaurantIcon />}
                    {service.type === 'Hotel' && <HotelIcon />}
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 dark:text-gray-100">{service.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{service.type}</p>
                </div>
            </div>
             <div className="text-gray-400 dark:text-gray-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>
          </button>
        ))}
      </div>
    </div>
  );
};

const HospitalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>;
const PoliceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v2h-2V5H6v2H4V5zm12 4a2 2 0 01-2 2H6a2 2 0 01-2-2V7h12v2zM4 13a2 2 0 012-2h8a2 2 0 012 2v2h-2v-2H6v2H4v-2z" clipRule="evenodd" /></svg>;
const RestaurantIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435A1 1 0 018 8V5a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 01-.119.467l-.74 4.435A1 1 0 0113.847 14H12a1 1 0 01-1-1v-1a1 1 0 011-1h.153a1 1 0 01.986.836l.245 1.469A2 2 0 0015.385 16H18a1 1 0 010 2H2a1 1 0 110-2h2.615a2 2 0 001.97-1.692l.246-1.469A1 1 0 018 11h.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.986 1.164H8a1 1 0 01-1-1v-1a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 01-.881.983l-1.436.24a1 1 0 01-1.159-.983l-.74-4.435A1 1 0 015.847 8H6a1 1 0 01-1-1V3z" /></svg>;
const HotelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>;

export default ServicesScreen;
