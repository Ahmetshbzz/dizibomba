import axios from 'axios';

const API_KEY = '5a0bf1fa442842ce7a0e928e5356ff21';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Film ve dizi tipleri
export interface MovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  overview: string;
  original_language: string;
}

export interface SeriesResult {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  first_air_date: string;
  genre_ids: number[];
  overview: string;
  original_language: string;
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface GenreType {
  id: number;
  name: string;
}

// Film posterinin tam URL'sini alır
export const getPosterUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) return '/placeholder-poster.jpg'; // Varsayılan poster görseli
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Arka plan görselinin tam URL'sini alır
export const getBackdropUrl = (path: string | null, size: string = 'original'): string => {
  if (!path) return '/placeholder-backdrop.jpg'; // Varsayılan arka plan görseli
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

// Trendeki filmleri getirir
export const getTrendingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/trending/movie/week`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results as MovieResult[];
  } catch (error) {
    console.error('Trend filmler alınırken hata oluştu:', error);
    return [];
  }
};

// Popüler filmleri getirir
export const getPopularMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results as MovieResult[];
  } catch (error) {
    console.error('Popüler filmler alınırken hata oluştu:', error);
    return [];
  }
};

// Popüler dizileri getirir
export const getPopularSeries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/popular`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results as SeriesResult[];
  } catch (error) {
    console.error('Popüler diziler alınırken hata oluştu:', error);
    return [];
  }
};

// Bir film hakkında detaylı bilgi alır
export const getMovieDetails = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Film detayları alınırken hata oluştu (ID: ${movieId}):`, error);
    return null;
  }
};

// Bir dizi hakkında detaylı bilgi alır
export const getSeriesDetails = async (seriesId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/${seriesId}`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Dizi detayları alınırken hata oluştu (ID: ${seriesId}):`, error);
    return null;
  }
};

// Film ve dizi kategorilerini getirir
export const getGenres = async (type: 'movie' | 'tv') => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/${type}/list`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.genres as GenreType[];
  } catch (error) {
    console.error(`${type} kategorileri alınırken hata oluştu:`, error);
    return [];
  }
};

// Arama işlevi
export const searchMulti = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/multi`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
        query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Arama yapılırken hata oluştu:', error);
    return [];
  }
};

// Bir film için oyuncu bilgilerini alır
export const getMovieCredits = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Film oyuncu bilgileri alınırken hata oluştu (ID: ${movieId}):`, error);
    return null;
  }
};

// Bir dizi için oyuncu bilgilerini alır
export const getSeriesCredits = async (seriesId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/${seriesId}/credits`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Dizi oyuncu bilgileri alınırken hata oluştu (ID: ${seriesId}):`, error);
    return null;
  }
};

// Bir film için video bilgilerini alır (fragmanlar vb.)
export const getMovieVideos = async (movieId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/videos`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Film video bilgileri alınırken hata oluştu (ID: ${movieId}):`, error);
    return [];
  }
};

// Bir dizi için video bilgilerini alır (fragmanlar vb.)
export const getSeriesVideos = async (seriesId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/${seriesId}/videos`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results;
  } catch (error) {
    console.error(`Dizi video bilgileri alınırken hata oluştu (ID: ${seriesId}):`, error);
    return [];
  }
};

// En çok puanlanan filmleri getirir
export const getTopRatedMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/top_rated`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results as MovieResult[];
  } catch (error) {
    console.error('En çok puanlanan filmler alınırken hata oluştu:', error);
    return [];
  }
};

// Yakında gelecek filmleri getirir
export const getUpcomingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/upcoming`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results as MovieResult[];
  } catch (error) {
    console.error('Yakında gelecek filmler alınırken hata oluştu:', error);
    return [];
  }
};

// Vizyondaki filmleri getirir
export const getNowPlayingMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results as MovieResult[];
  } catch (error) {
    console.error('Vizyondaki filmler alınırken hata oluştu:', error);
    return [];
  }
};

// En çok puanlanan dizileri getirir
export const getTopRatedSeries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/top_rated`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results as SeriesResult[];
  } catch (error) {
    console.error('En çok puanlanan diziler alınırken hata oluştu:', error);
    return [];
  }
};

// En son eklenen filmleri getirir (aslında şu anda gösterimde olanlar)
export const getLatestMovies = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/now_playing`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results as MovieResult[];
  } catch (error) {
    console.error('En son eklenen filmler alınırken hata oluştu:', error);
    return [];
  }
};

// En son eklenen dizileri getirir (aslında şu anda yayında olanlar)
export const getLatestSeries = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tv/on_the_air`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
      },
    });
    return response.data.results as SeriesResult[];
  } catch (error) {
    console.error('En son eklenen diziler alınırken hata oluştu:', error);
    return [];
  }
};

// Belirli bir türe ait filmleri getirir
export const getMoviesByGenre = async (genreId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'tr-TR',
        with_genres: genreId,
        sort_by: 'popularity.desc'
      },
    });
    return response.data.results as MovieResult[];
  } catch (error) {
    console.error(`${genreId} türüne ait filmler alınırken hata oluştu:`, error);
    return [];
  }
}; 