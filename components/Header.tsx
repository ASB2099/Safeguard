import React from 'react';
import DateTimeDisplay from './DateTimeDisplay';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  children?: React.ReactNode;
  theme?: 'light' | 'dark';
  toggleTheme?: (event: React.MouseEvent) => void;
  showDateTime?: boolean;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, children, theme, toggleTheme, showDateTime = false }) => {
  return (
    <div className="bg-white/60 dark:bg-black/60 backdrop-blur-md p-5 pt-8 flex items-center justify-between z-10 border-b border-green-200/50 dark:border-red-900/50 transition-colors duration-500">
      <div className="flex items-center space-x-4">
        {onBack && (
          <button onClick={onBack} className="text-green-600 dark:text-red-500 rounded-full p-1 hover:bg-black/10 dark:hover:bg-red-500/10 transition-colors duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-2xl font-bold text-black dark:text-white">{title}</h1>
      </div>
      <div className="flex items-center">
        {children}
        {showDateTime && <DateTimeDisplay />}
        {toggleTheme && theme && (
            <button onClick={(e) => toggleTheme(e)} className="p-2 rounded-full text-green-700 dark:text-red-300 hover:bg-black/10 dark:hover:bg-red-500/10 transition-colors duration-300">
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