import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  getMovieDetails, 
  getMovieCredits, 
  getMovieVideos, 
  getBackdropUrl, 
  getPosterUrl
} from '@/lib/tmdb';
import { FaStar, FaCalendarAlt, FaClock, FaGlobe, FaTicketAlt, FaPlay } from 'react-icons/fa';

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
  const movieId = parseInt(params.id, 10);
  const movie = await getMovieDetails(movieId);
  
  if (!movie) {
    return {
      title: 'Film Bulunamadı | DiziBomba',
      description: 'Aradığınız film bulunamadı.',
    };
  }
  
  return {
    title: `${movie.title} | DiziBomba`,
    description: movie.overview || 'Film detayları',
  };
}

async function MovieDetailPage({ params }: { params: { id: string } }) {
  const movieId = parseInt(params.id, 10);
  
  // Paralel olarak tüm verileri çek
  const [movieDetails, creditsData, videos] = await Promise.all([
    getMovieDetails(movieId),
    getMovieCredits(movieId),
    getMovieVideos(movieId),
  ]);
  
  // Film bulunamadıysa hata mesajı göster
  if (!movieDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Film Bulunamadı</h1>
          <p className="text-gray-400">Aradığınız film mevcut değil veya kaldırılmış olabilir.</p>
          <Link 
            href="/filmler" 
            className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Filmlere Dön
          </Link>
        </div>
      </div>
    );
  }
  
  // Fragman varsa ilk fragmanı al
  const trailer = videos?.find((video: Video) => video.type === 'Trailer') || videos?.[0];
  
  // Oyuncu kadrosu (en fazla 10 kişi)
  const cast = creditsData?.cast?.slice(0, 10) || [];
  
  // Yönetmen
  const director = creditsData?.crew?.find((person: Person) => person.job === 'Director');
  
  // Film süresi formatı
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}s ${mins}dk`;
  };
  
  // Yıl formatı
  const releaseYear = movieDetails.release_date ? new Date(movieDetails.release_date).getFullYear() : null;
  
  return (
    <main className="min-h-screen">
      {/* Hero Bölümü - Film Bilgileri */}
      <section className="relative">
        {/* Arkaplan Görseli */}
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          <Image
            src={getBackdropUrl(movieDetails.backdrop_path || movieDetails.poster_path)}
            alt={movieDetails.title}
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
        </div>

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Film Posteri */}
            <div className="relative w-64 h-96 flex-shrink-0 rounded-lg overflow-hidden shadow-2xl hidden md:block">
              <Image
                src={getPosterUrl(movieDetails.poster_path)}
                alt={movieDetails.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Film Bilgileri */}
            <div className="max-w-3xl text-center md:text-left">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 px-2 sm:px-0">
                {movieDetails.title}
              </h1>
              
              {movieDetails.tagline && (
                <p className="text-gray-300 text-lg italic mb-4 px-2 sm:px-0">"{movieDetails.tagline}"</p>
              )}
              
              {/* Meta Bilgiler */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6 px-2 sm:px-0">
                {releaseYear && (
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1 text-red-500" />
                    <span>{releaseYear}</span>
                  </div>
                )}
                
                {movieDetails.runtime && (
                  <div className="flex items-center">
                    <FaClock className="mr-1 text-red-500" />
                    <span>{formatRuntime(movieDetails.runtime)}</span>
                  </div>
                )}
                
                {movieDetails.vote_average > 0 && (
                  <div className="flex items-center">
                    <FaStar className="mr-1 text-yellow-500" />
                    <span>{movieDetails.vote_average.toFixed(1)}/10</span>
                  </div>
                )}
                
                {movieDetails.original_language && (
                  <div className="flex items-center">
                    <FaGlobe className="mr-1 text-red-500" />
                    <span>{movieDetails.original_language.toUpperCase()}</span>
                  </div>
                )}
              </div>
              
              {/* Kategoriler */}
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6 px-2 sm:px-0">
                {movieDetails.genres?.map((genre: Genre) => (
                  <Link 
                    key={genre.id} 
                    href={`/kategori/${genre.id}?type=movie`}
                    className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-sm text-white transition-colors"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>
              
              {/* Özet */}
              <p className="text-gray-300 mb-6 px-2 sm:px-0 text-sm sm:text-base">
                {movieDetails.overview || "Bu film için özet bulunmuyor."}
              </p>
              
              {/* Butonlar */}
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4 px-2 sm:px-0">
                <Link 
                  href={`/izle/film/${params.id}`}
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
              
              {/* Yönetmen Bilgisi */}
              {director && (
                <div className="mb-4">
                  <h3 className="text-white text-sm mb-1">Yönetmen</h3>
                  <p className="text-gray-300">{director.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* İçerik Bölümü */}
      <div className="container mx-auto px-4 py-12">
        {/* Detaylar */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-8 border-l-4 border-red-600 pl-4">
            Film Bilgileri
          </h2>
          <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-medium text-white mb-4 opacity-90">Temel Bilgiler</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-400 w-32 text-sm">Orijinal Başlık</span>
                    <span className="text-white font-light">{movieDetails.original_title}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 w-32 text-sm">Yapım Yılı</span>
                    <span className="text-white font-light">{releaseYear}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 w-32 text-sm">Durum</span>
                    <span className="text-white font-light">{movieDetails.status}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 w-32 text-sm">Bütçe</span>
                    <span className="text-white font-light">
                      {movieDetails.budget > 0 
                        ? `$${movieDetails.budget.toLocaleString()}` 
                        : 'Belirtilmemiş'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-400 w-32 text-sm">Hasılat</span>
                    <span className="text-white font-light">
                      {movieDetails.revenue > 0 
                        ? `$${movieDetails.revenue.toLocaleString()}` 
                        : 'Belirtilmemiş'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                {movieDetails.production_companies?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-medium text-white mb-3 opacity-90">Yapım Şirketleri</h3>
                    <div className="flex flex-wrap gap-2">
                      {movieDetails.production_companies.map((company: ProductionCompany) => (
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
                
                {movieDetails.production_countries?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-medium text-white mb-3 opacity-90">Yapım Ülkeleri</h3>
                    <div className="flex flex-wrap gap-2">
                      {movieDetails.production_countries.map((country: ProductionCountry) => (
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

export default MovieDetailPage; 