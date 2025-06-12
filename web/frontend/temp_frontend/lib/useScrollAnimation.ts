/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 */
'use client';

import { useEffect, useRef, useState } from 'react';
import type { ScrollAnimationOptions, ScrollAnimationReturn } from '@/types';

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(options: ScrollAnimationOptions = {}): ScrollAnimationReturn<T> {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -10% 0px',
    triggerOnce = true,
  } = options;

  const elementRef = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(entry.target);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentElement = elementRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { elementRef, isVisible };
}

export const fadeInUpVariants = {
  hidden: 'opacity-0 translate-y-8',
  visible: 'opacity-100 translate-y-0 transition-all duration-700 ease-out',
};

export const fadeInVariants = {
  hidden: 'opacity-0',
  visible: 'opacity-100 transition-opacity duration-1000 ease-out',
};

export const scaleInVariants = {
  hidden: 'opacity-0 scale-95',
  visible: 'opacity-100 scale-100 transition-all duration-500 ease-out',
};