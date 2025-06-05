"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight, FaArrowRight } from "react-icons/fa";
import MovieCard from "./MovieCard";
import { MovieResult, SeriesResult } from "@/lib/tmdb";

interface ContentRowProps {
  title: string;
  items: MovieResult[] | SeriesResult[];
  viewAllLink?: string;
  type?: 'movie' | 'tv';
}

const ContentRow: React.FC<ContentRowProps> = ({
  title,
  items,
  viewAllLink,
  type = 'movie',
}) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Scroll butonlarının durumunu kontrol et
  const checkScrollButtons = () => {
    if (!rowRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    
    // Sol butonu göster/gizle
    setCanScrollLeft(scrollLeft > 0);
    
    // Sağ butonu göster/gizle
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  };

  useEffect(() => {
    const handleResize = () => {
      checkScrollButtons();
    };
    
    window.addEventListener('resize', handleResize);
    checkScrollButtons();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  // Kartların yatay scroll'u için yardımcı fonksiyon
  const scroll = (direction: "left" | "right") => {
    if (!rowRef.current) return;
    
    const { current } = rowRef;
    const cardWidth = current.querySelector("div")?.clientWidth || 200;
    const scrollAmount = cardWidth * 2; // İki kart genişliği kadar kaydır
    
    if (direction === "left") {
      current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    } else {
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
    
    // Kaydırma tamamlandığında butonların durumunu güncelle
    setTimeout(() => {
      checkScrollButtons();
    }, 300);
  };

  const handleScroll = () => {
    checkScrollButtons();
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="px-4 mb-3 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">{title}</h2>

        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="flex items-center text-red-500 hover:text-red-400 transition-colors text-sm"
          >
            <span className="mr-1">Tümünü Gör</span>
            <FaArrowRight className="text-xs" />
          </Link>
        )}
      </div>

      <div className="relative">
        {/* Scroll sol düğmesi - Sadece gereğinde göster */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
            aria-label="Sola kaydır"
          >
            <FaChevronLeft className="text-xs" />
          </button>
        )}

        {/* Scroll sağ düğmesi - Sadece gereğinde göster */}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 hover:bg-red-600 text-white p-1.5 rounded-full transition-colors"
            aria-label="Sağa kaydır"
          >
            <FaChevronRight className="text-xs" />
          </button>
        )}

        {/* Yatay kaydırılabilir içerik */}
        <div
          ref={rowRef}
          className="flex space-x-3 overflow-x-auto pb-4 pt-1 no-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onScroll={handleScroll}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className="flex-none w-[140px] sm:w-[160px] md:w-[180px]"
            >
              <MovieCard item={item} type={type} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentRow; 