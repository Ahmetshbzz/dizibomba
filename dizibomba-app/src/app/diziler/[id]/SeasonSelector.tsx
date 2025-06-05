"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFilm, FaPlay, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Season {
  id: number;
  name: string;
  poster_path: string | null;
  episode_count: number;
  air_date: string | null;
  overview?: string | null;
}

interface SeasonSelectorProps {
  seasons: Season[];
  seriesId: string;
}

const SeasonSelector: React.FC<SeasonSelectorProps> = ({ seasons, seriesId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(seasons.length > 0 ? seasons[0] : null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelectSeason = (season: Season) => {
    setSelectedSeason(season);
    setIsOpen(false);
  };

  if (!seasons || seasons.length === 0) {
    return <p className="text-gray-400">Sezon bilgisi bulunamadı.</p>;
  }

  return (
    <div className="w-full">
      {/* Seçilen sezon gösterimi ve dropdown açma butonu */}
      <div 
        onClick={toggleDropdown}
        className="w-full bg-gray-800/80 hover:bg-gray-700/80 backdrop-blur-sm border border-gray-700 rounded-xl p-4 flex justify-between items-center cursor-pointer transition-colors mb-4"
      >
        <div className="flex items-center">
          <div className="relative w-10 h-14 overflow-hidden rounded-md mr-3">
            {selectedSeason && selectedSeason.poster_path ? (
              <Image
                src={`https://image.tmdb.org/t/p/w92${selectedSeason.poster_path}`}
                alt={selectedSeason.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                <FaFilm className="text-gray-500" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-white font-medium">{selectedSeason?.name}</h3>
            <p className="text-sm text-gray-400">
              {selectedSeason?.episode_count} Bölüm
              {selectedSeason?.air_date && ` • ${new Date(selectedSeason.air_date).getFullYear()}`}
            </p>
          </div>
        </div>
        <div className="text-gray-400">
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {/* Dropdown menü */}
      {isOpen && (
        <div className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl p-3 mb-6 shadow-xl">
          <div className="max-h-[350px] overflow-y-auto">
            {seasons.map((season) => (
              <div
                key={season.id}
                onClick={() => handleSelectSeason(season)}
                className={`p-3 flex items-start hover:bg-gray-700/50 cursor-pointer rounded-lg mb-1 transition-colors ${
                  selectedSeason?.id === season.id ? 'bg-gray-700/70' : ''
                }`}
              >
                <div className="relative w-12 h-16 overflow-hidden rounded-md mr-3 flex-shrink-0">
                  {season.poster_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${season.poster_path}`}
                      alt={season.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="bg-gray-700 w-full h-full flex items-center justify-center">
                      <FaFilm className="text-gray-500" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">{season.name}</h3>
                  <p className="text-sm text-gray-400">
                    {season.episode_count} Bölüm
                    {season.air_date && ` • ${new Date(season.air_date).getFullYear()}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seçilen sezon detayı */}
      {selectedSeason && (
        <div className="mt-2 p-5 bg-gray-900/70 backdrop-blur-sm rounded-xl border border-gray-800/60">
          <div className="flex md:items-center flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="relative w-40 h-60 md:w-48 md:h-72 rounded-lg overflow-hidden shadow-lg flex-shrink-0 mx-auto md:mx-0">
              {selectedSeason.poster_path ? (
                <Image
                  src={`https://image.tmdb.org/t/p/w300${selectedSeason.poster_path}`}
                  alt={selectedSeason.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-800">
                  <span className="text-gray-500">Görsel Yok</span>
                </div>
              )}
            </div>
            
            {/* Sezon Bilgileri */}
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-white mb-2">{selectedSeason.name}</h3>
              <div className="flex flex-wrap gap-3 text-sm mb-4">
                <span className="px-2 py-1 bg-red-600/20 text-red-400 rounded-md">
                  {selectedSeason.episode_count} Bölüm
                </span>
                {selectedSeason.air_date && (
                  <span className="px-2 py-1 bg-blue-600/20 text-blue-400 rounded-md">
                    {new Date(selectedSeason.air_date).getFullYear()}
                  </span>
                )}
              </div>
              <p className="text-gray-300 mb-4">
                {selectedSeason.overview || "Bu sezon için özet bilgisi bulunmuyor."}
              </p>
              <Link 
                href={`/izle/dizi/${seriesId}?season=${selectedSeason.id}`}
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <FaPlay className="mr-2" /> Bölümleri İzle
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SeasonSelector; 