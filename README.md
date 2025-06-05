# DiziBomba

DiziBomba, film ve dizi içeriklerini görüntülemek için geliştirilmiş modern bir web uygulamasıdır. [Next.js 15](https://nextjs.org) ve [React 19](https://react.dev) kullanılarak oluşturulmuştur.

## Özellikler

- Film ve dizi arşivi görüntüleme
- Kategorilere göre filtreleme
- Arama fonksiyonu
- Detaylı içerik sayfaları
- İzleme sayfası
- Responsive tasarım
- Hızlı yükleme süreleri
- **Yapay Zeka Desteği** - Gemini AI tabanlı film ve dizi önerileri

## Teknoloji Yığını

- **Frontend**: Next.js 15, React 19, TypeScript 5.8
- **Stilizasyon**: TailwindCSS 3.4
- **Paket Yöneticisi**: Bun
- **API İletişimi**: Axios
- **Animasyonlar**: Framer Motion
- **İkonlar**: React Icons
- **Slider**: React Slick
- **Yapay Zeka**: Google Gemini AI (@google/generative-ai)

## Başlangıç

### Gereksinimler

- Bun 1.1+
- Node.js 22+

### Kurulum

1. Repoyu klonlayın:

```bash
git clone https://github.com/Ahmetshbzz/dizibomba.git
cd dizibomba/dizibomba-app
```

2. Bağımlılıkları yükleyin:

```bash
bun install
```

3. Geliştirme sunucusunu başlatın:

```bash
bun dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açarak uygulamayı görüntüleyin.

## Proje Yapısı

```
dizibomba-app/
├── public/          # Statik dosyalar
├── src/
│   ├── app/         # App Router sayfaları
│   │   ├── arama/   # Arama sayfası
│   │   ├── diziler/ # Diziler sayfası ve detay
│   │   ├── filmler/ # Filmler sayfası ve detay
│   │   ├── izle/    # İzleme sayfası
│   │   ├── kategori/# Kategori sayfaları
│   │   └── page.tsx # Ana sayfa
│   ├── components/  # Yeniden kullanılabilir bileşenler
│   └── lib/         # Yardımcı fonksiyonlar ve veri
```

## Komut Listesi

```bash
# Geliştirme sunucusunu başlat
bun dev

# Üretim için build al
bun build

# Üretim uygulamasını başlat
bun start

# Lint kontrolü
bun lint
```

## Dağıtım

DiziBomba uygulaması, [Vercel Platform](https://vercel.com/) üzerinde kolayca dağıtılabilir:

1. [Vercel](https://vercel.com/new) üzerinde yeni bir proje oluşturun
2. GitHub reponuzu bağlayın
3. "Import" butonuna tıklayın
4. Gerekirse çevre değişkenlerini ayarlayın

## Katkıda Bulunma

1. Bu repoyu forklayın
2. Feature branch oluşturun (`git checkout -b ozellik/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -m 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin ozellik/yeni-ozellik`)
5. Pull Request açın

## Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

## Yapay Zeka Özellikleri

DiziBomba, kullanıcı deneyimini geliştirmek için Google Gemini AI teknolojisini kullanır:

- **Kişiselleştirilmiş Öneriler**: İzleme geçmişinize ve tercihlerinize göre film/dizi önerileri
- **İçerik Analizi**: Film ve dizilerin konusu, oyuncuları ve temalarına dayalı akıllı filtreleme
- **Duygu Tabanlı Öneriler**: Mevcut ruh halinize göre içerik önerileri
- **Benzer İçerik Bulma**: "Buna benzer içerikler" özelliği
- **Sesli Arama**: Konuşarak arama yapabilme

Yapay zeka özellikleri, kullanıcı gizliliğine saygı duyacak şekilde tasarlanmış olup, verileriniz yerel olarak işlenir ve güvenle saklanır.

## Çevre Değişkenleri

Uygulamayı çalıştırmak için aşağıdaki çevre değişkenlerini `.env.local` dosyanıza eklemeniz gerekir:

```
# Google Gemini API
GEMINI_API_KEY=your-api-key

# API Endpoint
API_URL=your-api-endpoint
```
