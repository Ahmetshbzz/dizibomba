import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  getMovieDetails, 
  getSeriesDetails, 
  getMovieVideos,
  getSeriesVideos,
  getBackdropUrl,
  getPosterUrl
} from '@/lib/tmdb';
import { FaArrowLeft, FaPlay, FaPause, FaExpand, FaVolumeUp, FaClosedCaptioning, FaCog } from 'react-icons/fa';

// Metadata oluştur
export async function generateMetadata({ params }: { 
  params: { type: string; id: string } 
}) {
  const { type, id } = params;
  
  try {
    if (type === 'film') {
      const movie = await getMovieDetails(parseInt(id));
      return {
        title: `${movie?.title || 'Film'} İzle | DiziBomba`,
        description: movie?.overview,
      };
    } else {
      const series = await getSeriesDetails(parseInt(id));
      return {
        title: `${series?.name || 'Dizi'} İzle | DiziBomba`,
        description: series?.overview,
      };
    }
  } catch (error) {
    return {
      title: 'İçerik İzle | DiziBomba',
      description: 'Film ve dizi izleme platformu',
    };
  }
}

export default async function WatchPage({ params }: { 
  params: { type: string; id: string } 
}) {
  const { type, id } = params;
  
  // Film veya dizi detaylarını ve videolarını getir
  let content: any = null;
  let videos: any[] = [];
  
  try {
    if (type === 'film') {
      content = await getMovieDetails(parseInt(id));
      videos = await getMovieVideos(parseInt(id));
    } else {
      content = await getSeriesDetails(parseInt(id));
      videos = await getSeriesVideos(parseInt(id));
    }
  } catch (error) {
    console.error("İçerik alınırken hata oluştu:", error);
  }
  
  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-white mb-4">İçerik Bulunamadı</h1>
          <p className="text-gray-400 mb-6">Aradığınız içerik mevcut değil veya kaldırılmış olabilir.</p>
          <Link 
            href="/"
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors inline-block"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }
  
  // İçerik başlığı (film veya dizi)
  const title = type === 'film' ? content.title : content.name;
  
  // Arka plan görseli
  const backdropPath = content.backdrop_path || content.poster_path;
  
  // İlk videoyu al (genellikle fragmanlar)
  const mainVideo = videos.length > 0 
    ? videos.find(video => video.type === "Trailer") || videos[0] 
    : null;
  
  return (
    <div className="bg-black min-h-screen">
      {/* Video Oynatıcı Bölümü */}
      <div className="relative w-full aspect-video max-h-[80vh]">
        {/* Video veya Arkaplan Resmi */}
        {mainVideo ? (
          <div className="w-full h-full">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${mainVideo.key}?autoplay=1&controls=1&rel=0`}
              title={mainVideo.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            ></iframe>
          </div>
        ) : (
          <div className="relative w-full h-full bg-gray-900">
            {backdropPath && (
              <Image
                src={getBackdropUrl(backdropPath)}
                alt={title}
                fill
                className="object-cover opacity-40"
                priority
              />
            )}
            
            {/* Video yok mesajı */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-6 glass rounded-xl">
                <FaPlay size={48} className="mx-auto mb-4 text-red-600" />
                <h3 className="text-2xl font-bold text-white mb-2">Video Bulunamadı</h3>
                <p className="text-gray-300">Bu içerik için video mevcut değil.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Video Kontrolleri */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="container mx-auto">
            {/* İlerleme Çubuğu */}
            <div className="w-full h-1 bg-gray-700 rounded-full mb-4">
              <div className="bg-red-600 h-full w-1/3 rounded-full"></div>
            </div>
            
            {/* Kontrol Butonları */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <button className="text-white p-2 hover:text-red-500 transition-colors">
                  <FaPlay />
                </button>
                <div className="text-white text-sm">
                  <span>00:15:24</span>
                  <span className="mx-1">/</span>
                  <span>01:45:36</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="text-white p-2 hover:text-red-500 transition-colors">
                  <FaClosedCaptioning />
                </button>
                <button className="text-white p-2 hover:text-red-500 transition-colors">
                  <FaVolumeUp />
                </button>
                <button className="text-white p-2 hover:text-red-500 transition-colors">
                  <FaCog />
                </button>
                <button className="text-white p-2 hover:text-red-500 transition-colors">
                  <FaExpand />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Geri Butonu */}
        <Link 
          href={type === 'film' ? `/filmler/${id}` : `/diziler/${id}`}
          className="absolute top-4 left-4 z-20 bg-black/50 p-3 rounded-full text-white hover:bg-red-600 transition-all duration-300"
        >
          <FaArrowLeft />
        </Link>
      </div>
      
      {/* İçerik Bilgileri - Minimalist */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Poster (Sadece tablet ve üstü cihazlarda) */}
          <div className="hidden md:block w-48 flex-shrink-0">
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg">
              <Image
                src={getPosterUrl(content.poster_path)}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {/* Detaylar */}
          <div className="flex-grow">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{title}</h1>
            
            {/* Temel Bilgiler */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-400 mb-4">
              {type === 'film' ? (
                <>
                  <span>{content.release_date?.split('-')[0]}</span>
                  <span>•</span>
                  <span>{Math.floor(content.runtime / 60)}s {content.runtime % 60}dk</span>
                </>
              ) : (
                <>
                  <span>{content.first_air_date?.split('-')[0]}</span>
                  <span>•</span>
                  <span>{content.number_of_seasons} Sezon</span>
                </>
              )}
              <span>•</span>
              <div className="flex flex-wrap gap-2">
                {content.genres?.slice(0, 3).map((genre: any) => (
                  <span key={genre.id} className="bg-gray-800 px-2 py-0.5 rounded-md text-white text-xs">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
            
            {/* Özet - Kısa */}
            <p className="text-gray-300 mb-6 line-clamp-3">{content.overview}</p>
            
            {/* Alternatif Videolar - Sadece 2 tane göster */}
            {videos.length > 1 && (
              <div>
                <h3 className="text-white text-lg font-semibold mb-3">Diğer Videolar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {videos.slice(1, 3).map((video) => (
                    <div key={video.id} className="group relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <Image
                        src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
                        alt={video.name}
                        fill
                        className="object-cover group-hover:opacity-70 transition-opacity"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="bg-red-600 text-white p-3 rounded-full">
                          <FaPlay />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
                        <p className="text-white text-xs line-clamp-1">{video.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 