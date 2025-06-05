"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GenreType } from "@/lib/tmdb";
import { 
  FaRunning, FaFire, FaTheaterMasks, FaLaugh, 
  FaFilm, FaSkullCrossbones, FaHeart, FaRocket, FaLandmark,
  FaVideo, FaMicrophone, FaUserSecret, FaGlobe,
  FaBaby, FaUniversity, FaFighterJet, 
  FaChevronDown, FaChevronUp, FaFilter
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

interface CategoryListProps {
  movieGenres?: GenreType[];
  tvGenres?: GenreType[];
}

const CategoryList: React.FC<CategoryListProps> = ({ movieGenres = [], tvGenres = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Film ve dizi kategorilerini birleştir ve tekrar edenleri filtrele
  const allGenres = [...movieGenres];
  
  // Dizi türlerini ekle ama film türlerinde zaten varsa ekleme (tekrarı önle)
  tvGenres.forEach(tvGenre => {
    if (!allGenres.some(genre => genre.id === tvGenre.id)) {
      allGenres.push(tvGenre);
    }
  });
  
  // Kategori bilgisi yoksa fallback veriler göster
  const hasGenres = allGenres.length > 0;
  
  // Fallback kategoriler (API'den veri gelmezse)
  const fallbackCategories = [
    { name: "Aksiyon", icon: <FaRunning /> },
    { name: "Macera", icon: <FaFire /> },
    { name: "Komedi", icon: <FaLaugh /> },
    { name: "Dram", icon: <FaTheaterMasks /> },
    { name: "Korku", icon: <FaSkullCrossbones /> },
    { name: "Romantik", icon: <FaHeart /> },
    { name: "Bilim Kurgu", icon: <FaRocket /> },
    { name: "Gerilim", icon: <FaUserSecret /> },
    { name: "Fantastik", icon: <FaGlobe /> },
    { name: "Tarih", icon: <FaLandmark /> },
    { name: "Belgesel", icon: <FaUniversity /> },
    { name: "Çocuklar", icon: <FaBaby /> },
    { name: "Müzik", icon: <FaMicrophone /> },
    { name: "Savaş", icon: <FaFighterJet /> },
    { name: "Gerçeklik", icon: <FaVideo /> }
  ];

  // TMDB tür adlarına göre ikon eşleştirme
  const getIconForGenre = (genreName: string) => {
    const normalizedName = genreName.toLowerCase();
    
    if (normalizedName.includes("aksiyon")) return <FaRunning />;
    if (normalizedName.includes("macera")) return <FaFire />;
    if (normalizedName.includes("komedi")) return <FaLaugh />;
    if (normalizedName.includes("dram")) return <FaTheaterMasks />;
    if (normalizedName.includes("korku")) return <FaSkullCrossbones />;
    if (normalizedName.includes("romantik") || normalizedName.includes("aşk")) return <FaHeart />;
    if (normalizedName.includes("bilim") || normalizedName.includes("kurgu")) return <FaRocket />;
    if (normalizedName.includes("gerilim")) return <FaUserSecret />;
    if (normalizedName.includes("fantezi") || normalizedName.includes("fantastik")) return <FaGlobe />;
    if (normalizedName.includes("tarih")) return <FaLandmark />;
    if (normalizedName.includes("belgesel")) return <FaUniversity />;
    if (normalizedName.includes("çocuk") || normalizedName.includes("aile")) return <FaBaby />;
    if (normalizedName.includes("müzik")) return <FaMicrophone />;
    if (normalizedName.includes("savaş")) return <FaFighterJet />;
    if (normalizedName.includes("gerçek")) return <FaVideo />;
    
    // Varsayılan ikon
    return <FaFilm />;
  };

  // Kategoriye tıklandığında
  const handleCategorySelect = (name: string) => {
    setSelectedCategory(name);
    setIsOpen(false);
  };

  // Kullanılacak kategoriler
  const categories = hasGenres 
    ? allGenres.map(genre => ({
        id: genre.id.toString(),
        name: genre.name,
        icon: getIconForGenre(genre.name)
      }))
    : fallbackCategories.map(cat => ({
        id: cat.name.toLowerCase(),
        name: cat.name,
        icon: cat.icon
      }));

  return (
    <section className="py-4 my-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-white mb-2 sm:mb-0">Kategoriler</h2>
          
          {/* Seçilen kategori göstergesi */}
          {selectedCategory && (
            <div className="flex items-center bg-red-600 text-white py-1 px-3 rounded-full text-sm">
              <span>{selectedCategory}</span>
              <button 
                onClick={() => setSelectedCategory(null)} 
                className="ml-2 text-white hover:text-gray-200 focus:outline-none"
                aria-label="Kategori seçimini temizle"
              >
                ✕
              </button>
            </div>
          )}
        </div>
        
        {/* Dropdown Butonu */}
        <div className="relative w-full">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg border border-gray-700 transition-colors text-sm"
          >
            <div className="flex items-center">
              <FaFilter className="mr-2" />
              <span>
                {selectedCategory || "Kategoriye Göre Filtrele"}
              </span>
            </div>
            <span>
              {isOpen ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </button>
          
          {/* Dropdown Menü */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute z-30 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden"
              >
                <div className="max-h-60 overflow-y-auto">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-0">
                    {categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/kategori/${category.id}`}
                        className="flex items-center p-2 hover:bg-gray-700 text-white transition-colors border-b border-gray-700 text-sm"
                        onClick={() => handleCategorySelect(category.name)}
                      >
                        <div className="w-6 h-6 flex items-center justify-center text-red-500 mr-2">
                          {category.icon}
                        </div>
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Popüler Kategoriler (Küçük Chips) - Sadece büyük ekranlarda */}
        <div className="hidden md:flex flex-wrap mt-3 gap-2">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.id}`}
              className="flex items-center bg-gray-800 hover:bg-gray-700 text-white text-xs py-1 px-2 rounded-full transition-colors"
              onClick={() => handleCategorySelect(category.name)}
            >
              <span className="mr-1">{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
          <button 
            onClick={() => setIsOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-xs py-1 px-2 rounded-full transition-colors flex items-center"
          >
            <span className="mr-1">Daha Fazla</span>
            <FaChevronDown size={8} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryList; 