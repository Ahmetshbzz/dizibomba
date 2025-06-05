import React from 'react';
import { Metadata } from 'next';
import ContentRow from '@/components/ContentRow';
import { getPopularSeries } from '@/lib/tmdb';
import HeroSlider from '@/components/HeroSlider';

export const metadata: Metadata = {
  title: 'Diziler | DiziBomba',
  description: 'En yeni ve popüler diziler',
};

async function SeriesPage() {
  // Popüler dizileri getir
  const popularSeries = await getPopularSeries();

  return (
    <main>
      {/* Dizi Slider'ı - HeroSlider kullanıyoruz */}
      {popularSeries && popularSeries.length > 0 && (
        <HeroSlider items={popularSeries.slice(0, 5)} />
      )}

      <div className="container mx-auto py-8">
        {/* Popüler Diziler */}
        {popularSeries && popularSeries.length > 0 && (
          <ContentRow
            title="Popüler Diziler"
            items={popularSeries}
            type="tv"
            viewAllLink="/diziler/populer"
          />
        )}
        
        {/* Netflix'te Popüler Diziler - Kategoriye göre filtrelenmiş örnekler */}
        {popularSeries && popularSeries.length > 4 && (
          <ContentRow
            title="Netflix'te Popüler"
            items={popularSeries.slice(0, 10)}
            type="tv"
          />
        )}
        
        {/* Drama Dizileri - Kategoriye göre filtrelenmiş örnek */}
        {popularSeries && popularSeries.length > 10 && (
          <ContentRow
            title="Drama Dizileri"
            items={popularSeries.slice(10, 20)}
            type="tv"
          />
        )}
        
        {/* Komedi Dizileri - Kategoriye göre filtrelenmiş örnek */}
        {popularSeries && popularSeries.length > 5 && (
          <ContentRow
            title="Komedi Dizileri"
            items={popularSeries.slice(5, 15)}
            type="tv"
          />
        )}
      </div>
    </main>
  );
}

export default SeriesPage; 