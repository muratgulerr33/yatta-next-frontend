# YATTA Frontend UI & Layout Özeti (V1)

## 1. Amaç

Bu dokümantasyon, YATTA Next.js frontend projesindeki UI ve layout yapısını açıklar. Özellikle header (üst bar), `/yakindayiz` sayfası ve responsive (mobil/desktop uyumlu) davranışlar hakkında bilgi verir. Hangi dosyanın hangi görünümü etkilediğini gösterir.

## 2. Kaynak Dosyalar

Aşağıdaki dosyalar incelenerek bu dokümantasyon hazırlanmıştır:

- `app/layout.jsx` – RootLayout (ana şablon), `<html>`/`<body>` yapısı, SiteHeader ve SiteFooter entegrasyonu
- `app/yakindayiz/page.jsx` – Yakında sayfası (landing hero sayfası)
- `components/layout/SiteHeader.tsx` – Header bileşeni (logo, navigasyon menüsü)
- `components/layout/SiteFooter.tsx` – Footer bileşeni
- `app/globals.css` – Global stil ve CSS token'ları
- `tailwind.config.js` – Tailwind CSS yapılandırması ve breakpoint'ler
- `public/yatta-header-primary.svg` – Header'da kullanılan ana logo
- `public/yatta-icon.webp` – Favicon ve yakindayiz sayfasında kullanılan ikon
- `app/styleguide/page.tsx` – Stil rehberi sayfası
- `app/kiralama/**/page.*` – Kiralama sayfaları
- `app/partner/**/page.*` – Partner sayfaları

## 3. Global Layout (RootLayout + Page Shell)

### 3.1 RootLayout Yapısı

RootLayout dosyası `app/layout.jsx` içinde tanımlıdır. Tüm sayfalar bu layout içinde render edilir.

Temel yapı:

```jsx
<html lang="tr" data-theme="light">
  <body className="font-sans antialiased bg-light text-primary min-h-screen flex flex-col">
    <SiteHeader />
    <main className="flex-1">
      <div className="page-shell px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </div>
    </main>
    <SiteFooter />
  </body>
</html>
```

Önemli noktalar:
- `<body>` elementi `flex flex-col` kullanır (dikey düzen)
- `min-h-screen` ile sayfa en az ekran yüksekliği kadar olur
- `main` elementi `flex-1` ile kalan alanı doldurur
- Tüm sayfa içeriği `.page-shell` wrapper'ı içinde yer alır

### 3.2 Page Shell Class'ı

`.page-shell` class'ı `app/globals.css` içinde tanımlıdır:

```css
.page-shell {
  width: 100%;
  max-width: 896px;       /* Tailwind max-w-4xl ≈ 896px */
  margin-left: auto;
  margin-right: auto;
}
```

Bu class:
- İçeriği maksimum 896px genişliğinde tutar
- Ortalar (`mx-auto` eşdeğeri)
- Responsive padding kullanır: `px-4 py-6 sm:px-6 lg:px-8`

### 3.3 Global CSS Token'ları

`app/globals.css` içinde OKLCH renk sistemi kullanılarak CSS token'ları tanımlanmıştır:

- `--color-primary`: Ana mavi renk
- `--color-accent`: Vurgu rengi (açık mavi)
- `--color-bg-primary`: Arka plan rengi
- `--color-text-primary`: Metin rengi
- `--color-border`: Kenarlık rengi
- `--color-focus-ring`: Odaklanma halkası rengi

Light ve dark tema desteği vardır (şu an light tema aktif: `data-theme="light"`).

## 4. Header (Üst Bar)

### 4.1 Dosya Konumu

Header bileşeni `components/layout/SiteHeader.tsx` dosyasında tanımlıdır.

### 4.2 Yapı

Header şu bileşenlerden oluşur:

- **Logo**: Sol tarafta, `/yatta-header-primary.svg` dosyası kullanılır
- **Desktop Navigasyon**: Sağ tarafta, `lg:` breakpoint'inden sonra görünür
- **Mobil Hamburger Menü**: Küçük ekranlarda görünür, tıklanınca dropdown menü açılır

Temel yapı:

```jsx
<header className="w-full border-b bg-white h-14 lg:h-16">
  <nav className="page-shell flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8 h-full">
    {/* Logo */}
    <Link href="/">
      <Image src="/yatta-header-primary.svg" width={112} height={28} className="h-6 lg:h-7" />
    </Link>
    
    {/* Desktop nav - hidden lg:flex */}
    <div className="hidden lg:flex items-center gap-4">
      <Link href="/turlar">Turlar</Link>
      <Link href="/organizasyon">Organizasyonlar</Link>
      <Link href="/login">Giriş Yap</Link>
      <Link href="/register">Kayıt Ol</Link>
    </div>
    
    {/* Mobil hamburger button - lg:hidden */}
    <button className="lg:hidden">...</button>
  </nav>
</header>
```

### 4.3 Önemli Tailwind Class'ları

- `h-14 lg:h-16`: Mobilde 56px, desktop'ta 64px yükseklik
- `hidden lg:flex`: Desktop'ta görünür, mobilde gizli
- `lg:hidden`: Mobilde görünür, desktop'ta gizli
- `page-shell`: İçeriği ortalar ve maksimum genişlik verir
- `flex items-center justify-between`: Logo ve menü arasında boşluk bırakır

### 4.4 Logo Kullanımı

- **Dosya**: `/yatta-header-primary.svg`
- **Boyut**: 112x28px (varsayılan), responsive olarak `h-6` (mobil) ve `lg:h-7` (desktop)
- **Priority**: `priority` prop'u ile öncelikli yüklenir

### 4.5 Mobil Hamburger Menü

- State yönetimi: `useState` ile `isOpen` durumu takip edilir
- Dropdown menü: `isOpen` true olduğunda görünür
- Menü öğeleri: Turlar, Organizasyonlar, Giriş Yap, Kayıt Ol
- Tıklama: Menü öğesine tıklanınca `isOpen` false yapılır

## 5. /yakindayiz Sayfası (Landing Hero)

### 5.1 Dosya Konumu

Sayfa `app/yakindayiz/page.jsx` dosyasında tanımlıdır.

### 5.2 Temel Yapı

Sayfa tam ekran hero (kahraman) sayfası olarak tasarlanmıştır:

```jsx
<section className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#004aad] to-[#1316d4] text-white">
  <div className="w-full text-center space-y-6">
    {/* Logo */}
    <Image src="/yatta-icon.webp" width={200} height={200} />
    
    {/* Başlık */}
    <h1 className="text-4xl md:text-6xl font-bold">Yatta.com.tr 🚤</h1>
    
    {/* Açıklama */}
    <p className="text-lg md:text-2xl mb-8 opacity-90">...</p>
    
    {/* Butonlar */}
    <div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center">
      <a href="tel:+905304872333">📞 Ara</a>
      <a href="https://wa.me/905304872333">💬 WhatsApp</a>
    </div>
    
    {/* Sosyal Medya İkonları */}
    <div className="flex gap-4 text-2xl mb-10 justify-center">
      {/* Google Maps, Facebook, Instagram, TikTok, YouTube */}
    </div>
    
    {/* Footer */}
    <p className="mt-12 text-sm opacity-70">© 2025 Yatta.com.tr — Eğriçam Marina, Mersin</p>
  </div>
</section>
```

### 5.3 Arkaplan

- **Gradient**: `bg-gradient-to-br from-[#004aad] to-[#1316d4]`
  - Sol üstten sağ alta mavi gradient
  - Başlangıç: `#004aad` (koyu mavi)
  - Bitiş: `#1316d4` (parlak mavi)
- **Tam ekran**: `min-h-screen` ile en az ekran yüksekliği kadar
- **Ortalama**: `flex flex-col items-center justify-center` ile içerik ortalanır

### 5.4 İçerik Düzeni

- **Logo**: `/yatta-icon.webp` (200x200px), ortada, gölge efekti (`drop-shadow-lg`)
- **Başlık**: `text-4xl md:text-6xl` (mobilde küçük, desktop'ta büyük)
- **Butonlar**: 
  - Mobilde dikey (`flex-col`), desktop'ta yatay (`sm:flex-row`)
  - Ara butonu: beyaz arka plan, mavi metin
  - WhatsApp butonu: yeşil arka plan
- **Sosyal medya**: Font Awesome ikonları kullanılır (fab fa-*)

### 5.5 Responsive Davranış

- **Mobil**: İçerik tek kolon, butonlar dikey, küçük font boyutları
- **Desktop**: İçerik geniş, butonlar yatay, büyük font boyutları
- **Padding**: Sayfa `.page-shell` kullanmaz, kendi padding'ini yönetir

## 6. Diğer Önemli Sayfalar / Layout'lar

### 6.1 Styleguide Sayfası (`app/styleguide/page.tsx`)

- **Amaç**: Renk token'larını ve bileşenleri önizlemek için kullanılır
- **Layout**: `.page-shell` kullanmaz, kendi padding'ini yönetir (`px-6 py-8`)
- **Özellikler**: 
  - CSS token'larını gösterir (neutrals, brand, state)
  - Typography örnekleri
  - Button örnekleri
  - Grid layout: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### 6.2 Kiralama Sayfaları

**Liste Sayfası** (`app/kiralama/page.tsx`):
- Şu an placeholder (basit metin)
- `.page-shell` kullanır

**Detay Sayfası** (`app/kiralama/[slugId]/page.tsx`):
- Dinamik route (slugId parametresi)
- Container layout: `container mx-auto p-6`
- JSON-LD schema markup içerir
- SEO için canonical URL ve OpenGraph meta'ları

### 6.3 Partner Sayfası (`app/partner/[slug]/page.jsx`)

- **Layout**: `min-h-screen bg-white`
- **Container**: `max-w-4xl mx-auto` (896px maksimum genişlik)
- **Grid**: `md:grid-cols-[2fr,1.2fr]` (desktop'ta 2 kolon)
- **Özellikler**: Partner bilgileri, iletişim kutusu, responsive tasarım

### 6.4 Hata Sayfaları

- **404** (`app/not-found.jsx`): Siyah arka plan, neon glow efekti
- **Error** (`app/error.jsx`): Siyah arka plan, hata mesajı, "Tekrar Dene" butonu
- **Global Error** (`app/global-error.jsx`): Root layout hataları için

## 7. Responsive Davranış

### 7.1 Tailwind Breakpoint'leri

Tailwind CSS varsayılan breakpoint'leri kullanılır (`tailwind.config.js` içinde özel ayar yok):

- **Base**: 0px (mobil)
- **sm**: 640px (küçük tablet)
- **md**: 768px (tablet)
- **lg**: 1024px (desktop)

### 7.2 Header Responsive Davranışı

- **Yükseklik**: `h-14` (mobil) → `lg:h-16` (desktop)
- **Logo**: `h-6` (mobil) → `lg:h-7` (desktop)
- **Navigasyon**: 
  - Mobil: Hamburger menü (`lg:hidden`)
  - Desktop: Yatay menü (`hidden lg:flex`)
- **Padding**: `px-4 py-3 sm:px-6 lg:px-8`

### 7.3 /yakindayiz Sayfası Responsive Davranışı

- **Başlık**: `text-4xl` (mobil) → `md:text-6xl` (desktop)
- **Açıklama**: `text-lg` (mobil) → `md:text-2xl` (desktop)
- **Butonlar**: `flex-col` (mobil) → `sm:flex-row` (desktop)
- **İçerik genişliği**: Tam genişlik (`w-full`), padding yok

### 7.4 Genel Container Davranışı

- **`.page-shell`**: 
  - Maksimum genişlik: 896px
  - Padding: `px-4 py-6` (mobil) → `sm:px-6 lg:px-8` (desktop)
  - Ortalama: `mx-auto`
- **Tablet için özel layout**: Genelde `md:` breakpoint'i kullanılmaz, `sm:` ve `lg:` arasında geçiş yapılır

## 8. Logo ve Maskot Kullanımı

### 8.1 Public Klasöründeki Logo Dosyaları

- **`/yatta-header-primary.svg`**: Header'da kullanılan ana logo (112x28px)
- **`/yatta-header-inverse.svg`**: Ters renk logo (koyu arka planlar için)
- **`/yatta-header-mono.svg`**: Monokrom logo
- **`/yatta-icon.webp`**: Favicon ve yakindayiz sayfasında kullanılan ikon (200x200px)
- **`/logo-yatta.svg`**: Alternatif logo (kullanım yeri belirtilmemiş)

### 8.2 Kullanım Yerleri

- **Header**: `/yatta-header-primary.svg` (SiteHeader bileşeni)
- **/yakindayiz Sayfası**: `/yatta-icon.webp` (hero logo)
- **Favicon**: `/yatta-icon.webp` (metadata içinde belirtilmiş)
- **OpenGraph**: `/yatta-icon.webp` (sosyal medya paylaşımları için)

### 8.3 Logo Boyutları

- **Header logo**: 112x28px (varsayılan), responsive `h-6 lg:h-7`
- **Hero logo**: 200x200px (sabit)
- **Favicon**: 1200x630px (OpenGraph için)

## 9. Açık İşler / Notlar

### 9.1 Header İle İlgili

- Hamburger menü çalışıyor ancak gerçek navigasyon linkleri henüz aktif sayfalara bağlı değil (`/turlar`, `/organizasyon` sayfaları henüz oluşturulmamış olabilir)
- Mobil alt tab bar henüz eklenmedi (gelecekte eklenebilir)

### 9.2 /yakindayiz Sayfası İle İlgili

- Sayfa tam ekran hero olarak tasarlanmış, `.page-shell` kullanmıyor
- İçerik ortalanmış ve responsive
- Sosyal medya linkleri aktif

### 9.3 Genel Layout İle İlgili

- `.page-shell` class'ı tüm sayfalarda tutarlı kullanılıyor
- Footer basit yapıda, gelecekte genişletilebilir
- Dark tema desteği CSS'te hazır ancak şu an light tema aktif

### 9.4 Kiralama Sayfaları İle İlgili

- `app/kiralama/page.tsx` henüz placeholder (basit metin)
- Detay sayfası (`app/kiralama/[slugId]/page.tsx`) mock veri kullanıyor, gerçek API entegrasyonu yapılacak (TODO yorumu var)

### 9.5 Partner Sayfası İle İlgili

- Sayfa çalışıyor, API entegrasyonu mevcut
- İleride CTA butonları (rezervasyon isteği, mesaj vb.) eklenebilir (yorum olarak not edilmiş)

### 9.6 CSS Token Sistemi

- OKLCH renk sistemi kullanılıyor (modern ve erişilebilir)
- Light/dark tema desteği hazır
- Styleguide sayfası token'ları görselleştirmek için kullanılabilir

---

## 10. Global Layout Safe-Area Refactor (Kasım 2025)

### 10.1. Safe-Area Padding Düzenlemesi

**Güncel 2025 durumu:** `app/(site)/layout.jsx` dosyasındaki SiteLayout bileşeni header ile hizalı safe-area pattern'ine getirildi.

**Değişiklikler:**
- Root layout (`app/layout.jsx`) içinde global horizontal padding eklendi
- Site layout (`app/(site)/layout.jsx`) içindeki gereksiz spacing kaldırıldı
- Tutarlı safe-area margin'ler sağlandı

**Yapı:**
```jsx
// app/layout.jsx
<html lang="tr" data-theme="light">
  <body className="font-sans antialiased bg-light text-primary min-h-screen flex flex-col">
    <SiteHeader />
    <main className="flex-1 px-4 sm:px-6 lg:px-8">
      {/* Global horizontal padding */}
      {children}
    </main>
    <SiteFooter />
  </body>
</html>
```

### 10.2. 15px Padding Ayarlamaları

**Uygulama:**
- Layout'larda 15px padding değerleri kullanıldı
- Responsive breakpoint'lerde padding değerleri ayarlandı
- Mobil ve desktop arasında tutarlılık sağlandı

**Tailwind Config:**
```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      padding: {
        'safe': '15px',
      },
    },
  },
}
```

### 10.3. Kiralama Sayfası İç Container Düzenlemeleri

**Değişiklikler:**
- Kiralama sayfasına iç constrained container eklendi
- `.page-shell` ile maksimum genişlik ve ortalama sağlandı
- Responsive padding uygulandı

**Yapı:**
```tsx
// app/(site)/kiralama/page.tsx
<div className="page-shell px-4 py-6 sm:px-6 lg:px-8">
  {/* Kiralama içeriği */}
</div>
```

### 10.4. Footer Tasarımı Güncellemeleri

**Değişiklikler:**
- Footer'a header'dakine benzer layout yapısı kazandırıldı
- `.page-shell` container ile ortalama uygulandı
- Responsive padding ile safe-area sağlandı
- Footer link/paragraf renkleri Tailwind ile beyaz tonlarına çekildi

**Yapı:**
```tsx
// components/layout/SiteFooter.tsx
<footer className="w-full border-t bg-white">
  <div className="page-shell px-4 py-6 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row justify-between items-center">
      {/* Footer içeriği */}
    </div>
  </div>
</footer>
```

### 10.5. Tailwind ve globals.css Düzenlemeleri

**globals.css:**
- Safe-area padding değişkenleri eklendi
- CSS token'ları güncellendi
- Responsive utility class'lar eklendi

**tailwind.config.js:**
- Yeni utility class'lar eklendi
- Responsive breakpoint'ler güncellendi
- Custom padding değerleri tanımlandı

### 10.6. Global Site Layout Reset

**Amaç:** Root layout'tan `.page-shell` wrapper'ını kaldırıp, Next.js route group (`(site)`) kullanarak içerik sayfalarını `.page-shell` ile sarmak.

**Değişiklikler:**
- Root layout (`app/layout.jsx`) içinden `.page-shell` kaldırıldı
- `(site)` route group içinde `.page-shell` uygulandı
- Root `main` elementi unpadded bırakıldı (sadece global horizontal padding)
- Nested layout'larda safe-area padding uygulandı

**Önceki Yapı:**
```jsx
// app/layout.jsx (ESKİ)
<main className="flex-1">
  <div className="page-shell px-4 py-6 sm:px-6 lg:px-8">
    {children}
  </div>
</main>
```

**Yeni Yapı:**
```jsx
// app/layout.jsx (YENİ)
<main className="flex-1 px-4 sm:px-6 lg:px-8">
  {children}
</main>

// app/(site)/layout.jsx
<div className="page-shell">
  {children}
</div>
```

---

**Son Güncelleme**: 24 Kasım 2025 — Global layout safe-area refactor detayları eklendi

**Hazırlayan**: Kod analizi ile otomatik oluşturulmuştur.

