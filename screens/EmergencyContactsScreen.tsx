import React from 'react';
import { Page } from '../types';
import Header from '../components/Header';

interface EmergencyContactsScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
}

// FIX: Moved icon component definitions to the top of the file before they are used to prevent "used before its declaration" errors.
// Icons
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const PoliceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1z" /><path fillRule="evenodd" d="M4 5a2 2 0 012-2h8a2 2 0 012 2v2h-2V5H6v2H4V5zm12 4a2 2 0 01-2 2H6a2 2 0 01-2-2V7h12v2zM4 13a2 2 0 012-2h8a2 2 0 012 2v2h-2v-2H6v2H4v-2z" clipRule="evenodd" /></svg>;
const FireIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c2.5 2.5 4 6.5 4 8.5 0 2.5-2 4.5-4 4.5s-4-2-4-4.5c0-2 1.5-6 4-8.5z" /><path d="M8.5 14.5c0 2.5 2 4.5 3.5 4.5s3.5-2 3.5-4.5" /></svg>;
const AmbulanceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" /></svg>;
const DisasterIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ForestIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.874 15.126c2.348 1.565 5.292 2.348 8.126 2.348s5.778-.783 8.126-2.348M12 21V12m0 0a4 4 0 100-8 4 4 0 000 8zm-7.126 3.126A10 10 0 1119.126 15.126" /></svg>;
const TowingIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2-2h8a1 1 0 001-1zM21 11.243l-2-2.016v-3.23a1 1 0 00-1-1h-6a1 1 0 00-1 1v5.472l2 2.016a1 1 0 00.707.293h4.586a1 1 0 00.707-.293z" /></svg>;
const CallIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;

const contacts = [
  { name: 'National Emergency Number', number: '112', icon: <AlertTriangleIcon />, color: 'danger' },
  { name: 'Police', number: '100', icon: <PoliceIcon />, color: 'primary' },
  { name: 'Fire Department', number: '101', icon: <FireIcon />, color: 'weather-primary' },
  { name: 'Ambulance / Medical', number: '102', icon: <AmbulanceIcon />, color: 'prep-primary' },
  { name: 'Disaster Management', number: '108', icon: <DisasterIcon />, color: 'contacts-primary' },
  { name: 'Forest Ranger / Rescue', number: '1926', icon: <ForestIcon />, color: 'prep-primary' },
  { name: 'Towing Services (Highway)', number: '1033', icon: <TowingIcon />, color: 'travel-primary' },
];

const EmergencyContactsScreen: React.FC<EmergencyContactsScreenProps> = ({ navigateTo, theme, toggleTheme }) => {

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  const getIconColorClass = (color: string) => {
      switch(color) {
          case 'danger': return 'bg-danger/10 text-danger dark:bg-danger-dark/20 dark:text-danger-dark';
          case 'primary': return 'bg-primary/10 text-primary dark:bg-primary-dark/20 dark:text-primary-dark';
          case 'weather-primary': return 'bg-weather-primary/10 text-weather-primary dark:bg-weather-primary-dark/20 dark:text-weather-primary-dark';
          case 'prep-primary': return 'bg-prep-primary/10 text-prep-primary dark:bg-prep-primary-dark/20 dark:text-prep-primary-dark';
          case 'contacts-primary': return 'bg-contacts-primary/10 text-contacts-primary dark:bg-contacts-primary-dark/20 dark:text-contacts-primary-dark';
          case 'travel-primary': return 'bg-travel-primary/10 text-travel-primary dark:bg-travel-primary-dark/20 dark:text-travel-primary-dark';
          default: return 'bg-gray-100 text-gray-800';
      }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title="Emergency Contacts" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} page={Page.EmergencyContacts} />
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary px-2 pb-2 animate-fadeIn">
            Nationwide emergency numbers for India. Tap to call.
        </p>
        
        {contacts.map((contact, index) => (
          <div 
            key={contact.name} 
            className="group bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-md p-4 flex items-center justify-between animate-fadeInUp transition-all duration-300 hover:shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-full mr-4 ${getIconColorClass(contact.color)}`}>
                {contact.icon}
              </div>
              <div>
                <h3 className="font-bold text-light-text dark:text-dark-text">{contact.name}</h3>
                <p className="text-lg font-mono text-light-text-secondary dark:text-dark-text-secondary tracking-wider">{contact.number}</p>
              </div>
            </div>
            <button
              onClick={() => handleCall(contact.number)}
              className="bg-contacts-primary dark:bg-contacts-primary-dark text-white dark:text-dark-bg font-bold py-2 px-4 rounded-lg flex items-center shadow-md hover:bg-slate-600 dark:hover:bg-slate-500 transition-all duration-300 active:scale-95"
            >
                <CallIcon />
                <span className="ml-2">Call</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmergencyContactsScreen;