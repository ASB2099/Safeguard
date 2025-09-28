import React, { useState, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';

const DateTimeDisplay: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const { locale } = useTranslation();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };
    return date.toLocaleDateString(locale, options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(locale, {
      hour12: false,
    });
  };

  return (
    <div className="text-xs text-right text-light-text-secondary dark:text-dark-text-secondary mr-2 transition-colors duration-500">
      <p className="font-semibold">{formatTime(currentDateTime)}</p>
      <p>{formatDate(currentDateTime)}</p>
    </div>
  );
};

export default DateTimeDisplay;
