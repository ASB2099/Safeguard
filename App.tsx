import React, { useState, useEffect } from 'react';
import { Page, Service, TravelService } from './types';
import SplashScreen from './screens/SplashScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import LocationScreen from './screens/LocationScreen';
import ServicesScreen from './screens/ServicesScreen';
import WeatherScreen from './screens/WeatherScreen';
import ServiceMapScreen from './screens/ServiceMapScreen';
import TravelScreen from './screens/TravelScreen';
import TravelMapScreen from './screens/TravelMapScreen';
import SOSScreen from './screens/SOSScreen';
import PreparednessScreen from './screens/PreparednessScreen';
import CustomCursor from './components/CustomCursor';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Splash);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTravelService, setSelectedTravelService] = useState<TravelService | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
  };
  
  const viewServiceOnMap = (service: Service) => {
    setSelectedService(service);
    navigateTo(Page.ServiceMap);
  };
  
  const viewTravelOnMap = (service: TravelService) => {
    setSelectedTravelService(service);
    navigateTo(Page.TravelMap);
  };
  
  const renderPage = () => {
    switch (currentPage) {
      case Page.Splash:
        return <SplashScreen navigateTo={navigateTo} />;
      case Page.Registration:
        return <RegistrationScreen navigateTo={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      case Page.Home:
        return <HomeScreen navigateTo={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      case Page.Chat:
        return <ChatScreen navigateTo={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      case Page.Location:
        return <LocationScreen navigateTo={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      case Page.Services:
        return <ServicesScreen navigateTo={navigateTo} viewServiceOnMap={viewServiceOnMap} theme={theme} toggleTheme={toggleTheme} />;
      case Page.Weather:
        return <WeatherScreen navigateTo={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      case Page.ServiceMap:
        if (!selectedService) return <ServicesScreen navigateTo={navigateTo} viewServiceOnMap={viewServiceOnMap} theme={theme} toggleTheme={toggleTheme}/>;
        return <ServiceMapScreen navigateTo={navigateTo} service={selectedService} theme={theme} toggleTheme={toggleTheme} />;
      case Page.Travel:
        return <TravelScreen navigateTo={navigateTo} viewTravelOnMap={viewTravelOnMap} theme={theme} toggleTheme={toggleTheme} />;
      case Page.TravelMap:
        if (!selectedTravelService) return <TravelScreen navigateTo={navigateTo} viewTravelOnMap={viewTravelOnMap} theme={theme} toggleTheme={toggleTheme}/>;
        return <TravelMapScreen navigateTo={navigateTo} service={selectedTravelService} theme={theme} toggleTheme={toggleTheme} />;
      case Page.SOS:
        return <SOSScreen navigateTo={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      case Page.Preparedness:
        return <PreparednessScreen navigateTo={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <HomeScreen navigateTo={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
    }
  };

  return (
    <div className="h-screen w-screen font-sans bg-gray-200 dark:bg-gray-800">
      <CustomCursor />
      <div className="h-full w-full max-w-lg mx-auto bg-white dark:bg-black shadow-2xl overflow-hidden relative">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
