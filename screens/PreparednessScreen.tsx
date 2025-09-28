import React, { useState } from 'react';
import { Page } from '../types';
import Header from '../components/Header';
import { useTranslation } from '../LanguageContext';

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


const PreparednessScreen: React.FC<PreparednessScreenProps> = ({ navigateTo, theme, toggleTheme }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const { t } = useTranslation();
  
  const disasterData = [
    {
      id: 'earthquake',
      name: t('earthquake'),
      icon: <EarthquakeIcon />,
      during: [
        t('earthquake_during_1'),
        t('earthquake_during_2'),
        t('earthquake_during_3'),
        t('earthquake_during_4'),
      ],
      precautions: [
        t('earthquake_before_1'),
        t('earthquake_before_2'),
        t('earthquake_before_3'),
        t('earthquake_before_4'),
      ],
    },
    {
      id: 'flood',
      name: t('flood'),
      icon: <FloodIcon />,
      during: [
        t('flood_during_1'),
        t('flood_during_2'),
        t('flood_during_3'),
        t('flood_during_4'),
      ],
      precautions: [
        t('flood_before_1'),
        t('flood_before_2'),
        t('flood_before_3'),
        t('flood_before_4'),
      ],
    },
    {
      id: 'fire',
      name: t('fire'),
      icon: <FireIcon />,
      during: [
          t('fire_during_1'),
          t('fire_during_2'),
          t('fire_during_3'),
          t('fire_during_4'),
      ],
      precautions: [
          t('fire_before_1'),
          t('fire_before_2'),
          t('fire_before_3'),
          t('fire_before_4'),
      ],
    },
     {
      id: 'storm',
      name: t('storm'),
      icon: <StormIcon />,
      during: [
          t('storm_during_1'),
          t('storm_during_2'),
          t('storm_during_3'),
          t('storm_during_4'),
      ],
      precautions: [
          t('storm_before_1'),
          t('storm_before_2'),
          t('storm_before_3'),
          t('storm_before_4'),
      ],
    },
    {
      id: 'tsunami',
      name: t('tsunami'),
      icon: <TsunamiIcon />,
      during: [
        t('tsunami_during_1'),
        t('tsunami_during_2'),
        t('tsunami_during_3'),
        t('tsunami_during_4'),
      ],
      precautions: [
        t('tsunami_before_1'),
        t('tsunami_before_2'),
        t('tsunami_before_3'),
        t('tsunami_before_4'),
      ],
    },
    {
      id: 'landslide',
      name: t('landslide'),
      icon: <LandslideIcon />,
      during: [
        t('landslide_during_1'),
        t('landslide_during_2'),
        t('landslide_during_3'),
        t('landslide_during_4'),
      ],
      precautions: [
        t('landslide_before_1'),
        t('landslide_before_2'),
        t('landslide_before_3'),
        t('landslide_before_4'),
      ],
    },
    {
      id: 'volcano',
      name: t('volcano'),
      icon: <VolcanoIcon />,
      during: [
        t('volcano_during_1'),
        t('volcano_during_2'),
        t('volcano_during_3'),
        t('volcano_during_4'),
      ],
      precautions: [
        t('volcano_before_1'),
        t('volcano_before_2'),
        t('volcano_before_3'),
        t('volcano_before_4'),
      ],
    },
  ];


  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="flex flex-col h-full bg-gradient-page">
      <Header title={t('disaster_preparedness_title')} onBack={() => navigateTo(Page.Home)} theme={theme} toggleTheme={toggleTheme} page={Page.Preparedness} showLanguageSwitcher/>
      
      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary px-2 pb-2 animate-fadeIn">
            {t('preparedness_description')}
        </p>
        
        {disasterData.map((disaster, index) => (
          <div 
            key={disaster.id} 
            className="group bg-light-surface dark:bg-dark-surface border border-light-border dark:border-dark-border rounded-xl shadow-md overflow-hidden animate-fadeInUp transition-all duration-500"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <button
              onClick={() => toggleAccordion(disaster.id)}
              className="flippable-button w-full flex items-center justify-between p-4 text-left"
              aria-expanded={openId === disaster.id}
              aria-controls={`content-${disaster.id}`}
            >
              <div className="flex items-center">
                <div className="mr-4 text-prep-primary dark:text-prep-primary-dark transition-transform duration-300 group-hover:scale-110">{disaster.icon}</div>
                <h3 className="font-bold text-lg text-light-text dark:text-dark-text">{disaster.name}</h3>
              </div>
              <ChevronIcon isOpen={openId === disaster.id} />
            </button>
            <div
              id={`content-${disaster.id}`}
              className={`transition-all duration-500 ease-in-out overflow-hidden ${openId === disaster.id ? 'max-h-[500px]' : 'max-h-0'}`}
            >
              <div className="p-4 pt-0 text-light-text dark:text-dark-text">
                <div className="border-t border-light-border dark:border-dark-border pt-4">
                  <h4 className="font-semibold text-md text-prep-primary dark:text-prep-primary-dark mb-2">{t('during_title')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                    {disaster.during.map((tip, index) => <li key={index}>{tip}</li>)}
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="font-semibold text-md text-prep-primary dark:text-prep-primary-dark mb-2">{t('before_title')}</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-light-text-secondary dark:text-dark-text-secondary">
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
