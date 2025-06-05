"use client";

import React, { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePageTransition, TransitionType } from "./PageTransitionProvider";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  const { isLoading, transitionType, transitionDuration } = usePageTransition();

  // Animasyon varyantlarını tanımla
  const getVariants = () => {
    const duration = transitionDuration / 1000; // saniyeye çevir
    
    switch (transitionType) {
      case TransitionType.FADE:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration, ease: "easeInOut" }
        };
      case TransitionType.SLIDE:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { duration, ease: "easeInOut" }
        };
      case TransitionType.SCALE:
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 1.05 },
          transition: { duration, ease: "easeInOut" }
        };
      case TransitionType.NONE:
      default:
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 },
          transition: { duration: 0 }
        };
    }
  };

  // Sayfa yüklenirken içeriği gizle
  if (isLoading) {
    return null;
  }

  const variants = getVariants();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`page-${transitionType}`}
        initial={variants.initial}
        animate={variants.animate}
        exit={variants.exit}
        transition={variants.transition}
        className={`page-content ${className}`}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition; 