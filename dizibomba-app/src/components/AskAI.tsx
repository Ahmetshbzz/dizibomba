"use client";

import { ChatMessage, sendDirectMessageToGemini } from "@/lib/gemini";
import { getMovieDetails, getSeriesDetails } from "@/lib/tmdb";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FaFilm, FaInfoCircle, FaPaperPlane, FaRobot, FaTimes, FaTv } from "react-icons/fa";

// Sayfa bağlamı için tip tanımı
interface ContentData {
  title?: string;
  name?: string;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  genres?: Array<{ id: number; name: string }>;
  vote_average?: number;
  poster_path?: string;
  backdrop_path?: string;
  status?: string;
  runtime?: number;
  number_of_seasons?: number;
  number_of_episodes?: number;
  [key: string]: unknown;
}

interface PageContext {
  type: "movie" | "series" | null;
  id: string | null;
  data: ContentData | null;
}

const AskAI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-message",
      role: "model",
      content: "Merhaba! Size film ve dizilerle ilgili nasıl yardımcı olabilirim?",
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageContext, setPageContext] = useState<PageContext>({
    type: null,
    id: null,
    data: null,
  });

  const pathname = usePathname();
  const modalRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sayfa bağlamını algılama
  useEffect(() => {
    const detectPageContext = async () => {
      // Film sayfası kontrolü: /filmler/[id] formatında mı?
      const movieMatch = pathname?.match(/\/filmler\/(\d+)/);
      if (movieMatch && movieMatch[1]) {
        const movieId = movieMatch[1];
        const movieData = await getMovieDetails(Number(movieId));
        if (movieData) {
          setPageContext({
            type: "movie",
            id: movieId,
            data: movieData
          });
          return;
        }
      }

      // Dizi sayfası kontrolü: /diziler/[id] formatında mı?
      const seriesMatch = pathname?.match(/\/diziler\/(\d+)/);
      if (seriesMatch && seriesMatch[1]) {
        const seriesId = seriesMatch[1];
        const seriesData = await getSeriesDetails(Number(seriesId));
        if (seriesData) {
          setPageContext({
            type: "series",
            id: seriesId,
            data: seriesData
          });
          return;
        }
      }

      // Eşleşme yoksa
      setPageContext({
        type: null,
        id: null,
        data: null
      });
    };

    detectPageContext();
  }, [pathname]);

  // Modal dışına tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Modal açıldığında input alanına odaklan
  useEffect(() => {
    if (isModalOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isModalOpen]);

  // Mesajlar değiştiğinde otomatik kaydırma
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // Örnek soru butonlarına tıklandığında
  const handleExampleClick = (example: string) => {
    sendMessage(example);
  };

  // Mevcut içerik hakkında soru sorma
  const askAboutCurrentContent = () => {
    if (!pageContext.data) return;

    let question = "";

    if (pageContext.type === "movie") {
      question = `"${pageContext.data.title}" filmi hakkında bilgi verir misin?`;
    } else if (pageContext.type === "series") {
      question = `"${pageContext.data.name}" dizisi hakkında bilgi verir misin?`;
    }

    if (question) {
      sendMessage(question);
    }
  };

  // Mesajı Gemini API'ye gönder
  const sendMessage = async (message: string = inputMessage) => {
    if (!message.trim()) return;

    // Kullanıcı mesajını ekle
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Mesaj geçmişini API'nin beklediği formata dönüştür
      const chatHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        id: msg.id,
        timestamp: msg.timestamp
      }));

      // Sayfa bağlamını ekleyerek daha doğru yanıtlar al
      let enhancedUserMessage = message;

      // Eğer bir film veya dizi sayfasındaysak ve kullanıcı bu içerikle ilgili soru soruyorsa
      if (pageContext.data) {
        const currentTitle = pageContext.type === "movie"
          ? pageContext.data.title
          : pageContext.data.name;

        // İçerik hakkında bilgi soruluyorsa
        if (
          message.toLowerCase().includes("bu film") ||
          message.toLowerCase().includes("bu dizi") ||
          message.toLowerCase().includes("bu içerik") ||
          message.toLowerCase().includes("bu yapım")
        ) {
          const contextInfo = pageContext.type === "movie"
            ? `Kullanıcı şu anda "${currentTitle}" adlı film sayfasında. Film ID: ${pageContext.id}. Film hakkında bilgiler: ${JSON.stringify(pageContext.data, null, 2)}`
            : `Kullanıcı şu anda "${currentTitle}" adlı dizi sayfasında. Dizi ID: ${pageContext.id}. Dizi hakkında bilgiler: ${JSON.stringify(pageContext.data, null, 2)}`;

          enhancedUserMessage = `${message}\n\nSayfa Bağlamı: ${contextInfo}`;
        }
      }

      // API'ye gönder - doğrudan Gemini API'sine istek at
      const response = await sendDirectMessageToGemini(enhancedUserMessage, chatHistory);

      // AI yanıtını ekle
      const aiMessage: ChatMessage = {
        id: `model-${Date.now()}`,
        role: "model",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI yanıt hatası:", error);

      // Hata mesajı ekle
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "model",
        content: "Üzgünüm, bir hata oluştu. Lütfen daha sonra tekrar deneyin.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Form gönderildiğinde
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <>
      {/* Sabit AI Butonu */}
      <motion.button
        onClick={toggleModal}
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-full p-3.5 shadow-lg hover-scale transition-all duration-300"
        aria-label="AI&apos;a Sor"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="flex items-center justify-center relative">
          <FaRobot size={24} className="relative z-10" />
          <div className="absolute inset-0 bg-red-500 rounded-full animate-pulse opacity-20"></div>
        </div>
      </motion.button>

      {/* AI Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
          >
            <motion.div
              ref={modalRef}
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-lg max-h-[80vh] glass border border-gray-800 shadow-2xl overflow-hidden"
            >
              {/* Modal Başlık */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
                <div className="flex items-center">
                  <div className="mr-3 relative">
                    <FaRobot className="text-gradient text-xl" />
                    <div className="absolute inset-0 animate-pulse opacity-50 blur-sm bg-red-500 rounded-full"></div>
                  </div>
                  <h3 className="text-xl font-semibold text-white">AI&apos;a Sor</h3>
                </div>
                <button
                  onClick={toggleModal}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Kapat"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {/* Modal İçerik */}
              <div className="p-6 bg-gradient-to-b from-gray-900 to-black flex flex-col h-[500px]">
                {/* Sohbet Penceresi */}
                <div className="flex-1 overflow-y-auto mb-4 pr-2 space-y-4 custom-scrollbar">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.role === "model" && (
                        <div className="bg-red-600 rounded-full p-1.5 mr-2 h-fit">
                          <FaRobot className="text-white text-xs" />
                        </div>
                      )}
                      <div
                        className={`rounded-lg p-3 max-w-[75%] ${
                          message.role === "user"
                            ? "bg-red-600 text-white"
                            : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                    </div>
                  ))}

                  {/* Yazıyor animasyonu */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-red-600 rounded-full p-1.5 mr-2 h-fit">
                        <FaRobot className="text-white text-xs" />
                      </div>
                      <div className="bg-gray-800 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0s" }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Mesaj sonuna otomatik kaydırma için referans */}
                  <div ref={messageEndRef} />
                </div>

                {/* Öneri Kartları - Sadece ilk mesajdan sonra ve başka mesaj yoksa göster */}
                {messages.length === 1 && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => handleExampleClick("Bana aksiyon filmi önerir misin?")}
                      className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center mb-2">
                        <FaFilm className="text-red-500 mr-2" />
                        <span className="text-white font-medium text-sm">Film Önerisi</span>
                      </div>
                      <p className="text-gray-400 text-xs">
                        &ldquo;Bana aksiyon filmi önerir misin?&rdquo;
                      </p>
                    </button>

                    <button
                      onClick={() => handleExampleClick("Bu hafta izleyebileceğim dizi öner")}
                      className="p-3 bg-gray-800/50 hover:bg-gray-800 rounded-lg border border-gray-700 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center mb-2">
                        <FaTv className="text-red-500 mr-2" />
                        <span className="text-white font-medium text-sm">Dizi Önerisi</span>
                      </div>
                      <p className="text-gray-400 text-xs">
                        &ldquo;Bu hafta izleyebileceğim dizi öner&rdquo;
                      </p>
                    </button>
                  </div>
                )}

                {/* İçerik bağlamı varsa göster */}
                {pageContext.data && messages.length === 1 && (
                  <div className="mb-4">
                    <button
                      onClick={askAboutCurrentContent}
                      className="w-full p-3 bg-red-600/30 hover:bg-red-600/50 rounded-lg border border-red-700 transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center mb-2">
                        <FaInfoCircle className="text-red-500 mr-2" />
                        <span className="text-white font-medium text-sm">
                          {pageContext.type === "movie" ? "Film" : "Dizi"} Hakkında Bilgi
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs">
                        &ldquo;{pageContext.type === "movie" ? pageContext.data.title : pageContext.data.name} hakkında bilgi verir misin?&rdquo;
                      </p>
                    </button>
                  </div>
                )}

                {/* Kullanıcı Mesaj Girişi */}
                <form onSubmit={handleSubmit} className="mt-auto">
                  <div className="flex items-center bg-gray-800/70 rounded-full p-1 border border-gray-700">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder={pageContext.data
                        ? `${pageContext.type === "movie" ? pageContext.data.title : pageContext.data.name} hakkında soru sor...`
                        : "Bir soru sorun..."}
                      className="flex-1 bg-transparent border-none outline-none text-white px-3 py-2 text-sm"
                    />
                    <button
                      type="submit"
                      disabled={!inputMessage.trim() || isLoading}
                      className={`rounded-full p-2 mr-1 transition-colors flex items-center justify-center ${
                        inputMessage.trim() && !isLoading
                          ? "bg-red-600 hover:bg-red-700 text-white"
                          : "bg-gray-700 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <FaPaperPlane size={14} />
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AskAI;
