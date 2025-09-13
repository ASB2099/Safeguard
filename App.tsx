import React, { useState, useCallback, useEffect } from 'react';
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

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Splash);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTravelService, setSelectedTravelService] = useState<TravelService | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []);

  const navigateTo = useCallback((page: Page) => {
    setCurrentPage(page);
  }, []);

  const viewServiceOnMap = useCallback((service: Service) => {
    setSelectedService(service);
    setCurrentPage(Page.ServiceMap);
  }, []);

  const viewTravelOnMap = useCallback((service: TravelService) => {
    setSelectedTravelService(service);
    setCurrentPage(Page.TravelMap);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Splash:
        return <SplashScreen navigateTo={navigateTo} />;
      case Page.Registration:
        return <RegistrationScreen navigateTo={navigateTo} />;
      case Page.Home:
        return <HomeScreen navigateTo={navigateTo} theme={theme} toggleTheme={toggleTheme} />;
      case Page.Chat:
        return <ChatScreen navigateTo={navigateTo} />;
      case Page.Location:
        return <LocationScreen navigateTo={navigateTo} />;
      case Page.Services:
        return <ServicesScreen navigateTo={navigateTo} viewServiceOnMap={viewServiceOnMap} />;
      case Page.Weather:
        return <WeatherScreen navigateTo={navigateTo} />;
      case Page.ServiceMap:
        if (!selectedService) {
            return <ServicesScreen navigateTo={navigateTo} viewServiceOnMap={viewServiceOnMap} />;
        }
        return <ServiceMapScreen navigateTo={navigateTo} service={selectedService} />;
      case Page.Travel:
        return <TravelScreen navigateTo={navigateTo} viewTravelOnMap={viewTravelOnMap} />;
      case Page.TravelMap:
        if (!selectedTravelService) {
            return <TravelScreen navigateTo={navigateTo} viewTravelOnMap={viewTravelOnMap} />;
        }
        return <TravelMapScreen navigateTo={navigateTo} service={selectedTravelService} />;
      case Page.SOS:
        return <SOSScreen navigateTo={navigateTo} />;
      case Page.Preparedness:
        return <PreparednessScreen navigateTo={navigateTo} />;
      default:
        return <SplashScreen navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="bg-gray-200 dark:bg-gray-900 flex justify-center items-center min-h-screen font-sans">
      <div className="w-full max-w-sm h-[800px] max-h-[90vh] bg-white dark:bg-[#1C203A] rounded-3xl shadow-2xl overflow-hidden relative">
        {renderPage()}
      </div>
    </div>
  );
};

export default App;