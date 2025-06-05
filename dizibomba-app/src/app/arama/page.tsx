import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { searchMulti } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import SearchResultItem from '@/components/SearchResultItem';
import { FaSearch, FaSadTear, FaThList, FaTh } from 'react-icons/fa';

interface SearchPageProps {
  searchParams: { q?: string; view?: string };
}

export const metadata: Metadata = {
  title: 'Arama Sonuçları | DiziBomba',
  description: 'Film ve dizi arama sonuçları',
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const viewMode = searchParams.view === 'list' ? 'list' : 'grid';
  
  // Arama sorgusu boşsa, arama sayfasını göster
  if (!query) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Film ve Dizi Ara</h1>
            <p className="text-gray-400 mb-8">
              İzlemek istediğiniz film veya diziyi aramak için anahtar kelimeler girin.
            </p>
            <div className="flex items-center justify-center">
              <div className="w-20 h-20 bg-red-600/20 rounded-full flex items-center justify-center mb-8">
                <FaSearch className="text-red-500 text-3xl" />
              </div>
            </div>
            <p className="text-gray-300">
              Arama yapmak için üst menüdeki arama kutusunu kullanabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Arama sonuçlarını getir
  const searchResults = await searchMulti(query);
  
  // Sonuçları film ve dizilere ayır
  const movies = searchResults.filter((item: any) => item.media_type === 'movie');
  const tvShows = searchResults.filter((item: any) => item.media_type === 'tv');
  const people = searchResults.filter((item: any) => item.media_type === 'person');
  
  // Sonuç yoksa
  const noResults = searchResults.length === 0;
  
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              "{query}" için Arama Sonuçları
            </h1>
            <p className="text-gray-400">
              {noResults 
                ? 'Aramanıza uygun sonuç bulunamadı.' 
                : `Toplam ${searchResults.length} sonuç bulundu.`}
            </p>
          </div>
          
          {/* Görünüm değiştirme butonları */}
          {!noResults && (
            <div className="flex items-center space-x-2 bg-gray-800 p-1 rounded-lg self-start">
              <Link 
                href={`/arama?q=${encodeURIComponent(query)}`}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Kart Görünümü"
              >
                <FaTh />
              </Link>
              <Link 
                href={`/arama?q=${encodeURIComponent(query)}&view=list`}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'}`}
                title="Liste Görünümü"
              >
                <FaThList />
              </Link>
            </div>
          )}
        </div>
        
        {noResults ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FaSadTear className="text-gray-600 text-6xl mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Sonuç Bulunamadı</h2>
            <p className="text-gray-400 max-w-md mb-6">
              Aramanıza uygun sonuç bulunamadı. Farklı anahtar kelimeler kullanarak tekrar deneyebilirsiniz.
            </p>
            <Link 
              href="/" 
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Filmler */}
            {movies.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4">
                  Filmler ({movies.length})
                </h2>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.map((movie: any) => (
                      <MovieCard 
                        key={movie.id} 
                        item={movie} 
                        type="movie"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {movies.map((movie: any) => (
                      <SearchResultItem 
                        key={movie.id} 
                        item={movie} 
                        mediaType="movie"
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
            
            {/* Diziler */}
            {tvShows.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4">
                  Diziler ({tvShows.length})
                </h2>
                
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {tvShows.map((tvShow: any) => (
                      <MovieCard 
                        key={tvShow.id} 
                        item={tvShow} 
                        type="tv"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tvShows.map((tvShow: any) => (
                      <SearchResultItem 
                        key={tvShow.id} 
                        item={tvShow} 
                        mediaType="tv"
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
            
            {/* Kişiler - Şimdilik göstermiyoruz, ileride eklenebilir */}
            {people.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4">
                  Kişiler ({people.length})
                </h2>
                <p className="text-gray-400">
                  Kişi arama sonuçları şu anda gösterilmiyor. Yakında eklenecek.
                </p>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 