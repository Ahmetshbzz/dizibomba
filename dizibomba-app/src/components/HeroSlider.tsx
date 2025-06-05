"use client";

import { MovieResult, SeriesResult } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { FaStar, FaPlay } from "react-icons/fa";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface HeroSliderProps {
  items: (MovieResult | SeriesResult)[];
  movies?: MovieResult[]; // Geriye dönük uyumluluk için
  type?: 'movie' | 'tv';
}

const HeroSlider: React.FC<HeroSliderProps> = ({ items = [], movies, type = 'movie' }) => {
  // Geriye dönük uyumluluk için eski prop'u kontrol ediyoruz
  const sliderItems = items.length > 0 ? items : (movies || []);
  
  const [activeSlide, setActiveSlide] = useState(0);

  // Eğer gösterilecek öğe yoksa, null döndürerek bileşeni render etmiyoruz
  if (!sliderItems || sliderItems.length === 0) {
    return null;
  }

  // Slider ayarları
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    fade: true,
    beforeChange: (_: any, next: number) => setActiveSlide(next),
  };

  return (
    <div className="relative overflow-hidden shadow-inner">
      <Slider {...settings}>
        {sliderItems.slice(0, 5).map((item) => {
          // Film veya dizi olduğunu kontrol et
          const isMovie = 'title' in item;
          const title = isMovie ? item.title : item.name;
          const releaseDate = isMovie ? item.release_date : item.first_air_date;
          const detailLink = isMovie ? `/filmler/${item.id}` : `/diziler/${item.id}`;
          
          return (
            <div key={item.id} className="relative">
              {/* Görüntü Arkaplanı */}
              <div className="relative w-full h-[50vh] md:h-[60vh] max-h-[700px] overflow-hidden">
                {/* Arkaplan Görüntüsü */}
                <Image
                  src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`}
                  alt={title}
                  fill
                  priority
                  className="object-cover object-center"
                />
                
                {/* Gradient Katmanı */}
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
              </div>

              {/* İçerik */}
              <div className="absolute inset-0 flex items-center">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="max-w-2xl">
                    {/* Başlık */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
                      {title}
                    </h1>

                    {/* Değerlendirmeler */}
                    <div className="flex items-center mb-2 md:mb-3">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span className="text-white font-medium">
                        {item.vote_average?.toFixed(1)}
                      </span>
                      <span className="mx-2 text-gray-500">•</span>
                      <span className="text-white">{releaseDate?.split("-")[0]}</span>
                    </div>

                    {/* Özet */}
                    <p className="text-gray-300 mb-4 line-clamp-2 md:line-clamp-3 text-sm md:text-base max-w-xl">
                      {item.overview}
                    </p>
                    
                    {/* Butonlar */}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={detailLink}
                        className="inline-flex items-center px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition-colors text-sm"
                      >
                        <FaPlay className="mr-2" /> İzle
                      </Link>
                      <Link
                        href={detailLink}
                        className="inline-flex items-center px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-white transition-colors text-sm"
                      >
                        Detaylar
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
      
      {/* Mini Slide Göstergeleri */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center">
        <div className="flex space-x-1">
          {sliderItems.slice(0, 5).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const slider = document.querySelector('.slick-slider') as any;
                if (slider && slider.slickGoTo) {
                  slider.slickGoTo(index);
                }
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                activeSlide === index 
                  ? "bg-red-600" 
                  : "bg-white/30"
              }`}
              aria-label={`${index + 1}. slayta git`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSlider; 