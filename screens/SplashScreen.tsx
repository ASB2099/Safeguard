import React from 'react';
import { Page } from '../types';

interface SplashScreenProps {
  navigateTo: (page: Page) => void;
}

const SafetyLogo = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-48 h-48 text-[#F95C5C]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L4 5v6c0 5.55 3.58 10.4 8 11.4 4.42-1 8-5.85 8-11.4V5l-8-3zm-1 13h2v-2h-2v2zm0-4h2V6h-2v5z"/>
    </svg>
  );
};

const SplashScreen: React.FC<SplashScreenProps> = ({ navigateTo }) => {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      <div className="flex-grow flex items-center justify-center p-8" role="img" aria-label="Safeguard App Logo">
        <SafetyLogo />
      </div>
      <div className="bg-[#1C203A] rounded-t-[50px] p-8 text-white text-center">
        <h1 className="text-3xl font-bold mb-4">Lets stay safe and connected together</h1>
        <p className="text-gray-300 mb-8">
          Your personal travel companion for safety, exploration, and peace of mind.
        </p>
        <button
          onClick={() => navigateTo(Page.Registration)}
          className="w-full bg-[#F95C5C] text-white font-bold py-4 px-8 rounded-xl text-lg flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors duration-300"
        >
          Let's Start
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;