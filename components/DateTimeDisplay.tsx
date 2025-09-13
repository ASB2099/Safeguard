import React, { useState, useEffect } from 'react';

const DateTimeDisplay: React.FC = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

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
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
    });
  };

  return (
    <div className="text-xs text-right text-green-800 dark:text-green-200/90 mr-2 transition-colors duration-500">
      <p className="font-semibold">{formatTime(currentDateTime)}</p>
      <p>{formatDate(currentDateTime)}</p>
    </div>
  );
};

export default DateTimeDisplay;