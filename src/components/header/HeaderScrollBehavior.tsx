
import { useState, useEffect } from 'react';

export const useHeaderScrollBehavior = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlHeader = () => {
      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;
      const shouldHide = isScrollingDown && currentScrollY > 100; // Hide after scrolling 100px down
      
      // Only apply scroll behavior on mobile screens
      if (window.innerWidth < 768) {
        setIsVisible(!shouldHide);
      } else {
        setIsVisible(true); // Always visible on desktop
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  return { isVisible };
};
