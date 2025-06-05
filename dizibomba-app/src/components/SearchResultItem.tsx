import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaCalendarAlt, FaFilm, FaTv } from 'react-icons/fa';
import { getPosterUrl } from '@/lib/tmdb';

interface SearchResultItemProps {
  item: any;
  mediaType: 'movie' | 'tv' | 'person';
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item, mediaType }) => {
  // Ortak değişkenler
  const id = item.id;
  const posterPath = item.poster_path || item.profile_path;
  const backdropPath = item.backdrop_path;
  
  // Film veya dizi detay sayfası bağlantısı
  const detailLink = mediaType === 'movie' 
    ? `/filmler/${id}`
    : mediaType === 'tv' 
      ? `/diziler/${id}` 
      : `/kisi/${id}`;
  
  // Başlık (film, dizi veya kişi adı)
  const title = mediaType === 'movie' 
    ? item.title 
    : mediaType === 'tv' 
      ? item.name 
      : item.name;
  
  // Yayın tarihi
  const releaseDate = mediaType === 'movie' 
    ? item.release_date 
    : mediaType === 'tv' 
      ? item.first_air_date 
      : null;
  
  // Yıl hesaplaması
  const year = releaseDate 
    ? new Date(releaseDate).getFullYear() 
    : null;
  
  // Puan (kişiler için yok)
  const rating = (mediaType === 'movie' || mediaType === 'tv') ? item.vote_average : null;
  
  // Açıklama
  const overview = item.overview || '';
  
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm rounded-lg overflow-hidden border border-gray-800/50 hover:border-gray-700/50 transition-all hover:shadow-lg group">
      <Link href={detailLink} className="flex flex-col sm:flex-row h-full">
        {/* Poster */}
        <div className="relative w-full sm:w-32 h-48 sm:h-auto flex-shrink-0">
          {posterPath ? (
            <Image
              src={getPosterUrl(posterPath)}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              {mediaType === 'movie' ? (
                <FaFilm className="text-gray-600 text-4xl" />
              ) : mediaType === 'tv' ? (
                <FaTv className="text-gray-600 text-4xl" />
              ) : (
                <div className="text-gray-600 text-4xl">👤</div>
              )}
            </div>
          )}
          
          {/* Medya tipi etiketi */}
          <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium bg-black/70 text-white">
            {mediaType === 'movie' ? 'Film' : mediaType === 'tv' ? 'Dizi' : 'Kişi'}
          </div>
        </div>
        
        {/* İçerik */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-lg font-semibold text-white group-hover:text-red-500 transition-colors mb-1">
            {title}
          </h3>
          
          {/* Meta bilgiler */}
          <div className="flex items-center text-sm text-gray-400 mb-2 flex-wrap gap-3">
            {year && (
              <div className="flex items-center">
                <FaCalendarAlt className="mr-1 text-xs" />
                <span>{year}</span>
              </div>
            )}
            
            {rating && (
              <div className="flex items-center">
                <FaStar className="mr-1 text-yellow-500 text-xs" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            
            {mediaType === 'movie' && (
              <span className="px-1.5 py-0.5 bg-red-600/20 text-red-400 rounded text-xs">
                Film
              </span>
            )}
            
            {mediaType === 'tv' && (
              <span className="px-1.5 py-0.5 bg-blue-600/20 text-blue-400 rounded text-xs">
                Dizi
              </span>
            )}
          </div>
          
          {/* Özet */}
          {overview && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-2">
              {overview}
            </p>
          )}
          
          {/* "Detayları Gör" bağlantısı */}
          <div className="mt-auto pt-2">
            <span className="text-red-500 text-sm group-hover:underline">
              Detayları Gör
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SearchResultItem; 