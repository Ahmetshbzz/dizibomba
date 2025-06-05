"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaSearch, FaBars, FaTimes, FaUser, FaFilm, FaTv } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { searchMulti, getPosterUrl } from "@/lib/tmdb";

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Menü ve arama açma/kapama fonksiyonları
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
    }
    
    // Mobil menüyü kapat
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Arama işlemi
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    if (isMenuOpen) setIsMenuOpen(false);
  };

  // Arama sonuçlarını gerçek zamanlı olarak getir
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await searchMulti(searchQuery.trim());
        // Sadece film ve dizileri göster, en fazla 5 sonuç
        const filteredResults = results
          .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 5);
        setSearchResults(filteredResults);
      } catch (error) {
        console.error("Arama sonuçları alınırken hata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        fetchResults();
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  // Modal dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Arama sonuçları bileşeni
  const SearchResultsList = () => (
    <div className="max-h-80 overflow-y-auto">
      {isLoading ? (
        <div className="p-4 text-center text-gray-400">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-gray-400 border-t-red-500 rounded-full mb-2"></div>
          <p>Aranıyor...</p>
        </div>
      ) : searchQuery.trim().length >= 2 ? (
        <>
          {searchResults.length > 0 ? (
            <div>
              {searchResults.map((item) => (
                <Link
                  key={item.id}
                  href={item.media_type === 'movie' ? `/filmler/${item.id}` : `/diziler/${item.id}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center p-3 hover:bg-gray-800 transition-colors"
                >
                  <div className="relative w-12 h-16 flex-shrink-0 mr-3">
                    {item.poster_path ? (
                      <Image
                        src={getPosterUrl(item.poster_path)}
                        alt={item.title || item.name}
                        fill
                        className="object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center rounded">
                        {item.media_type === 'movie' ? (
                          <FaFilm className="text-gray-600" />
                        ) : (
                          <FaTv className="text-gray-600" />
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{item.title || item.name}</h4>
                    <div className="flex items-center text-sm text-gray-400">
                      <span className="mr-2">
                        {item.media_type === 'movie' ? 'Film' : 'Dizi'}
                      </span>
                      {item.release_date || item.first_air_date ? (
                        <span>
                          {new Date(item.release_date || item.first_air_date).getFullYear()}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              ))}
              <div className="p-3 border-t border-gray-800">
                <button
                  onClick={handleSearch}
                  className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors text-center"
                >
                  Tüm Sonuçları Gör
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400">
              Sonuç bulunamadı
            </div>
          )}
        </>
      ) : searchQuery.trim().length === 1 ? (
        <div className="p-4 text-center text-gray-400">
          En az 2 karakter girin
        </div>
      ) : null}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-bold text-red-600">DiziBomba</h1>
          </Link>

          {/* Masaüstü için navigasyon */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/" className="hover:text-red-500 transition-colors">
              Ana Sayfa
            </Link>
            <Link href="/filmler" className="hover:text-red-500 transition-colors">
              Filmler
            </Link>
            <Link href="/diziler" className="hover:text-red-500 transition-colors">
              Diziler
            </Link>
            <Link href="/kategoriler" className="hover:text-red-500 transition-colors">
              Kategoriler
            </Link>
          </nav>

          {/* Arama ve kullanıcı */}
          <div className="flex items-center space-x-4">
            <div className="relative" ref={searchRef}>
              <button
                onClick={toggleSearch}
                className="bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition-colors"
                aria-label="Ara"
              >
                <FaSearch />
              </button>

              {/* Arama Modal */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-80 md:w-96 bg-gray-900 rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    <form onSubmit={handleSearch} className="p-4">
                      <div className="relative">
                        <input
                          ref={inputRef}
                          type="text"
                          placeholder="Film veya dizi ara..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-gray-800 text-white rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                        <FaSearch className="absolute top-1/2 transform -translate-y-1/2 left-3 text-gray-400" />
                      </div>
                    </form>

                    {/* Arama Sonuçları */}
                    <SearchResultsList />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Kullanıcı ikonu - sadece masaüstünde */}
            <Link href="/giris" className="hidden md:block hover:text-red-500">
              <FaUser />
            </Link>
            
            {/* Mobil menü düğmesi */}
            <button
              onClick={toggleMenu}
              className="md:hidden text-white focus:outline-none"
              aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobil menü */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-gray-900"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="py-2 hover:text-red-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ana Sayfa
                </Link>
                <Link
                  href="/filmler"
                  className="py-2 hover:text-red-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Filmler
                </Link>
                <Link
                  href="/diziler"
                  className="py-2 hover:text-red-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Diziler
                </Link>
                <Link
                  href="/kategoriler"
                  className="py-2 hover:text-red-500 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kategoriler
                </Link>
                <Link
                  href="/giris"
                  className="py-2 hover:text-red-500 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FaUser className="mr-2" /> Giriş Yap
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 