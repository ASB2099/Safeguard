import React, { useEffect } from 'react';
import { Page } from '../types';

interface SplashScreenProps {
  navigateTo: (page: Page) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigateTo }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo(Page.Registration);
    }, 3000); 

    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-green-400 to-blue-500 dark:from-red-500 dark:to-purple-600 text-white animate-fadeIn">
      <div className="text-center">
        <h1 className="text-6xl font-bold tracking-wider animate-pulse-slow">Safeguard</h1>
        <p className="mt-4 text-lg font-light">Your Personal Travel Companion</p>
      </div>
      <div className="absolute bottom-10 text-xs">
        <p>Loading your safe journey...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
