import React from 'react';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, onBack, children }) => {
  return (
    <div className="bg-white dark:bg-[#1C203A] p-5 pt-8 flex items-center justify-between z-10 border-b border-gray-200 dark:border-gray-700/50">
      <div className="flex items-center space-x-4">
        {onBack && (
          <button onClick={onBack} className="text-gray-800 dark:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Header;