// Film ve dizi izleme sitesi için örnek veriler

export interface MovieType {
  id: number;
  title: string;
  poster: string;
  rating: number;
  year: number;
  category: string;
  isTrending?: boolean;
}

export interface SeriesType extends MovieType {
  season: number;
  episode: number;
}

export const trendingMovies: MovieType[] = [
  {
    id: 1,
    title: "Oppenheimer",
    poster: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg",
    rating: 8.9,
    year: 2023,
    category: "Dram",
    isTrending: true
  },
  {
    id: 2,
    title: "Barbie",
    poster: "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTljM2I0NDA5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",
    rating: 7.0,
    year: 2023,
    category: "Komedi",
    isTrending: true
  },
  {
    id: 3,
    title: "Dune",
    poster: "https://m.media-amazon.com/images/M/MV5BZTBmMmVhYmMtNmI4MC00MGIzLWJhNmEtZDAyZjFiNjU5NzYzXkEyXkFqcGdeQXVyMTAyMjQ3NzQ1._V1_.jpg",
    rating: 8.5,
    year: 2024,
    category: "Bilim Kurgu",
    isTrending: true
  },
  {
    id: 4,
    title: "Gladyatör 2",
    poster: "https://m.media-amazon.com/images/M/MV5BNWZhZmFiYzgtMDdmZi00MmIyLWIzOWUtMmUwZmRlMzdiM2I0XkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg",
    rating: 8.2,
    year: 2024,
    category: "Tarih",
    isTrending: true
  },
  {
    id: 5,
    title: "Yenilmezler: Sonsuzluk Savaşı",
    poster: "https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_.jpg",
    rating: 8.4,
    year: 2018,
    category: "Aksiyon",
    isTrending: true
  }
];

export const latestSeries: SeriesType[] = [
  {
    id: 101,
    title: "Breaking Bad",
    poster: "https://m.media-amazon.com/images/M/MV5BYmQ4YWMxYjUtNjZmYi00MDQ1LWFjMjMtNjA5ZDdiYjdiODU5XkEyXkFqcGdeQXVyMTMzNDExODE5._V1_.jpg",
    rating: 9.5,
    year: 2008,
    category: "Dram",
    season: 5,
    episode: 16
  },
  {
    id: 102,
    title: "Game of Thrones",
    poster: "https://m.media-amazon.com/images/M/MV5BYTRiNDQwYzAtMzVlZS00NTI5LWJjYjUtMzkwNTUzMWMxZTllXkEyXkFqcGdeQXVyNDIzMzcwNjc@._V1_.jpg",
    rating: 9.2,
    year: 2011,
    category: "Fantastik",
    season: 8,
    episode: 6
  },
  {
    id: 103,
    title: "The Last of Us",
    poster: "https://m.media-amazon.com/images/M/MV5BZGUzYTI3M2EtZmM0Yy00NGUyLWI4ODEtN2Q3ZGJlYzhhZjU3XkEyXkFqcGdeQXVyNTM0OTY1OQ@@._V1_.jpg",
    rating: 8.8,
    year: 2023,
    category: "Dram",
    season: 1,
    episode: 9
  },
  {
    id: 104,
    title: "Stranger Things",
    poster: "https://m.media-amazon.com/images/M/MV5BMDZkYmVhNjMtNWU4MC00MDQxLWE3MjYtZGMzZWI1ZjhlOWJmXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    rating: 8.7,
    year: 2016,
    category: "Bilim Kurgu",
    season: 4,
    episode: 9
  },
  {
    id: 105,
    title: "Wednesday",
    poster: "https://m.media-amazon.com/images/M/MV5BNjRiM2U0NDgtYWY0MS00YTY1LWJhNDUtYTVmYTViMjQ3NzM1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_.jpg",
    rating: 8.1,
    year: 2022,
    category: "Komedi",
    season: 1,
    episode: 8
  }
];

export const categories = [
  "Aksiyon", 
  "Macera", 
  "Komedi", 
  "Dram", 
  "Korku", 
  "Romantik", 
  "Bilim Kurgu", 
  "Gerilim", 
  "Fantastik", 
  "Tarih"
];

// Popüler filmler
export const popularMovies: MovieType[] = [
  {
    id: 6,
    title: "Hızlı ve Öfkeli 10",
    poster: "https://m.media-amazon.com/images/M/MV5BNzZmOTU1ZTEtYzVhNi00NzQxLWI5ZjAtNWNhNjEwY2E3YmZjXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
    rating: 5.8,
    year: 2023,
    category: "Aksiyon"
  },
  {
    id: 7,
    title: "Joker",
    poster: "https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg",
    rating: 8.4,
    year: 2019,
    category: "Dram"
  },
  {
    id: 8,
    title: "Matrix",
    poster: "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg",
    rating: 8.7,
    year: 1999,
    category: "Bilim Kurgu"
  },
  {
    id: 9,
    title: "Titanik",
    poster: "https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_.jpg",
    rating: 7.9,
    year: 1997,
    category: "Romantik"
  },
  {
    id: 10,
    title: "Yüzüklerin Efendisi",
    poster: "https://m.media-amazon.com/images/M/MV5BN2EyZjM3NzUtNWUzMi00MTgxLWI0NTctMzY4M2VlOTdjZWRiXkEyXkFqcGdeQXVyNDUzOTQ5MjY@._V1_.jpg",
    rating: 8.8,
    year: 2001,
    category: "Fantastik"
  }
]; 