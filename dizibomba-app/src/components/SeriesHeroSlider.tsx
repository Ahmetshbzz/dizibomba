"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import { FaStar, FaPlay, FaInfoCircle } from "react-icons/fa";
import { SeriesResult, getPosterUrl, getBackdropUrl } from "@/lib/tmdb";

// Slick CSS dosyalarını import etmeyi unutmayın
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface SeriesHeroSliderProps {
  series: SeriesResult[];
}

const SeriesHeroSlider: React.FC<SeriesHeroSliderProps> = ({ series }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Arka plan görsellerinin yüklenmesi için kısa bir süre bekleyelim
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    fade: true,
    beforeChange: (_current: number, next: number) => setCurrentSlide(next),
  };

  return (
    <div className="relative">
      <Slider {...settings} className="hero-slider">
        {series.map((serie, index) => {
          // Yıl bilgisini hesapla
          const year = new Date(serie.first_air_date || '').getFullYear();
          const validYear = !isNaN(year) ? year : null;
          
          return (
            <div key={serie.id} className="relative h-[500px] sm:h-[600px] md:h-[650px] overflow-hidden">
              {/* Arka plan filtresi - Sadeleştirilmiş ve minimalist */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10" />
              
              {/* Arka plan görseli */}
              <div className="absolute inset-0">
                <Image
                  src={getBackdropUrl(serie.backdrop_path || serie.poster_path)}
                  alt={serie.name}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                  className={`transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                />
              </div>
              
              {/* Dizi bilgileri */}
              <div className="relative z-20 h-full container mx-auto px-4 flex flex-col justify-end pb-16 pt-20">
                {currentSlide === index && (
                  <div className="max-w-3xl">
                    {/* Badge - Dizi */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-600 text-white text-sm font-medium mb-6">
                      <FaPlay className="mr-1" size={12} />
                      <span>Dizi</span>
                    </div>
                    
                    {/* Dizi Başlığı */}
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                      {serie.name}
                    </h2>
                    
                    {/* Dizi Bilgi Alanı */}
                    <div className="flex flex-wrap items-center text-white gap-4 mb-6">
                      <div className="flex items-center px-3 py-1 rounded-md bg-yellow-500/20 backdrop-blur-sm">
                        <FaStar className="text-yellow-500 mr-2" />
                        <span className="font-semibold">{serie.vote_average.toFixed(1)}</span>
                      </div>
                      
                      {validYear && (
                        <div className="px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm">
                          {validYear}
                        </div>
                      )}
                      
                      {/* Dil bilgisi */}
                      <div className="px-3 py-1 rounded-md bg-white/10 backdrop-blur-sm">
                        TR
                      </div>
                    </div>
                    
                    {/* Dizi Açıklaması */}
                    <p className="text-gray-300 mb-8 max-w-2xl text-base md:text-lg line-clamp-3 md:line-clamp-4">
                      {serie.overview || "Bu dizi için özet bulunmuyor."}
                    </p>
                    
                    {/* Butonlar */}
                    <div className="flex flex-wrap gap-4">
                      <Link
                        href={`/diziler/${serie.id}`}
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 transition-colors duration-200 text-white font-bold py-3 px-6 rounded-lg"
                      >
                        <FaPlay className="mr-2" /> Hemen İzle
                      </Link>
                      
                      <Link
                        href={`/diziler/${serie.id}`}
                        className="inline-flex items-center bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-colors duration-200 text-white font-bold py-3 px-6 rounded-lg"
                      >
                        <FaInfoCircle className="mr-2" /> Detaylar
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </Slider>
      
      {/* İndikatörler - Minimalist tasarım */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center z-30">
        {series.map((_, index) => (
          <button
            key={index}
            onClick={() => (Slider as any).slickGoTo?.(index)}
            className={`w-10 h-1 mx-1 rounded-full transition-all duration-200 ${
              index === currentSlide 
                ? "bg-blue-600 w-12" 
                : "bg-white/30"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SeriesHeroSlider; 