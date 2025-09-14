import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
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
        className={`absolute top-0 left-0 rounded-full -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out border-2 border-green-500 dark:border-green-400 ${
          isPointer ? 'scale-150 opacity-50 bg-green-500/20 dark:bg-green-400/20' : 'scale-100 opacity-100'
        }`}
        style={{
          width: '40px',
          height: '40px',
        }}
      />
      {/* Inner Dot */}
      <div
        className={`absolute top-0 left-0 rounded-full bg-green-500 dark:bg-green-400 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${
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