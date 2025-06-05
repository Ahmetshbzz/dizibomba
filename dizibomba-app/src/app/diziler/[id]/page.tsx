// Sunucu bileşeni olarak çalışacak
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  getSeriesDetails, 
  getSeriesCredits, 
  getSeriesVideos, 
  getBackdropUrl, 
  getPosterUrl 
} from '@/lib/tmdb';
import { FaStar, FaCalendarAlt, FaFilm, FaGlobe, FaTicketAlt, FaPlay } from 'react-icons/fa';
import SeasonSelector from './SeasonSelector';

// Tip tanımlamaları
interface Person {
  id: number;
  name: string;
  profile_path: string | null;
  character?: string;
  job?: string;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Season {
  id: number;
  name: string;
  poster_path: string | null;
  episode_count: number;
  air_date: string | null;
  overview?: string | null;
}

interface Network {
  id: number;
  name: string;
  logo_path: string | null;
}

interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const seriesId = parseInt(params.id, 10);
  const series = await getSeriesDetails(seriesId);
  
  if (!series) {
    return {
      title: 'Dizi Bulunamadı | DiziBomba',
      description: 'Aradığınız dizi bulunamadı.',
    };
  }
  
  return {
    title: `${series.name} | DiziBomba`,
    description: series.overview || 'Dizi detayları',
  };
}

async function SeriesDetailPage({ params }: { params: { id: string } }) {
  const seriesId = parseInt(params.id, 10);
  
  // Paralel olarak tüm verileri çek
  const [seriesDetails, creditsData, videos] = await Promise.all([
    getSeriesDetails(seriesId),
    getSeriesCredits(seriesId),
    getSeriesVideos(seriesId),
  ]);
  
  // Dizi bulunamadıysa hata mesajı göster
  if (!seriesDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Dizi Bulunamadı</h1>
          <p className="text-gray-400">Aradığınız dizi mevcut değil veya kaldırılmış olabilir.</p>
          <Link 
            href="/diziler" 
            className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Dizilere Dön
          </Link>
        </div>
      </div>
    );
  }
  
  // Fragman varsa ilk fragmanı al
  const trailer = videos?.find((video: Video) => video.type === 'Trailer') || videos?.[0];
  
  // Oyuncu kadrosu (en fazla 10 kişi)
  const cast = creditsData?.cast?.slice(0, 10) || [];
  
  // Yaratıcılar
  const creators = seriesDetails.created_by || [];
  
  // Yıl formatı
  const firstAirYear = seriesDetails.first_air_date ? new Date(seriesDetails.first_air_date).getFullYear() : null;
  const lastAirYear = seriesDetails.last_air_date ? new Date(seriesDetails.last_air_date).getFullYear() : null;
  
  return (
    <main className="min-h-screen">
      {/* Hero Bölümü - Dizi Bilgileri */}
      <section className="relative">
        {/* Arkaplan Görseli */}
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          <Image
            src={getBackdropUrl(seriesDetails.backdrop_path || seriesDetails.poster_path)}
            alt={seriesDetails.name}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Dizi Posteri */}
            <div className="relative w-64 h-96 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl hidden md:block">
              <Image
                src={getPosterUrl(seriesDetails.poster_path)}
                alt={seriesDetails.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Dizi Bilgileri */}
            <div className="max-w-3xl text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 px-2 sm:px-0">
                {seriesDetails.name}
              </h1>
              
              {seriesDetails.tagline && (
                <p className="text-gray-300 text-lg italic mb-4 px-2 sm:px-0">"{seriesDetails.tagline}"</p>
              )}
              
              {/* Meta Bilgiler */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6 px-2 sm:px-0">
                {firstAirYear && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-red-500" />
                    <span>
                      {firstAirYear}
                      {lastAirYear && lastAirYear !== firstAirYear && ` - ${lastAirYear}`}
                    </span>
                  </div>
                )}
                
                {seriesDetails.number_of_seasons && (
                  <div className="flex items-center">
                    <FaFilm className="mr-1 text-red-500" />
                    <span>
                      {seriesDetails.number_of_seasons} Sezon
                      {seriesDetails.number_of_episodes && `, ${seriesDetails.number_of_episodes} Bölüm`}
                    </span>
                  </div>
                )}
                
                {seriesDetails.vote_average > 0 && (
                  <div className="flex items-center">
                    <FaStar className="mr-1 text-yellow-500" />
                    <span>{seriesDetails.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
                
                {seriesDetails.original_language && (
                  <div className="flex items-center">
                    <FaGlobe className="mr-1 text-red-500" />
                    <span>{seriesDetails.original_language.toUpperCase()}</span>
                  </div>
                )}
              </div>
              
              {/* Kategoriler */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6 px-2 sm:px-0">
                {seriesDetails.genres?.map((genre: Genre) => (
                  <Link 
                    key={genre.id} 
                    href={`/kategori/${genre.id}?type=tv`}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-white transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
              
              {/* Özet */}
              <p className="text-gray-300 mb-6 px-2 sm:px-0 text-sm sm:text-base">
                {seriesDetails.overview || "Bu dizi için özet bulunmuyor."}
              </p>
              
              {/* Butonlar */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4 px-2 sm:px-0">
                <Link 
                  href={`/izle/dizi/${params.id}`}
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white flex items-center transition-colors"
                >
                  <FaPlay className="mr-2" /> Şimdi İzle
                </Link>
                
                {trailer && (
                  <a 
                    href={`https://www.youtube.com/watch?v=${trailer.key}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white flex items-center transition-colors"
                  >
                    <FaPlay className="mr-2" /> Fragman İzle
                  </a>
                )}
              </div>
              
              {/* Yaratıcı Bilgisi */}
              {creators.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-white text-sm mb-1">Yaratıcı{creators.length > 1 ? 'lar' : ''}</h3>
                  <p className="text-gray-300">
                    {creators.map((creator: Person, index: number) => (
                      <span key={creator.id}>
                        {creator.name}
                        {index < creators.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* İçerik Bölümü */}
      <div className="container mx-auto px-4 py-12">
        {/* Sezonlar - Dropdown olarak değiştiriliyor */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4">
            Sezonlar
          </h2>
          
          {seriesDetails.seasons?.length > 0 ? (
            <SeasonSelector seasons={seriesDetails.seasons} seriesId={params.id} />
          ) : (
            <p className="text-gray-400">Sezon bilgisi bulunamadı.</p>
          )}
        </section>
      
        {/* Dizi Bilgileri */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">
            Dizi Bilgileri
          </h2>
          
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium text-white mb-4 opacity-90">Temel Bilgiler</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-400 w-32 text-sm">Orijinal Başlık</span>
                    <span className="text-white font-light">{seriesDetails.original_name}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 w-32 text-sm">İlk Yayın</span>
                    <span className="text-white font-light">{seriesDetails.first_air_date || 'Belirtilmemiş'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 w-32 text-sm">Son Yayın</span>
                    <span className="text-white font-light">{seriesDetails.last_air_date || 'Devam ediyor'}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 w-32 text-sm">Durum</span>
                    <span className="text-white font-light">{seriesDetails.status}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 w-32 text-sm">Tür</span>
                    <span className="text-white font-light">{seriesDetails.type}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {seriesDetails.networks?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-medium text-white mb-3 opacity-90">Kanallar</h3>
                    <div className="flex flex-wrap gap-2">
                      {seriesDetails.networks.map((network: Network) => (
                        <span 
                          key={network.id} 
                          className="inline-block px-3 py-1 bg-gray-800/70 rounded-md text-sm text-gray-200"
                        >
                          {network.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {seriesDetails.production_companies?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-medium text-white mb-3 opacity-90">Yapım Şirketleri</h3>
                    <div className="flex flex-wrap gap-2">
                      {seriesDetails.production_companies.map((company: ProductionCompany) => (
                        <span 
                          key={company.id} 
                          className="inline-block px-3 py-1 bg-gray-800/70 rounded-md text-sm text-gray-200"
                        >
                          {company.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {seriesDetails.production_countries?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-medium text-white mb-3 opacity-90">Yapım Ülkeleri</h3>
                    <div className="flex flex-wrap gap-2">
                      {seriesDetails.production_countries.map((country: ProductionCountry) => (
                        <span 
                          key={country.iso_3166_1} 
                          className="inline-block px-3 py-1 bg-gray-800/70 rounded-md text-sm text-gray-200"
                        >
                          {country.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default SeriesDetailPage; 