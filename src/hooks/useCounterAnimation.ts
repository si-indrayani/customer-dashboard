import { useEffect, useState } from 'react';

interface UseCounterAnimationOptions {
  end: number;
  duration?: number;
  start?: number;
  decimals?: number;
}

export const useCounterAnimation = ({ 
  end, 
  duration = 2000, 
  start = 0, 
  decimals = 0 
}: UseCounterAnimationOptions) => {
  const [count, setCount] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const currentCount = start + (end - start) * easeOutQuart;
      
      setCount(parseFloat(currentCount.toFixed(decimals)));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [end, duration, start, decimals]);

  return { count, isAnimating };
};

export default useCounterAnimation;
