import React, { useState, useEffect, useCallback } from 'react';

interface Ripple {
  id: number;
  x: number;
  y: number;
  size: number;
}

const RippleEffect: React.FC = () => {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const addRipple = useCallback((e: MouseEvent | TouchEvent) => {
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Only trigger for primary mouse button
      if (e.button !== 0) return;
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const size = 100; // A bit bigger, but not too big
    const newRipple: Ripple = {
      id: Date.now(),
      x: clientX,
      y: clientY,
      size: size,
    };

    setRipples(prevRipples => [...prevRipples, newRipple]);
  }, []);

  useEffect(() => {
    window.addEventListener('mousedown', addRipple as EventListener);
    window.addEventListener('touchstart', addRipple as EventListener);
    return () => {
      window.removeEventListener('mousedown', addRipple as EventListener);
      window.removeEventListener('touchstart', addRipple as EventListener);
    };
  }, [addRipple]);

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples(prevRipples => prevRipples.slice(1));
      }, 700); // Corresponds to animation duration
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]" aria-hidden="true">
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple-effect"
          style={{
            top: `${ripple.y}px`,
            left: `${ripple.x}px`,
            width: `${ripple.size}px`,
            height: `${ripple.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default RippleEffect;