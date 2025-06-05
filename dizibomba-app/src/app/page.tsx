import HeroSlider from "@/components/HeroSlider";
import CategoryList from "@/components/CategoryList";
import ContentRow from "@/components/ContentRow";
import { 
  getTrendingMovies, 
  getPopularMovies, 
  getPopularSeries,
  getGenres,
  getTopRatedMovies,
  getTopRatedSeries,
  getLatestMovies,
  getLatestSeries,
  getMoviesByGenre
} from "@/lib/tmdb";
import Link from "next/link";
import { FaPlay, FaStar, FaCalendarAlt } from "react-icons/fa";
import Image from "next/image";

export default async function Home() {
  // API'den verileri çek
  const [
    trendingMovies, 
    popularMovies, 
    popularSeries, 
    movieGenres, 
    tvGenres,
    topRatedMovies,
    topRatedSeries,
    latestMovies,
    latestSeries,
    actionMovies
  ] = await Promise.all([
    getTrendingMovies(),
    getPopularMovies(),
    getPopularSeries(),
    getGenres('movie'),
    getGenres('tv'),
    getTopRatedMovies(),
    getTopRatedSeries(),
    getLatestMovies(),
    getLatestSeries(),
    getMoviesByGenre(28) // 28 = Aksiyon
  ]);
  
  // İlk 6 öğeyi al (performans için)
  const trendingMovieSlice = trendingMovies.slice(0, 6);
  const popularMovieSlice = popularMovies.slice(0, 10);
  const popularSeriesSlice = popularSeries.slice(0, 10);
  const topRatedMovieSlice = topRatedMovies.slice(0, 10);
  const topRatedSeriesSlice = topRatedSeries.slice(0, 10);
  const latestMovieSlice = latestMovies.slice(0, 10);
  const latestSeriesSlice = latestSeries.slice(0, 10);
  const actionMovieSlice = actionMovies.slice(0, 10);

  // Öne çıkan içerik için rastgele bir film seç
  const featuredContent = trendingMovies[Math.floor(Math.random() * 5)];

  return (
    <div className="min-h-screen pb-10">
      {/* Hero Slider */}
      <HeroSlider items={trendingMovieSlice} />
      
      {/* Öne Çıkan İçerik */}
      {featuredContent && (
        <div className="relative mt-8 mb-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <FaStar className="text-yellow-500 mr-2" /> Haftanın Öne Çıkanı
            </h2>
            <div className="glass p-4 md:p-6 rounded-xl overflow-hidden">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 relative aspect-[2/3] rounded-lg overflow-hidden">
                  <Image 
                    src={`https://image.tmdb.org/t/p/w500${featuredContent.poster_path}`}
                    alt={featuredContent.title || featuredContent.name || "Film"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-full md:w-2/3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-3xl font-bold mb-2">{featuredContent.title || featuredContent.name}</h3>
                    <div className="flex items-center mb-4">
                      <span className="bg-red-600 text-white px-2 py-1 rounded text-sm mr-3">
                        {featuredContent.vote_average.toFixed(1)}
                      </span>
                      <span className="text-gray-300 text-sm">
                        {new Date(featuredContent.release_date || featuredContent.first_air_date).getFullYear()}
                      </span>
                    </div>
                    <p className="text-gray-300 mb-6 line-clamp-3 md:line-clamp-4">
                      {featuredContent.overview}
                    </p>
                  </div>
                  <Link 
                    href={`/izle/${featuredContent.id}`} 
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition-all duration-300 self-start"
                  >
                    <FaPlay className="mr-2" /> Hemen İzle
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Kategoriler */}
      <CategoryList movieGenres={movieGenres} tvGenres={tvGenres} />
      
      {/* Popüler Filmler */}
      <ContentRow 
        title="Popüler Filmler" 
        items={popularMovieSlice} 
        viewAllLink="/filmler"
        type="movie"
      />
      
      {/* Son Eklenen Diziler */}
      <ContentRow 
        title="Yeni Eklenen Diziler" 
        items={latestSeriesSlice}
        viewAllLink="/diziler/yeni"
        type="tv"
      />
      
      {/* Aksiyon Filmleri */}
      <ContentRow 
        title="Aksiyon Filmleri" 
        items={actionMovieSlice}
        viewAllLink="/kategori/aksiyon"
        type="movie"
      />
      
      {/* En Çok İzlenen Diziler */}
      <ContentRow 
        title="En Çok İzlenen Diziler" 
        items={popularSeriesSlice}
        viewAllLink="/diziler"
        type="tv"
      />
      
      {/* En Yüksek Puanlı Filmler */}
      <ContentRow 
        title="En Yüksek Puanlı Filmler" 
        items={topRatedMovieSlice}
        viewAllLink="/filmler/en-iyi"
        type="movie"
      />
      
      {/* Yakında Gelecekler */}
      <div className="container mx-auto px-4 my-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FaCalendarAlt className="text-red-500 mr-2" /> Yakında Eklenecekler
        </h2>
        <div className="glass p-6 rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex flex-col items-center text-center p-4 hover-lift">
                <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold">{item}</span>
                </div>
                <h3 className="text-xl font-bold mb-2">
                  {item === 1 ? "Yeni Sezon Dizileri" : item === 2 ? "Özel Yapımlar" : "Çocuk İçerikleri"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {item === 1 
                    ? "Sevilen dizilerin yeni sezonları çok yakında!" 
                    : item === 2 
                    ? "DiziBomba özel yapımları için hazırlıklar sürüyor" 
                    : "Çocuklar için özel içerikler eklenecek"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
