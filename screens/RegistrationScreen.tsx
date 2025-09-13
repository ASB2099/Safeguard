import React from 'react';
import { Page } from '../types';

interface RegistrationScreenProps {
  navigateTo: (page: Page) => void;
}

const RegistrationScreen: React.FC<RegistrationScreenProps> = ({ navigateTo }) => {
  const handleRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd handle form data here.
    // For this prototype, we just navigate to the home screen.
    navigateTo(Page.Home);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C203A]">
      <div className="p-8 pt-12 text-center">
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Create Account</h1>
        <p className="text-gray-500 dark:text-gray-300">Join us to stay safe and connected on your travels.</p>
      </div>

      <div className="flex-grow bg-[#F1F3F6] dark:bg-gray-900 rounded-t-[40px] p-8 text-gray-800 dark:text-gray-100 overflow-y-auto">
        <form onSubmit={handleRegistration} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input type="text" id="name" name="name" required className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-[#F95C5C] focus:border-[#F95C5C] transition" placeholder="John Doe" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
            <input type="email" id="email" name="email" required className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-[#F95C5C] focus:border-[#F95C5C] transition" placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
            <input type="password" id="password" name="password" required className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-[#F95C5C] focus:border-[#F95C5C] transition" placeholder="••••••••" />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#F95C5C] text-white font-bold py-4 px-8 rounded-xl text-lg flex items-center justify-center shadow-lg hover:bg-red-500 transition-colors duration-300"
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationScreen;