
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
import { USER_LOCATION } from './constants';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Splash);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTravelService, setSelectedTravelService] = useState<TravelService | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLocationError(null);
          setLocationLoading(false);
        },
        () => {
          setLocationError("Unable to retrieve your location. Please enable location services. Showing default location.");
          setLocation(USER_LOCATION); // Fallback to default
          setLocationLoading(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser. Showing default location.");
      setLocation(USER_LOCATION); // Fallback to default
      setLocationLoading(false);
    }

  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = (event: React.MouseEvent) => {
    const isAppearanceTransition = 
      // @ts-expect-error - startViewTransition is not in the default type definitions
      document.startViewTransition &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isAppearanceTransition) {
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
      return;
    }
    
    document.documentElement.classList.add('theme-transition');

    const x = event.clientX;
    const y = event.clientY;

    document.documentElement.style.setProperty('--ripple-x', `${x}px`);
    document.documentElement.style.setProperty('--ripple-y', `${y}px`);

    // @ts-expect-error
    const transition = document.startViewTransition(() => {
      setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    });

    transition.ready.then(() => {
      // The animation has been created
    });
    
    transition.finished.then(() => {
        document.documentElement.style.removeProperty('--ripple-x');
        document.documentElement.style.removeProperty('--ripple-y');
        document.documentElement.classList.remove('theme-transition');
    });
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
    const userLocation = location || USER_LOCATION;
    const commonProps = { theme, toggleTheme };
    const locationProps = { location, locationError, locationLoading, userLocation };

    switch (currentPage) {
      case Page.Splash:
        return <SplashScreen navigateTo={navigateTo} />;
      case Page.Registration:
        return <RegistrationScreen navigateTo={navigateTo} {...commonProps} />;
      case Page.Home:
        return <HomeScreen navigateTo={navigateTo} {...commonProps} />;
      case Page.Chat:
        return <ChatScreen navigateTo={navigateTo} {...commonProps} />;
      case Page.Location:
        return <LocationScreen navigateTo={navigateTo} {...commonProps} {...locationProps} />;
      case Page.Services:
        return <ServicesScreen navigateTo={navigateTo} viewServiceOnMap={viewServiceOnMap} {...commonProps} {...locationProps} />;
      case Page.Weather:
        return <WeatherScreen navigateTo={navigateTo} {...commonProps} {...locationProps} />;
      case Page.ServiceMap:
        if (!selectedService) return <ServicesScreen navigateTo={navigateTo} viewServiceOnMap={viewServiceOnMap} {...commonProps} {...locationProps}/>;
        return <ServiceMapScreen navigateTo={navigateTo} service={selectedService} {...commonProps} {...locationProps} />;
      case Page.Travel:
        return <TravelScreen navigateTo={navigateTo} viewTravelOnMap={viewTravelOnMap} {...commonProps} {...locationProps} />;
      case Page.TravelMap:
        if (!selectedTravelService) return <TravelScreen navigateTo={navigateTo} viewTravelOnMap={viewTravelOnMap} {...commonProps} {...locationProps}/>;
        return <TravelMapScreen navigateTo={navigateTo} service={selectedTravelService} {...commonProps} {...locationProps} />;
      case Page.SOS:
        return <SOSScreen navigateTo={navigateTo} {...commonProps} {...locationProps} />;
      case Page.Preparedness:
        return <PreparednessScreen navigateTo={navigateTo} {...commonProps} />;
      default:
        return <HomeScreen navigateTo={navigateTo} {...commonProps} />;
    }
  };

  return (
    <div className="h-screen w-screen font-sans">
      <CustomCursor />
      <div className="h-full w-full max-w-lg mx-auto bg-white/60 dark:bg-black/60 backdrop-blur-xl shadow-2xl overflow-hidden relative transition-colors duration-500 md:max-w-3xl lg:max-w-5xl">
        {renderPage()}
      </div>
    </div>
  );
}

export default App;