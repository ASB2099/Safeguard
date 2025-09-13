import React, { useState } from 'react';
import { Page } from '../types';
import Header from '../components/Header';

interface PreparednessScreenProps {
  navigateTo: (page: Page) => void;
  theme: 'light' | 'dark';
  toggleTheme: (event: React.MouseEvent) => void;
}

// Icons for disasters and UI
const EarthquakeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16M8 4l4 4 4-4M8 20l4-4 4 4" /></svg>;
const FloodIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-3.333 4-8 4-8 4s4.667 0 8 4c3.333-4 8-4 8-4s-4.667 0-8-4zm0 0V4m0 4c-3.333 4-8 4-8 4s4.667 0 8 4c3.333-4 8-4 8-4s-4.667 0-8-4zm0 0v4" /></svg>;
const FireIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c2.5 2.5 4 6.5 4 8.5 0 2.5-2 4.5-4 4.5s-4-2-4-4.5c0-2 1.5-6 4-8.5z" /><path d="M8.5 14.5c0 2.5 2 4.5 3.5 4.5s3.5-2 3.5-4.5" /></svg>;
const StormIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const TsunamiIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12c0-1.1.9-2 2-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm0 4c0-1.1.9-2 2-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm0-8c0-1.1.9-2 2-2h12a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" /></svg>;
const LandslideIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 16l4-4 4 4 4-4 4 4 4-4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 20l4-4 4 4 4-4 4 4 4-4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4L2 14h20L12 4z" /></svg>;
const VolcanoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L2 22h20L12 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m-2 2h4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 2c.5 1 1.5 2 2.5 2s2-1 2.5-2" /></svg>;
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
  {
    id: 'tsunami',
    name: 'Tsunami',
    icon: <TsunamiIcon />,
    during: [
      'If you feel an earthquake near a coast, drop, cover, hold on, then evacuate to high ground.',
      'Move inland as far as possible.',
      'Follow official evacuation orders immediately.',
      'Do not return to the coast until authorities say it is safe.',
    ],
    precautions: [
      'Know your community\'s tsunami warning system and evacuation routes.',
      'Practice your evacuation route.',
      'If you are new to an area, ask about the local tsunami risk.',
      'Prepare a "go-bag" with essentials.',
    ],
  },
  {
    id: 'landslide',
    name: 'Landslide',
    icon: <LandslideIcon />,
    during: [
      'Evacuate immediately if it is safe to do so.',
      'Listen for unusual sounds that might indicate moving debris.',
      'Move away from the path of a landslide or debris flow.',
      'If escape is not possible, curl into a tight ball and protect your head.',
    ],
    precautions: [
      'Learn about the landslide risk in your area.',
      'Watch for changes in landscape and water drainage.',
      'Have a geotechnical expert assess your property if you are in a high-risk zone.',
      'Plant ground cover on slopes and build retaining walls.',
    ],
  },
  {
    id: 'volcano',
    name: 'Volcanic Eruption',
    icon: <VolcanoIcon />,
    during: [
      'Follow evacuation orders from authorities immediately.',
      'Avoid low-lying areas, and areas downwind of the volcano.',
      'Protect yourself from falling ash by wearing long sleeves, goggles, and a dust mask.',
      'Stay indoors and close all windows and doors.',
    ],
    precautions: [
      'Know your community\'s warning signals and evacuation plans.',
      'Prepare an emergency kit with goggles and dust masks for everyone.',
      'Understand the risk of mudflows (lahars) which can be very dangerous.',
      'Have a plan for your pets and livestock.',
    ],
  },
];

const PreparednessScreen: React.FC<PreparednessScreenProps> = ({ navigateTo, theme, toggleTheme }) => {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-transparent">
      <Header title="Disaster Preparedness" onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} />
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-black/70 dark:text-white/70 px-2 pb-2 animate-fadeIn">
            Stay safe by learning what to do before and during common natural disasters.
        </p>
        
        {disasterData.map((disaster, index) => (
          <div 
            key={disaster.id} 
            className="group bg-white/20 dark:bg-black/20 backdrop-blur-md border border-white/30 dark:border-red-500/30 rounded-xl shadow-colored-md overflow-hidden animate-fadeInUp transition-all duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <button
              onClick={() => toggleAccordion(disaster.id)}
              className="flippable-button w-full flex items-center justify-between p-4 text-left"
              aria-expanded={openId === disaster.id}
              aria-controls={`content-${disaster.id}`}
            >
              <div className="flex items-center">
                <div className="mr-4 text-green-500 dark:text-red-500 transition-transform duration-300 group-hover:scale-110">{disaster.icon}</div>
                <h3 className="font-bold text-lg text-black dark:text-white">{disaster.name}</h3>
              </div>
              <ChevronIcon isOpen={openId === disaster.id} />
            </button>
            <div
              id={`content-${disaster.id}`}
              className={`transition-all duration-500 ease-in-out overflow-hidden ${openId === disaster.id ? 'max-h-[500px]' : 'max-h-0'}`}
            >
              <div className="p-4 pt-0 text-black dark:text-white">
                <div className="border-t border-green-200/50 dark:border-red-800/50 pt-4">
                  <h4 className="font-semibold text-md text-green-800 dark:text-red-200 mb-2">What to do DURING:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-black/80 dark:text-white/80">
                    {disaster.during.map((tip, index) => <li key={index}>{tip}</li>)}
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-md text-green-800 dark:text-red-200 mb-2">Precautions to take BEFORE:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-black/80 dark:text-white/80">
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