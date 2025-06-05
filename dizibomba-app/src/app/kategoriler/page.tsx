import React from 'react';
import Link from 'next/link';
import { getGenres } from '@/lib/tmdb';
import { 
  FaRunning, FaFire, FaTheaterMasks, FaLaugh, 
  FaFilm, FaSkullCrossbones, FaHeart, FaRocket, FaLandmark,
  FaVideo, FaMicrophone, FaUserSecret, FaGlobe,
  FaBaby, FaUniversity, FaFighterJet, FaTv
} from "react-icons/fa";

export const metadata = {
  title: 'Kategoriler | DiziBomba',
  description: 'Film ve dizileri kategorilerine göre keşfedin',
};

async function KategorilerPage() {
  // Film ve Dizi kategorilerini getir
  const [movieGenres, tvGenres] = await Promise.all([
    getGenres('movie'),
    getGenres('tv'),
  ]);
  
  // TMDB tür adlarına göre ikon eşleştirme
  const getIconForGenre = (genreName: string) => {
    const normalizedName = genreName.toLowerCase();
    
    if (normalizedName.includes("aksiyon")) return <FaRunning className="text-2xl" />;
    if (normalizedName.includes("macera")) return <FaFire className="text-2xl" />;
    if (normalizedName.includes("komedi")) return <FaLaugh className="text-2xl" />;
    if (normalizedName.includes("dram")) return <FaTheaterMasks className="text-2xl" />;
    if (normalizedName.includes("korku")) return <FaSkullCrossbones className="text-2xl" />;
    if (normalizedName.includes("romantik") || normalizedName.includes("aşk")) return <FaHeart className="text-2xl" />;
    if (normalizedName.includes("bilim") || normalizedName.includes("kurgu")) return <FaRocket className="text-2xl" />;
    if (normalizedName.includes("gerilim")) return <FaUserSecret className="text-2xl" />;
    if (normalizedName.includes("fantezi") || normalizedName.includes("fantastik")) return <FaGlobe className="text-2xl" />;
    if (normalizedName.includes("tarih")) return <FaLandmark className="text-2xl" />;
    if (normalizedName.includes("belgesel")) return <FaUniversity className="text-2xl" />;
    if (normalizedName.includes("çocuk") || normalizedName.includes("aile")) return <FaBaby className="text-2xl" />;
    if (normalizedName.includes("müzik")) return <FaMicrophone className="text-2xl" />;
    if (normalizedName.includes("savaş")) return <FaFighterJet className="text-2xl" />;
    if (normalizedName.includes("gerçek")) return <FaVideo className="text-2xl" />;
    
    // Varsayılan ikon
    return <FaFilm className="text-2xl" />;
  };
  
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white mb-10 text-center">Tüm Kategoriler</h1>
        
        {/* Film Kategorileri */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4 flex items-center">
            <FaFilm className="mr-3" /> Film Kategorileri
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {movieGenres.map((genre) => (
              <Link 
                href={`/kategori/${genre.id}?type=movie`} 
                key={`movie-${genre.id}`}
                className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-red-900/20"
              >
                <div className="h-12 w-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4 text-red-500">
                  {getIconForGenre(genre.name)}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{genre.name}</h3>
                <span className="text-sm text-gray-400">Film</span>
              </Link>
            ))}
          </div>
        </section>
        
        {/* Dizi Kategorileri */}
        <section>
          <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4 flex items-center">
            <FaTv className="mr-3" /> Dizi Kategorileri
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tvGenres.map((genre) => (
              <Link 
                href={`/kategori/${genre.id}?type=tv`} 
                key={`tv-${genre.id}`}
                className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:scale-105 hover:shadow-red-900/20"
              >
                <div className="h-12 w-12 rounded-full bg-blue-600/20 flex items-center justify-center mb-4 text-blue-500">
                  {getIconForGenre(genre.name)}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{genre.name}</h3>
                <span className="text-sm text-gray-400">Dizi</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default KategorilerPage; 