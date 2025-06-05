import React from 'react';
import { getGenres, MovieResult, SeriesResult } from '@/lib/tmdb';
import MovieCard from '@/components/MovieCard';
import axios from 'axios';

// API verilerini çekmek için yardımcı fonksiyon
async function getGenreItems(id: string, type: 'movie' | 'tv') {
  const API_KEY = '5a0bf1fa442842ce7a0e928e5356ff21';
  const BASE_URL = 'https://api.themoviedb.org/3';
  
  try {
    const response = await axios.get(`${BASE_URL}/discover/${type}`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
        with_genres: id,
        page: 1,
      },
    });
    return response.data.results as (MovieResult | SeriesResult)[];
  } catch (error) {
    console.error(`${type} türü için öğeler alınırken hata oluştu:`, error);
    return [];
  }
}

// Tür bilgisini almak için yardımcı fonksiyon
async function getGenreInfo(id: string, type: 'movie' | 'tv') {
  const genres = await getGenres(type);
  return genres.find(genre => genre.id.toString() === id);
}

interface PageProps {
  params: {
    id: string;
  };
  searchParams: {
    type?: string;
  };
}

export async function generateMetadata({ params, searchParams }: PageProps) {
  const { id } = params;
  const type = searchParams.type === 'tv' ? 'tv' : 'movie';
  const genre = await getGenreInfo(id, type);
  
  return {
    title: `${genre?.name || 'Kategori'} | DiziBomba`,
    description: `${genre?.name} kategorisindeki en iyi ${type === 'tv' ? 'diziler' : 'filmler'}`,
  };
}

async function KategoriDetaySayfasi({ params, searchParams }: PageProps) {
  const { id } = params;
  const type = searchParams.type === 'tv' ? 'tv' : 'movie';
  
  // Tür bilgisi ve içerik öğelerini getir
  const [genre, items] = await Promise.all([
    getGenreInfo(id, type),
    getGenreItems(id, type),
  ]);
  
  if (!genre) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Kategori Bulunamadı</h1>
          <p className="text-gray-400">Aradığınız kategori mevcut değil veya kaldırılmış olabilir.</p>
        </div>
      </div>
    );
  }
  
  const contentType = type === 'tv' ? 'Diziler' : 'Filmler';
  
  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <header className="mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
              {genre.name} <span className="text-gray-400 text-2xl ml-2">{contentType}</span>
            </h1>
            <div className="inline-flex px-4 py-2 bg-red-600 text-white rounded-full text-sm">
              {type === 'tv' ? 'Dizi Kategorisi' : 'Film Kategorisi'}
            </div>
          </div>
          <p className="text-gray-400 mt-4">
            {type === 'tv' 
              ? `${genre.name} kategorisindeki en popüler ve en çok izlenen dizileri keşfedin.`
              : `${genre.name} kategorisindeki en popüler ve en çok izlenen filmleri keşfedin.`}
          </p>
        </header>
        
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item: MovieResult | SeriesResult) => (
              <MovieCard key={item.id} item={item} isSeries={type === 'tv'} />
            ))}
          </div>
        ) : (
          <div className="text-center p-16 border border-gray-800 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Bu kategoride içerik bulunamadı</h3>
            <p className="text-gray-400">Daha sonra tekrar kontrol edin veya başka bir kategori seçin.</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default KategoriDetaySayfasi; 