import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar, FaPlay } from "react-icons/fa";
import { getPosterUrl, MovieResult, SeriesResult } from "@/lib/tmdb";

interface MovieCardProps {
  item: MovieResult | SeriesResult;
  type?: 'movie' | 'tv';
}

const MovieCard: React.FC<MovieCardProps> = ({ item, type = 'movie' }) => {
  // Film veya dizi detay sayfası bağlantısı
  const detailLink = type === 'movie' 
    ? `/filmler/${item.id}`
    : `/diziler/${item.id}`;
    
  // Film veya dizi izleme sayfası bağlantısı
  const watchLink = `/izle/${type === 'movie' ? 'film' : 'dizi'}/${item.id}`;

  // Filmin başlığı (film ise title, dizi ise name)
  const title = 'title' in item ? item.title : item.name;
  
  // Yıl hesaplaması
  const releaseDate = 'release_date' in item 
    ? item.release_date 
    : item.first_air_date;
  
  const year = releaseDate 
    ? new Date(releaseDate).getFullYear() 
    : null;
  
  return (
    <div className="group relative">
      <Link href={detailLink} className="block">
        <div className="bg-gray-900 rounded overflow-hidden relative shadow-md transform transition-all hover:scale-[1.02]">
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <Image
              src={getPosterUrl(item.poster_path)}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover"
              loading="lazy"
            />
            
            {/* Koyu Katman ve Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
          
          {/* Bilgi Alanı */}
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h3 className="text-white text-sm font-medium line-clamp-1 group-hover:text-red-500 transition-colors">
              {title}
            </h3>
            
            <div className="flex justify-between items-center mt-0.5">
              {/* Yıl Bilgisi */}
              {year && (
                <span className="text-xs text-gray-400">{year}</span>
              )}
              
              {/* Puan */}
              {item.vote_average > 0 && (
                <div className="flex items-center">
                  <FaStar className="text-yellow-500 mr-0.5 text-[10px]" />
                  <span className="text-xs text-gray-300">{item.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {/* TV Badge - Dizi ise göster */}
            {type === 'tv' && (
              <span className="absolute top-1 right-1 bg-red-600 text-white text-[10px] px-1 py-0.5 rounded">
                Dizi
              </span>
            )}
          </div>
        </div>
      </Link>
      
      {/* İzle Butonu - Hover'da gösterilir */}
      <Link 
        href={watchLink}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white p-3 rounded-full opacity-0 group-hover:opacity-90 transition-all z-10 duration-300"
        title={`${title} İzle`}
      >
        <FaPlay className="text-sm" />
      </Link>
    </div>
  );
};

export default MovieCard; 