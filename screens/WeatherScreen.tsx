import React, { useState } from 'react';
import { Page } from '../types';
import Header from '../components/Header';

interface WeatherScreenProps {
  navigateTo: (page: Page) => void;
}

const WeatherScreen: React.FC<WeatherScreenProps> = ({ navigateTo }) => {
  const [disasterAlert] = useState(true); // Set to true to show the alert

  const forecast = [
    { time: 'Now', temp: 28, icon: <SunIcon /> },
    { time: '2 PM', temp: 30, icon: <SunIcon /> },
    { time: '4 PM', temp: 29, icon: <CloudIcon /> },
    { time: '6 PM', temp: 26, icon: <CloudIcon /> },
    { time: '8 PM', temp: 24, icon: <MoonIcon /> },
  ];

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#1C203A]">
      <Header title="Weather" onBack={() => navigateTo(Page.Home)} />
      
      <div className="flex-grow bg-[#F1F3F6] dark:bg-gray-900 rounded-t-[40px] p-6 overflow-y-auto">
        {disasterAlert && (
          <div className="bg-red-500 border-l-4 border-red-700 text-white p-4 rounded-lg mb-6 shadow-lg animate-pulse">
            <div className="flex">
              <div className="py-1"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <div>
                <p className="font-bold">Weather Alert</p>
                <p className="text-sm">Heavy monsoon rains expected. Avoid travel near rivers and low-lying areas.</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-md mb-6">
            <p className="text-gray-500 dark:text-gray-400">Pune, India</p>
            <div className="flex items-center justify-center my-4">
                <div className="text-yellow-400 mr-4"><SunIcon large /></div>
                <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">28°C</h1>
            </div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">Partly Cloudy</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Feels like 30°C</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">Upcoming Forecast</h3>
            <div className="flex justify-between overflow-x-auto -mx-6 px-6">
                {forecast.map((item, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2 flex-shrink-0 px-2">
                        <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{item.time}</p>
                        <div className={`text-2xl ${item.time === '8 PM' ? 'text-gray-500' : 'text-yellow-400'}`}>{item.icon}</div>
                        <p className="font-bold text-gray-800 dark:text-gray-100">{item.temp}°</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

const SunIcon: React.FC<{ large?: boolean }> = ({ large }) => <svg xmlns="http://www.w3.org/2000/svg" className={large ? "h-16 w-16" : "h-8 w-8"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const CloudIcon: React.FC<{ large?: boolean }> = ({ large }) => <svg xmlns="http://www.w3.org/2000/svg" className={large ? "h-16 w-16" : "h-8 w-8"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>;
const MoonIcon: React.FC<{ large?: boolean }> = ({ large }) => <svg xmlns="http://www.w3.org/2000/svg" className={large ? "h-16 w-16" : "h-8 w-8"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;

export default WeatherScreen;