"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";

// Geçiş türleri için enum
export enum TransitionType {
  FADE = "fade",
  SLIDE = "slide",
  SCALE = "scale",
  NONE = "none"
}

// Geçiş durumu için context
interface TransitionContextType {
  isLoading: boolean;
  transitionType: TransitionType;
  setTransitionType: (type: TransitionType) => void;
  transitionDuration: number;
  setTransitionDuration: (duration: number) => void;
}

const defaultContext: TransitionContextType = {
  isLoading: false,
  transitionType: TransitionType.FADE,
  setTransitionType: () => {},
  transitionDuration: 300,
  setTransitionDuration: () => {}
};

const TransitionContext = createContext<TransitionContextType>(defaultContext);

export const usePageTransition = () => useContext(TransitionContext);

interface PageTransitionProviderProps {
  children: ReactNode;
  initialTransitionType?: TransitionType;
  initialTransitionDuration?: number;
  showLoadingSpinner?: boolean;
}

export function PageTransitionProvider({ 
  children, 
  initialTransitionType = TransitionType.FADE,
  initialTransitionDuration = 300,
  showLoadingSpinner = true
}: PageTransitionProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [transitionType, setTransitionType] = useState<TransitionType>(initialTransitionType);
  const [transitionDuration, setTransitionDuration] = useState(initialTransitionDuration);

  useEffect(() => {
    let startTimeoutId: NodeJS.Timeout;
    let completeTimeoutId: NodeJS.Timeout;
    
    // Sayfa değiştiğinde yükleme durumunu başlat
    const handleStart = () => {
      // Çok kısa geçişlerde yanıp sönmeyi önlemek için timeout kullan
      startTimeoutId = setTimeout(() => {
        setIsLoading(true);
      }, 50); // Daha hızlı başlatma
    };

    // Sayfa yüklendiğinde yükleme durumunu sonlandır
    const handleComplete = () => {
      clearTimeout(startTimeoutId);
      
      // Animasyonun tamamlanması için kısa bir gecikme ekle
      completeTimeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 200); // Daha hızlı tamamlama
    };

    // Sayfa değişikliğinde yükleme durumunu başlat
    handleStart();
    
    // Sayfa yüklendiğinde yükleme durumunu sonlandır
    const timer = setTimeout(() => {
      handleComplete();
    }, 400); // Daha hızlı yükleme süresi
    
    return () => {
      clearTimeout(startTimeoutId);
      clearTimeout(completeTimeoutId);
      clearTimeout(timer);
    };
  }, [pathname, searchParams]);

  const contextValue: TransitionContextType = {
    isLoading,
    transitionType,
    setTransitionType,
    transitionDuration,
    setTransitionDuration
  };

  return (
    <TransitionContext.Provider value={contextValue}>
      {children}
      {showLoadingSpinner && <LoadingSpinner isLoading={isLoading} />}
    </TransitionContext.Provider>
  );
} 