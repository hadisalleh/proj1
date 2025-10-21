'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

export default function LazyLoad({
  children,
  fallback = null,
  rootMargin = '50px',
  threshold = 0.1,
  className = ''
}: LazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.unobserve(element);
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, hasLoaded]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible || hasLoaded ? children : fallback}
    </div>
  );
}