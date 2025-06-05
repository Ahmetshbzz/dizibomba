import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

// Doğrudan istemci tarafında API isteği için yeniden düzenlenmiş kod
// API anahtarını çevre değişkeninden al (istemci tarafında)
const getApiKey = (): string => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    console.error("NEXT_PUBLIC_GEMINI_API_KEY bulunamadı");
    return "";
  }

  return apiKey;
};

// Özel mesaj tipi tanımı - UI'da kullanılan tüm alanları içerir
export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: Date;
  isThinking?: boolean;
}

// Film/Dizi detay bilgileri için arayüz
export interface ContentSummary {
  title: string;
  year?: number;
  genre: string[];
  rating?: number;
  duration?: string;
  plot: string;
  cast?: string[];
  director?: string;
  seasons?: number;
  episodes?: number;
  status?: string;
}

// Gemini API'ye doğrudan istek gönderme
export const sendDirectMessageToGemini = async (
  userMessage: string,
  chatHistory: ChatMessage[] = []
): Promise<string> => {
  try {
    const apiKey = getApiKey();
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-001",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }
      ]
    });

    // Geliştirilmiş sistem promptu
    const systemPrompt = `
    Sen DiziBomba platformunun uzman yapay zeka asistanısın. Film ve dizi dünyasının her alanında derin bilgin var.

    ## KİMLİĞİN VE GÖREVIN:
    - DiziBomba'nın resmi film/dizi uzmanısın
    - Kullanıcılara kişiselleştirilmiş öneriler sunarsın
    - Detaylı içerik analizleri yaparsın
    - Spoiler vermeden hikaye özetleri çıkarırsın
    - Sinema tarihi, oyuncu bilgileri ve yapım detaylarında uzmanısın

    ## UZMANLIK ALANLARIN:
    📽️ **Film Kategorileri:** Aksiyon, dram, komedi, korku, bilim kurgu, romantik, gerilim, animasyon, belgesel
    📺 **Dizi Türleri:** Drama, komedi, suç, fantastik, tarih, biyografi, mini dizi, reality show
    🎭 **Özel Konular:** Oscar kazananlar, festival filmleri, kült yapımlar, yabancı sinema, Türk sineması
    🌟 **Oyuncu/Yönetmen:** Kariyer analizleri, filmografi, ödüller, yaşam öyküleri

    ## YANIT VERİM KURALLARIN:
    ✅ **Detaylı Bilgi:** Film/dizi hakkında sorulduğunda şunları içer:
       - Yıl, süre, tür bilgileri
       - Yönetmen ve başrol oyuncuları
       - Kısa spoiler-free özet (2-3 cümle)
       - IMDB/Rotten Tomatoes puanları (biliyorsan)
       - Özel ödüller veya başarılar
       - Benzer öneri (1-2 tane)

    ✅ **Özet Çıkarma:** Kullanıcı özet istediğinde:
       - Spoiler uyarısı yap
       - Ana hikaye çizgisini özetle
       - Karakterleri tanıt
       - Tema ve mesajları belirt
       - İzleme deneyimi hakkında yorum yap

    ✅ **Öneri Sistemi:** Kişiselleştirilmiş öneriler için:
       - Kullanıcının zevkini anlamaya çalış
       - 3-5 farklı seçenek sun
       - Her öneri için kısa açıklama yap
       - Neden bu önerileri verdiğini belirt

    ✅ **Etkileşim Tarzı:**
       - Samimi ve uzman bir dil kullan
       - Emojilerle destekle
       - Merak uyandıran ifadeler kullan
       - Kullanıcıyı daha fazla soru sormaya teşvik et

    ## YASAK DAVRANIŞLAR:
    ❌ Spoiler verme (kullanıcı özellikle isterse uyar)
    ❌ Olumsuz eleştiri (yapıcı yorumlar yap)
    ❌ Yanlış bilgi verme (emin değilsen belirt)

    ## ÖRNEK YANITLAR:
    Kullanıcı: "Breaking Bad hakkında bilgi ver"
    Sen: "🎭 **Breaking Bad (2008-2013)**

    **Temel Bilgiler:**
    - 5 sezon, 62 bölüm
    - Suç/Drama türü
    - Yaratıcı: Vince Gilligan
    - Başroller: Bryan Cranston, Aaron Paul

    **Hikaye:** Kanser teşhisi konan lise kimya öğretmeni Walter White'ın ailesine para bırakmak için metamfetamin üretimine başlaması ve bu süreçte yaşadığı dönüşüm...

    **Neden İzlemeli:** Emmy ödüllü, IMDB 9.5 puan, tüm zamanların en iyi dizilerinden biri

    **Benzer Öneriler:** Better Call Saul, Ozark 🎯"

    Kullanıcıya her zaman yararlı, detaylı ve ilgi çekici yanıtlar ver!
    `;

    const chat = model.startChat({
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1200,
        topP: 0.9,
        topK: 40,
      }
    });

    // Önce sistem mesajını gönder
    await chat.sendMessage(systemPrompt);

    // Sohbet geçmişindeki son 10 mesajı ekle (token limitini aşmamak için)
    const recentHistory = chatHistory.slice(-10);
    for (const message of recentHistory) {
      if (message.role === "user") {
        await chat.sendMessage(`Kullanıcı: ${message.content}`);
      } else {
        await chat.sendMessage(`Asistan: ${message.content}`);
      }
    }

    // Son kullanıcı mesajını gönder ve yanıtı al
    const result = await chat.sendMessage(`Kullanıcı: ${userMessage}`);
    return result.response.text();

  } catch (error: unknown) {
    console.error("Gemini API hatası:", error);

    if (error instanceof Error) {
      // Daha kullanıcı dostu hata mesajları
      if (error.message.includes("API_KEY")) {
        return "🔧 API anahtarı sorunu yaşanıyor. Lütfen teknik ekibimizle iletişime geçin.";
      } else if (error.message.includes("QUOTA")) {
        return "⚠️ Günlük kullanım limitine ulaştık. Lütfen daha sonra tekrar deneyin.";
      } else if (error.message.includes("SAFETY")) {
        return "🛡️ Güvenlik filtreleri nedeniyle bu soruyu yanıtlayamıyorum. Farklı bir şekilde sormayı dener misiniz?";
      }

      return `❌ Bir hata oluştu: ${error.message}. Lütfen tekrar deneyin.`;
    }

    return "❌ Beklenmeyen bir hata oluştu. Lütfen sayfayı yenileyip tekrar deneyin.";
  }
};

// Ek yardımcı fonksiyonlar
export const generateContentSummary = async (title: string): Promise<ContentSummary | null> => {
  try {
    const response = await sendDirectMessageToGemini(
      `"${title}" için detaylı bilgi ver. Şu formatı kullan: Başlık, yıl, tür, puan, süre, özet, oyuncular, yönetmen. Eğer dizi ise sezon/bölüm sayısını da ekle.`
    );

    // Yanıtı parse etme logisi burada implementasyona göre eklenir
    return null; // Placeholder
  } catch (error) {
    console.error("Özet oluşturma hatası:", error);
    return null;
  }
};

export const getPersonalizedRecommendations = async (
  userPreferences: string,
  watchHistory: string[] = []
): Promise<string> => {
  const preferencesText = `
    Kullanıcı tercihleri: ${userPreferences}
    ${watchHistory.length > 0 ? `Daha önce izledikleri: ${watchHistory.join(', ')}` : ''}

    Bu bilgilere göre 5 kişiselleştirilmiş öneri ver. Her öneri için neden önerdiğini belirt.
  `;

  return await sendDirectMessageToGemini(preferencesText);
};
