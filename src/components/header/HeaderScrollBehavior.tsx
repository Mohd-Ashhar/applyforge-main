import { useState, useEffect, useCallback, useRef } from "react";

export const useHeaderScrollBehavior = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Optimized scroll handler with throttling
  const controlHeader = useCallback(() => {
    const currentScrollY = window.scrollY;
    const scrollDifference = Math.abs(currentScrollY - lastScrollY.current);
    const isScrollingDown = currentScrollY > lastScrollY.current;
    const isMobile = window.innerWidth < 768;

    // Only process if scroll difference is significant (reduces unnecessary updates)
    if (scrollDifference < 5) {
      ticking.current = false;
      return;
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isMobile) {
      // Hide header when scrolling down past 100px
      const shouldHide = isScrollingDown && currentScrollY > 100;

      // Show header when scrolling up or at top
      const shouldShow = !isScrollingDown || currentScrollY < 50;

      setIsVisible(shouldShow);
      setIsScrollingUp(!isScrollingDown && currentScrollY > 100);

      // Auto-show header after user stops scrolling (better UX)
      timeoutRef.current = setTimeout(() => {
        if (currentScrollY > 100) {
          setIsVisible(true);
        }
      }, 2000);
    } else {
      // Always visible on desktop
      setIsVisible(true);
      setIsScrollingUp(false);
    }

    lastScrollY.current = currentScrollY;
    ticking.current = false;
  }, []);

  // Throttled scroll handler
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      requestAnimationFrame(controlHeader);
      ticking.current = true;
    }
  }, [controlHeader]);

  // Optimized resize handler
  const handleResize = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    if (!isMobile) {
      setIsVisible(true);
      setIsScrollingUp(false);
    }
  }, []);

  useEffect(() => {
    // Passive listeners for better performance
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (ticking.current) {
        ticking.current = false;
      }
    };
  }, [handleScroll, handleResize]);

  // Reset visibility when component mounts or page loads
  useEffect(() => {
    setIsVisible(true);
    lastScrollY.current = window.scrollY;
  }, []);

  return {
    isVisible,
    isScrollingUp,
    // Additional utilities that might be useful
    scrollY: lastScrollY.current,
  };
};
