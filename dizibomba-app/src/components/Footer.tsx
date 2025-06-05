import React from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800">
      <div className="container mx-auto px-4 py-6">
        {/* Üst Kısım */}
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
          {/* Logo ve Sosyal Medya */}
          <div className="md:w-1/3">
            <h2 className="text-2xl font-bold text-red-600 mb-3">DiziBomba</h2>
            <p className="mb-3 text-sm">
              Tüm film ve dizileri yüksek kalitede izleyebileceğiniz platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaYoutube size={18} />
              </a>
            </div>
          </div>

          {/* Bağlantılar - Kompakt Halde */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:w-2/3">
            {/* Hızlı Bağlantılar */}
            <div>
              <h3 className="text-white font-bold mb-2 text-sm">Hızlı Bağlantılar</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Ana Sayfa
                  </Link>
                </li>
                <li>
                  <Link href="/filmler" className="hover:text-white transition-colors">
                    Filmler
                  </Link>
                </li>
                <li>
                  <Link href="/diziler" className="hover:text-white transition-colors">
                    Diziler
                  </Link>
                </li>
                <li>
                  <Link href="/kategoriler" className="hover:text-white transition-colors">
                    Kategoriler
                  </Link>
                </li>
              </ul>
            </div>

            {/* Destek */}
            <div>
              <h3 className="text-white font-bold mb-2 text-sm">Destek</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/hesap" className="hover:text-white transition-colors">
                    Hesabım
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    SSS
                  </Link>
                </li>
                <li>
                  <Link href="/yardim" className="hover:text-white transition-colors">
                    Yardım
                  </Link>
                </li>
                <li>
                  <Link href="/iletisim" className="hover:text-white transition-colors">
                    İletişim
                  </Link>
                </li>
              </ul>
            </div>

            {/* Yasal */}
            <div>
              <h3 className="text-white font-bold mb-2 text-sm">Yasal</h3>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="/kullanim-kosullari" className="hover:text-white transition-colors">
                    Kullanım Koşulları
                  </Link>
                </li>
                <li>
                  <Link href="/gizlilik-politikasi" className="hover:text-white transition-colors">
                    Gizlilik Politikası
                  </Link>
                </li>
                <li>
                  <Link href="/cerez-politikasi" className="hover:text-white transition-colors">
                    Çerez Politikası
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Alt Kısım - Telif Hakkı */}
        <div className="pt-4 border-t border-gray-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} DiziBomba. Tüm hakları saklıdır.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 