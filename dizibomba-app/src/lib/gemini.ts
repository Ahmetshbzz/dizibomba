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
      model: "gemini-2.5-flash-preview-05-20",
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

    // Sistem promptu
    const systemPrompt = `
    Sen DiziBomba platformunun yapay zeka asistanısın. Kullanıcılara film ve dizi önerileri sunmak,
    içerikler hakkında bilgi vermek ve sinema/televizyon dünyasıyla ilgili sorularını yanıtlamak için varsın.

    BİLGİLER:
    - DiziBomba, kullanıcıların film ve dizi izleyebileceği bir platformdur
    - Kullanıcılar sorularına kısa ve doğru yanıtlar bekler
    - Türkçe olarak yanıt ver
    - Öneri isterlerse, kullanıcının ilgi alanına göre çeşitli seçenekler sun
    - Film/dizi açıklamalarını kısa tut (en fazla 1-2 cümle)
    - Spoiler vermekten kaçın
    - İçerik yaş kısıtlamasına dikkat et

    Kullanıcıya yardımcı ol ve film/dizi dünyasıyla ilgili sorularını yanıtla.
    `;

    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800,
      }
    });

    // Önce sistem mesajını gönder
    await chat.sendMessage(systemPrompt);

    // Sohbet geçmişindeki mesajları ekle
    for (const message of chatHistory) {
      await chat.sendMessage(message.content);
    }

    // Son kullanıcı mesajını gönder ve yanıtı al
    const result = await chat.sendMessage(userMessage);
    return result.response.text();

  } catch (error: unknown) {
    console.error("Gemini API hatası:", error);

    if (error instanceof Error) {
      return `Üzgünüm, bir hata oluştu: ${error.message}`;
    }

    return "Üzgünüm, bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
  }
};
