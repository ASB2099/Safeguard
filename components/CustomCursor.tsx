import React, { useState, useEffect } from 'react';
import { Page } from '../types';

interface CustomCursorProps {
  page: Page;
}

const getPageColorClasses = (page: Page) => {
    switch(page) {
        case Page.Chat:
            return { border: 'border-chat-primary dark:border-chat-primary-dark', bg: 'bg-chat-primary dark:bg-chat-primary-dark', ring: 'bg-chat-primary/20 dark:bg-chat-primary-dark/20' };
        case Page.Location:
        case Page.Services:
        case Page.ServiceMap:
            return { border: 'border-location-primary dark:border-location-primary-dark', bg: 'bg-location-primary dark:bg-location-primary-dark', ring: 'bg-location-primary/20 dark:bg-location-primary-dark/20' };
        case Page.Weather:
            return { border: 'border-weather-primary dark:border-weather-primary-dark', bg: 'bg-weather-primary dark:bg-weather-primary-dark', ring: 'bg-weather-primary/20 dark:bg-weather-primary-dark/20' };
        case Page.Travel:
        case Page.TravelMap:
            return { border: 'border-travel-primary dark:border-travel-primary-dark', bg: 'bg-travel-primary dark:bg-travel-primary-dark', ring: 'bg-travel-primary/20 dark:bg-travel-primary-dark/20' };
        case Page.Preparedness:
            return { border: 'border-prep-primary dark:border-prep-primary-dark', bg: 'bg-prep-primary dark:bg-prep-primary-dark', ring: 'bg-prep-primary/20 dark:bg-prep-primary-dark/20' };
        case Page.SecureZones:
        case Page.SecureZoneMap:
            return { border: 'border-secure-primary dark:border-secure-primary-dark', bg: 'bg-secure-primary dark:bg-secure-primary-dark', ring: 'bg-secure-primary/20 dark:bg-secure-primary-dark/20' };
        case Page.EmergencyContacts:
            return { border: 'border-contacts-primary dark:border-contacts-primary-dark', bg: 'bg-contacts-primary dark:bg-contacts-primary-dark', ring: 'bg-contacts-primary/20 dark:bg-contacts-primary-dark/20' };
        case Page.LocalGuides:
            return { border: 'border-guide-primary dark:border-guide-primary-dark', bg: 'bg-guide-primary dark:bg-guide-primary-dark', ring: 'bg-guide-primary/20 dark:bg-guide-primary-dark/20' };
        case Page.SOS:
            return { border: 'border-danger dark:border-danger-dark', bg: 'bg-danger dark:bg-danger-dark', ring: 'bg-danger/20 dark:bg-danger-dark/20' };
        default:
            return { border: 'border-primary dark:border-primary-dark', bg: 'bg-primary dark:bg-primary-dark', ring: 'bg-primary/20 dark:bg-primary-dark/20' };
    }
}

const CustomCursor: React.FC<CustomCursorProps> = ({ page }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [isOverMap, setIsOverMap] = useState(false);

  useEffect(() => {
    // Only render the custom cursor on devices that support a fine pointer.
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    setShouldRender(hasFinePointer);

    if (!hasFinePointer) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      if (target) {
        const isClickable = target.closest('button, a, input, select, textarea, [role="button"]');
        setIsPointer(!!isClickable);

        const overMap = !!target.closest('.map-container');
        setIsOverMap(overMap);
      }
    };
    
    const onMouseEnter = () => setIsHovering(true);
    const onMouseLeave = () => setIsHovering(false);


    document.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseenter', onMouseEnter);
    document.body.addEventListener('mouseleave', onMouseLeave);


    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.body.removeEventListener('mouseenter', onMouseEnter);
      document.body.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);
  
  const colorClasses = getPageColorClasses(page);

  if (!shouldRender) {
    return null;
  }

  return (
    <div 
      className={`custom-cursor fixed top-0 left-0 pointer-events-none z-[9999] transition-opacity duration-300 ${isHovering && !isOverMap ? 'opacity-100' : 'opacity-0'}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* Outer Ring */}
      <div
        className={`absolute top-0 left-0 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out border-2 ${colorClasses.border} ${
          isPointer ? `scale-150 opacity-50 ${colorClasses.ring}` : 'scale-100 opacity-100'
        }`}
        style={{
          width: '40px',
          height: '40px',
        }}
      />
      {/* Inner Dot */}
      <div
        className={`absolute top-0 left-0 rounded-full ${colorClasses.bg} -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
            isPointer ? 'scale-0' : 'scale-100'
        }`}
        style={{
          width: '8px',
          height: '8px',
        }}
      />
    </div>
  );
};

export default CustomCursor;