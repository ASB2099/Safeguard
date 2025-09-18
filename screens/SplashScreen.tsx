import React, { useEffect } from 'react';
import { Page } from '../types';

interface SplashScreenProps {
  navigateTo: (page: Page) => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigateTo }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigateTo(Page.Registration);
    }, 1200); 

    return () => clearTimeout(timer);
  }, [navigateTo]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-primary to-blue-600 dark:from-black dark:to-primary text-white animate-fadeIn transition-all duration-500">
      <div className="text-center animate-fadeInUp">
        <div className="flex justify-center mb-4">
            <ShieldIcon />
        </div>
        <h1 className="text-6xl font-bold tracking-wider animate-pulse-slow">Safeguard</h1>
        <p className="mt-4 text-lg font-light h-7">
          <span className="animate-typing-splash">your safety comes first</span>
        </p>
      </div>
      <div className="absolute bottom-10 text-xs">
        <p>Loading your safe journey...</p>
      </div>
    </div>
  );
};

const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 animate-shieldPop animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

export default SplashScreen;