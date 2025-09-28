import React, { useState } from 'react';
import { Page } from '../types';
import Header from '../components/Header';
import { useTranslation } from '../LanguageContext';

interface RegistrationScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigateTo, theme, toggleTheme }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { t } = useTranslation();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email) {
      navigateTo(Page.Home);
    } else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div className="flex flex-col h-full bg-light-bg dark:bg-dark-bg">
      <Header title={t('registration_title')} theme={theme} toggleTheme={toggleTheme} showLanguageSwitcher />
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm text-center">
            <h2 className="text-3xl font-bold text-light-text dark:text-dark-text mb-2 animate-fadeIn">{t('welcome_to_surakshify')}</h2>
            <p className="text-light-text-secondary dark:text-dark-text-secondary mb-8 animate-fadeIn h-6" style={{ animationDelay: '100ms' }}>
                <span className="animate-typing">{t('journey_begins')}</span>
            </p>
        </div>
        <form onSubmit={handleRegister} className="w-full max-w-sm space-y-6">
          <div className="animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            <label htmlFor="name" className="block text-sm font-medium text-light-text dark:text-dark-text">{t('full_name')}</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('full_name_placeholder')}
              className="mt-1 block w-full px-4 py-3 bg-light-surface dark:bg-dark-surface backdrop-blur-sm border border-light-border dark:border-dark-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark text-light-text dark:text-dark-text hover:border-gray-400 dark:hover:border-dark-border/80 transition-all duration-500 placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary"
              required
            />
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '300ms' }}>
            <label htmlFor="email" className="block text-sm font-medium text-light-text dark:text-dark-text">{t('email_address')}</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('email_placeholder')}
              className="mt-1 block w-full px-4 py-3 bg-light-surface dark:bg-dark-surface backdrop-blur-sm border border-light-border dark:border-dark-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark text-light-text dark:text-dark-text hover:border-gray-400 dark:hover:border-dark-border/80 transition-all duration-500 placeholder:text-light-text-secondary dark:placeholder:text-dark-text-secondary"
              required
            />
          </div>
          <div className="animate-fadeInUp" style={{ animationDelay: '400ms' }}>
            <button
              type="submit"
              className="flippable-button w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition-colors duration-500"
            >
              {t('register_button')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationScreen;
