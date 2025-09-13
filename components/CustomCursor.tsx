import React, { useState, useEffect } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      const target = e.target as HTMLElement;
      if (target) {
        setIsPointer(
          window.getComputedStyle(target).getPropertyValue('cursor') === 'pointer'
        );
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

  return (
    <div className={`custom-cursor ${isHovering ? 'visible' : 'invisible'}`}>
      <div
        className={`fixed top-0 left-0 pointer-events-none z-[9999] rounded-full transition-all duration-300 ease-out ${
          isPointer ? 'scale-150 border-2' : 'scale-100 border'
        } border-green-500 dark:border-red-500`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
          width: '40px',
          height: '40px',
        }}
      />
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-green-500 dark:bg-red-500 transition-all duration-100 ease-out"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) translate(-50%, -50%)`,
          width: '8px',
          height: '8px',
        }}
      />
    </div>
  );
};

export default CustomCursor;
