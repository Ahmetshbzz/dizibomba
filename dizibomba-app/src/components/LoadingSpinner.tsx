"use client";

import React from "react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  isLoading: boolean;
  size?: "sm" | "md" | "lg";
  color?: string;
  showText?: boolean;
  text?: string;
  fullScreen?: boolean;
  spinDuration?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  isLoading,
  size = "md",
  color = "red-600",
  showText = true,
  text = "Yükleniyor...",
  fullScreen = true,
  spinDuration = 1.5
}) => {
  if (!isLoading) return null;

  // Boyut değerlerini belirle
  const sizeValues = {
    sm: { outer: "w-10 h-10", inner: "inset-1", text: "text-xs" },
    md: { outer: "w-16 h-16", inner: "inset-2", text: "text-sm" },
    lg: { outer: "w-24 h-24", inner: "inset-3", text: "text-base" }
  };

  const { outer, inner, text: textSize } = sizeValues[size];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`${fullScreen ? "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" : "flex items-center justify-center"}`}
    >
      <div className="flex flex-col items-center">
        <div className={`relative ${outer}`}>
          {/* Dış halka */}
          <motion.div
            className={`absolute inset-0 border-4 border-${color}/30 rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: spinDuration, repeat: Infinity, ease: "linear" }}
          />
          
          {/* İç halka */}
          <motion.div
            className={`absolute ${inner} border-4 border-t-${color} border-r-transparent border-b-transparent border-l-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{ duration: spinDuration * 0.7, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-${color} font-bold ${textSize}`}>DB</span>
          </div>
        </div>
        {showText && <p className={`mt-4 text-white ${textSize} font-medium`}>{text}</p>}
      </div>
    </motion.div>
  );
};

export default LoadingSpinner; 