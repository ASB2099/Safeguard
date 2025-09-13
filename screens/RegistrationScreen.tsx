import React, { useState } from 'react';
import { Page } from '../types';
import Header from '../components/Header';

interface RegistrationScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
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
    <div className="flex flex-col h-full bg-transparent">
      <Header title="Welcome to Safeguard" theme={theme} toggleTheme={toggleTheme} />
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-2 animate-fadeIn">Welcome to Safeguard</h2>
            <p className="text-black/80 dark:text-white/80 mb-8 animate-fadeIn h-6" style={{ animationDelay: '100ms' }}>
                <span className="animate-typing">Your journey with safety begins here.</span>
            </p>
        </div>
        <form onSubmit={handleRegister} className="w-full max-w-sm space-y-6">
          <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <label htmlFor="name" className="block text-sm font-medium text-black dark:text-white/90">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 block w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-white/30 dark:border-green-500/30 rounded-lg shadow-colored-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 text-black dark:text-white hover:border-green-400/50 dark:hover:border-green-400/60 transition-all duration-500 placeholder:text-black/50 dark:placeholder:text-white/50"
              required
            />
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <label htmlFor="email" className="block text-sm font-medium text-black dark:text-white/90">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 block w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border border-white/30 dark:border-green-500/30 rounded-lg shadow-colored-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-500 text-black dark:text-white hover:border-green-400/50 dark:hover:border-green-400/60 transition-all duration-500 placeholder:text-black/50 dark:placeholder:text-white/50"
              required
            />
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            <button
              type="submit"
              className="flippable-button w-full flex justify-center py-3 px-4 border border-white/30 dark:border-green-500/30 rounded-lg shadow-colored-md text-sm font-medium text-black dark:text-white bg-white/20 dark:bg-black/20 backdrop-blur-md hover:bg-white/30 dark:hover:bg-green-500/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-green-500 transition-colors duration-500"
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