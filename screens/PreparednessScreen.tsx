import React, { useState } from 'react';
import { Page } from '../types';
import Header from '../components/Header';

interface PreparednessScreenProps {
  navigateTo: (page: Page) => void;
}

// FIX: Moved icon definitions before disasterData to prevent 'used before declaration' errors.
// Icons for disasters and UI
const EarthquakeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16M8 4l4 4 4-4M8 20l4-4 4 4" /></svg>;
const FloodIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-3.333 4-8 4-8 4s4.667 0 8 4c3.333-4 8-4 8-4s-4.667 0-8-4zm0 0V4m0 4c-3.333 4-8 4-8 4s4.667 0 8 4c3.333-4 8-4 8-4s-4.667 0-8-4zm0 0v4" /></svg>;
const FireIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c2.5 2.5 4 6.5 4 8.5 0 2.5-2 4.5-4 4.5s-4-2-4-4.5c0-2 1.5-6 4-8.5z" /><path d="M8.5 14.5c0 2.5 2 4.5 3.5 4.5s3.5-2 3.5-4.5" /></svg>;
const StormIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const ChevronIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const disasterData = [
  {
    id: 'earthquake',
    name: 'Earthquake',
    icon: <EarthquakeIcon />,
    during: [
      'Drop, Cover, and Hold On.',
      'Stay indoors until shaking stops.',
      'Stay away from windows, and objects that could fall.',
      'If outdoors, find a clear spot away from buildings and trees.',
    ],
    precautions: [
      'Secure heavy furniture to walls.',
      'Create an emergency kit with water, food, and first aid.',
      'Identify safe spots in each room.',
      'Practice "Drop, Cover, and Hold On" with family.',
    ],
  },
  {
    id: 'flood',
    name: 'Flood',
    icon: <FloodIcon />,
    during: [
      'Move to higher ground immediately.',
      'Do not walk, swim, or drive through floodwaters.',
      'Listen to emergency broadcasts for updates.',
      'If trapped, signal for help from a high point.',
    ],
    precautions: [
      'Know your area\'s flood risk.',
      'Keep important documents in a waterproof container.',
      'Assemble a disaster kit.',
      'Have an evacuation plan ready.',
    ],
  },
  {
    id: 'fire',
    name: 'Fire',
    icon: <FireIcon />,
    during: [
        'Evacuate immediately; do not stop for belongings.',
        'Stay low to the ground to avoid smoke.',
        'Feel doors for heat before opening.',
        'Once out, stay out and call for help.',
    ],
    precautions: [
        'Install smoke alarms and test them regularly.',
        'Have fire extinguishers and know how to use them.',
        'Plan and practice a fire escape route.',
        'Keep flammable materials away from heat sources.',
    ],
  },
   {
    id: 'storm',
    name: 'Severe Storm / Cyclone',
    icon: <StormIcon />,
    during: [
        'Stay indoors and away from windows.',
        'Take shelter in a small, interior room or basement.',
        'Listen to weather radios for updates and instructions.',
        'Unplug electronics to prevent power surge damage.',
    ],
    precautions: [
        'Secure outdoor objects or bring them inside.',
        'Board up windows if necessary.',
        'Have an emergency kit with non-perishable food and water.',
        'Trim trees and branches that could fall on your home.',
    ],
  },
];

const PreparednessScreen: React.FC<PreparednessScreenProps> = ({ navigateTo }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-[#F1F3F6] dark:bg-gray-900">
      <Header title="Disaster Preparedness" onBack={() => navigateTo(Page.Home)} />
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400 px-2 pb-2">
            Stay safe by learning what to do before and during common natural disasters.
        </p>
        
        {disasterData.map((disaster) => (
          <div key={disaster.id} className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
            <button
              onClick={() => toggleAccordion(disaster.id)}
              className="w-full flex items-center justify-between p-4 text-left"
              aria-expanded={openId === disaster.id}
              aria-controls={`content-${disaster.id}`}
            >
              <div className="flex items-center">
                <div className="mr-4 text-red-500">{disaster.icon}</div>
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{disaster.name}</h3>
              </div>
              <ChevronIcon isOpen={openId === disaster.id} />
            </button>
            <div
              id={`content-${disaster.id}`}
              className={`transition-all duration-300 ease-in-out overflow-hidden ${openId === disaster.id ? 'max-h-96' : 'max-h-0'}`}
            >
              <div className="p-4 pt-0">
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="font-semibold text-md text-gray-700 dark:text-gray-200 mb-2">What to do DURING:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    {disaster.during.map((tip, index) => <li key={index}>{tip}</li>)}
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-md text-gray-700 dark:text-gray-200 mb-2">Precautions to take BEFORE:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    {disaster.precautions.map((tip, index) => <li key={index}>{tip}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PreparednessScreen;
