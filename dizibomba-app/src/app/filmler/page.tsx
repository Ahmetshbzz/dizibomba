import React from 'react';
import { Metadata } from 'next';
import ContentRow from '@/components/ContentRow';
import HeroSlider from '@/components/HeroSlider';
import { getPopularMovies, getTopRatedMovies, getUpcomingMovies, getNowPlayingMovies } from '@/lib/tmdb';

export const metadata: Metadata = {
  title: 'Filmler | DiziBomba',
  description: 'En yeni ve popüler filmler',
};

async function MoviesPage() {
  // Paralel olarak tüm verileri çek
  const [popular, topRated, upcoming, nowPlaying] = await Promise.all([
    getPopularMovies(),
    getTopRatedMovies(),
    getUpcomingMovies(),
    getNowPlayingMovies(),
  ]);

  return (
    <main>
      {/* Hero Slider - Vizyondaki Filmler */}
      {nowPlaying && nowPlaying.length > 0 && (
        <HeroSlider items={nowPlaying.slice(0, 5)} />
      )}

      <div className="container mx-auto py-8">
        {/* Popüler Filmler */}
        {popular && popular.length > 0 && (
          <ContentRow
            title="Popüler Filmler"
            items={popular}
            type="movie"
          />
        )}

        {/* En Çok Puanlanan Filmler */}
        {topRated && topRated.length > 0 && (
          <ContentRow
            title="En Çok Puanlanan Filmler"
            items={topRated}
            type="movie"
          />
        )}

        {/* Yakında Gelecek Filmler */}
        {upcoming && upcoming.length > 0 && (
          <ContentRow
            title="Yakında Gelecek Filmler"
            items={upcoming}
            type="movie"
          />
        )}

        {/* Vizyondaki Filmler */}
        {nowPlaying && nowPlaying.length > 0 && (
          <ContentRow
            title="Vizyondaki Filmler"
            items={nowPlaying}
            type="movie"
          />
        )}
      </div>
    </main>
  );
}

export default MoviesPage; 