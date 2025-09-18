import React, { useState, useEffect } from 'react';
import { Page, Service, TravelService, SecureZone } from './types';
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
import SecureZonesScreen from './screens/SecureZonesScreen';
import SecureZoneMapScreen from './screens/SecureZoneMapScreen';
import EmergencyContactsScreen from './screens/EmergencyContactsScreen';
import LocalGuidesScreen from './screens/LocalGuidesScreen';
import CustomCursor from './components/CustomCursor';
import RippleEffect from './components/RippleEffect';
import { USER_LOCATION } from './constants';

const getPageTheme = (page: Page) => {
    switch (page) {
        case Page.Chat: // Purple
            return {
                '--page-gradient-from': '#fbfaff', '--page-gradient-to': '#fdfdff',
                '--page-gradient-from-dark': '#2c2231', '--page-gradient-to-dark': '#18181b',
                '--ripple-color': 'rgba(168, 85, 247, 0.4)', '--ripple-color-dark': 'rgba(192, 132, 252, 0.4)',
            };
        case Page.Location: // Teal
        case Page.Services:
        case Page.ServiceMap:
            return {
                '--page-gradient-from': '#f2fcfb', '--page-gradient-to': '#fdfdff',
                '--page-gradient-from-dark': '#1e302c', '--page-gradient-to-dark': '#18181b',
                '--ripple-color': 'rgba(20, 184, 166, 0.4)', '--ripple-color-dark': 'rgba(45, 212, 191, 0.4)',
            };
        case Page.Weather: // Orange
            return {
                '--page-gradient-from': '#fffaf6', '--page-gradient-to': '#fdfdff',
                '--page-gradient-from-dark': '#332b1f', '--page-gradient-to-dark': '#18181b',
                '--ripple-color': 'rgba(249, 115, 22, 0.4)', '--ripple-color-dark': 'rgba(251, 146, 60, 0.4)',
            };
        case Page.Travel: // Indigo
        case Page.TravelMap:
            return {
                '--page-gradient-from': '#f7f7fe', '--page-gradient-to': '#fdfdff',
                '--page-gradient-from-dark': '#22282e', '--page-gradient-to-dark': '#18181b',
                '--ripple-color': 'rgba(79, 70, 229, 0.4)', '--ripple-color-dark': 'rgba(129, 140, 248, 0.4)',
            };
        case Page.Preparedness: // Green
             return {
                '--page-gradient-from': '#f6fef9', '--page-gradient-to': '#fdfdff',
                '--page-gradient-from-dark': '#203228', '--page-gradient-to-dark': '#18181b',
                '--ripple-color': 'rgba(34, 197, 94, 0.4)', '--ripple-color-dark': 'rgba(74, 222, 128, 0.4)',
            };
        case Page.SecureZones: // Cyan
        case Page.SecureZoneMap:
             return {
                '--page-gradient-from': '#f4fdfe', '--page-gradient-to': '#fdfdff',
                '--page-gradient-from-dark': '#1c2d33', '--page-gradient-to-dark': '#18181b',
                '--ripple-color': 'rgba(6, 182, 212, 0.4)', '--ripple-color-dark': 'rgba(34, 211, 238, 0.4)',
            };
        case Page.EmergencyContacts: // Slate
             return {
                '--page-gradient-from': '#fbfbfc', '--page-gradient-to': '#fdfdff',
                '--page-gradient-from-dark': '#25292e', '--page-gradient-to-dark': '#18181b',
                '--ripple-color': 'rgba(100, 116, 139, 0.4)', '--ripple-color-dark': 'rgba(148, 163, 184, 0.4)',
            };
        case Page.LocalGuides: // Amber/Tan
             return {
                '--page-gradient-from': '#fffbf2', '--page-gradient-to': '#fdfdff',
                '--page-gradient-from-dark': '#2f281d', '--page-gradient-to-dark': '#18181b',
                '--ripple-color': 'rgba(217, 119, 6, 0.4)', '--ripple-color-dark': 'rgba(245, 158, 11, 0.4)',
            };
        case Page.SOS: // Red
            return {
                '--page-gradient-from': 'transparent', '--page-gradient-to': 'transparent',
                '--page-gradient-from-dark': 'transparent', '--page-gradient-to-dark': 'transparent',
            };
        default: // Blue
            return {
                '--page-gradient-from': '#f7f9fe', '--page-gradient-to': '#fdfdff',
                '--page-gradient-from-dark': '#202124', '--page-gradient-to-dark': '#18181b',
                '--ripple-color': 'rgba(59, 130, 246, 0.4)', '--ripple-color-dark': 'rgba(96, 165, 250, 0.4)',
            };
    }
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Splash);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedTravelService, setSelectedTravelService] = useState<TravelService | null>(null);
  const [selectedSecureZone, setSelectedSecureZone] = useState<SecureZone | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

  useEffect(() => {
    // Only enable cursor following effect on devices with a fine pointer (mouse/trackpad)
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }

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
          let errorMessage = "Unable to retrieve your location. Please enable location services in your browser settings.";
          const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
          if (isLocalhost) {
              errorMessage = "To see your real location, you must grant location permissions to your browser for this site.";
          }
          setLocationError(errorMessage + " Displaying default location for demonstration.");
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
  
  const viewSecureZoneOnMap = (zone: SecureZone) => {
    setSelectedSecureZone(zone);
    navigateTo(Page.SecureZoneMap);
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
        return <HomeScreen navigateTo={navigateTo} {...commonProps} {...locationProps} />;
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
      case Page.SecureZones:
        return <SecureZonesScreen navigateTo={navigateTo} viewSecureZoneOnMap={viewSecureZoneOnMap} {...commonProps} {...locationProps} />;
      case Page.SecureZoneMap:
        if (!selectedSecureZone) return <SecureZonesScreen navigateTo={navigateTo} viewSecureZoneOnMap={viewSecureZoneOnMap} {...commonProps} {...locationProps}/>;
        return <SecureZoneMapScreen navigateTo={navigateTo} zone={selectedSecureZone} {...commonProps} {...locationProps} />;
      case Page.EmergencyContacts:
        return <EmergencyContactsScreen navigateTo={navigateTo} {...commonProps} />;
      case Page.LocalGuides:
        return <LocalGuidesScreen navigateTo={navigateTo} {...commonProps} {...locationProps} />;
      default:
        return <HomeScreen navigateTo={navigateTo} {...commonProps} {...locationProps} />;
    }
  };
  
  const pageThemeStyles = getPageTheme(currentPage) as React.CSSProperties;

  return (
    <div className="h-screen w-screen font-sans" style={pageThemeStyles}>
      <CustomCursor page={currentPage} />
      <RippleEffect />
      <div className={`h-full w-full max-w-lg mx-auto bg-light-surface dark:bg-dark-bg backdrop-blur-xl shadow-2xl overflow-hidden relative transition-colors duration-500 md:max-w-3xl lg:max-w-5xl`}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;