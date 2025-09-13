import React, { useState } from 'react';
import { Page } from '../types';
import Header from '../components/Header';

interface RegistrationScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigateTo, theme, toggleTheme }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      navigateTo(Page.Home);
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      <Header title="Welcome to Safeguard" theme={theme} toggleTheme={toggleTheme} />
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2 animate-fadeIn">Create Your Account</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 animate-fadeIn" style={{ animationDelay: '100ms' }}>
                Join us to make your travels safer and smarter.
            </p>
        </div>
        <form onSubmit={handleRegister} className="w-full max-w-sm space-y-6">
          <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 dark:focus:ring-red-500 focus:border-green-500 dark:focus:border-red-500 text-gray-800 dark:text-gray-200"
              required
            />
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-green-500 dark:focus:ring-red-500 focus:border-green-500 dark:focus:border-red-500 text-gray-800 dark:text-gray-200"
              required
            />
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-red-600 dark:hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-red-500 transition-colors"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationScreen;
