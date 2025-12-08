# YATTA Frontend UI Kuralları (V1)

Bu doküman, **YATTA V1** için tipografi, responsive (mobil/desktop) davranış ve header logo kullanım kurallarını özetler 
dosya adı:5-frontend-04-ui-rules-v1.md
Amaç: **mobil öncelikli, hızlı, okunaklı ve tutarlı** bir arayüz standartı oluşturmak.

---

## 1. Font Sistemi

### 1.1. Ürün UI font ailesi (Inter)

Tüm arayüz (metinler, butonlar, formlar, tablo vs.) için **Inter font ailesi** kullanılır:

```css
:root {
  /* Tüm UI için ana sans-serif font ailesi */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont,
               "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

body {
  font-family: var(--font-sans);
}
```

**Inter Font Özellikleri:**

* **Kaynak:** Google Fonts veya self-host edilmiş
* **Stil:** Sans-serif, modern ve okunabilir
* **Kullanım:** Tüm UI elemanları için birincil font
* **Fallback:** Sistem fontları (yükleme hatası durumunda)

**Neden Inter?**

* Modern ve profesyonel görünüm
* Mükemmel okunabilirlik (hem ekran hem baskı için optimize)
* Geniş karakter seti desteği
* Hem e-ticaret hem booking için gereken "kurumsal ama sıcak" hissi verir
* V1'de tutarlı tipografi sağlar

---

### 1.2. Temel tipografi skalası

**Root font-size:** 16px

#### Body (paragraflar)

* Boyut: **16px** (`text-base`)
* Ağırlık: **400** (normal)
* Satır aralığı: **1.5**
* Kullanım: açıklamalar, ürün/hizmet detayları, içerik metinleri.

#### Küçük metin / meta bilgiler

* Boyut: **13–14px** (`text-xs` / `text-sm`)
* Ağırlık: 400
* Satır aralığı: 1.4
* Kullanım: tarih, kategori etiketi, ufak yardımcı metinler.

#### Başlık hiyerarşisi (mobil + desktop ortak)

| Rol | Boyut   | Ağırlık | Satır aralığı | Örnek kullanım                      |
| --- | ------- | ------- | ------------- | ----------------------------------- |
| H1  | 32–36px | 700     | 1.2           | Ana sayfa hero başlığı              |
| H2  | 24–28px | 600     | 1.3           | Sayfa başlıkları                    |
| H3  | 20–22px | 600     | 1.3           | Kart/ilan başlıkları, bölüm başlığı |
| H4  | 18px    | 600     | 1.3           | Form / panel başlıkları             |
| H5  | 16px    | 600     | 1.3           | Tab başlıkları, küçük section’lar   |
| H6  | 14px    | 600     | 1.3           | Çok küçük başlık/etiketler          |

İsteğe bağlı:

* H1 için `letter-spacing: -0.01em` (büyük başlıklarda daha derli toplu durur).

#### Butonlar (CTA)

* Boyut: **15–16px**
* Ağırlık: **600**
* Satır aralığı: **1.2**
* `min-height: 44px` (özellikle mobil için erişilebilirlik)
* `letter-spacing: 0.02–0.04em` (özellikle tüm büyük harf kullanılıyorsa)

**Button Component (V1 Modernizasyonu):**
* Button component modernize edildi (2025-11-27)
* Design token'lara uyumlu variant'lar (primary, secondary, outline)
* Responsive davranış: mobilde tam genişlik, desktop'ta auto
* Loading state ve disabled state desteği

#### Form Elemanları (Input, PasswordInput)

**Input Component:**
* Modernize edildi (2025-11-27)
* Inter font ailesi kullanır
* Border radius: 8px (mobil için dokunma dostu)
* Focus state: primary renk border
* Error state: kırmızı border + helper text
* Placeholder: gri ton (#9CA3AF)

**PasswordInput Component:**
* Input component'inin özel varyasyonu
* Göster/gizle toggle butonu
* Güvenlik ikonu (göz ikonu) kullanımı

**Form Tutarlılık Kuralları:**
* Tüm form elemanları aynı yükseklikte (44px min-height)
* Label ve input arasında 8px boşluk
* Helper text: 12–13px, gri ton
* Error mesajları: kırmızı, 12–13px

Genel kural:
**Butonlar, formlar ve tüm UI elemanları aynı Inter font ailesini kullanır.**
V1'de UI içinde ikinci bir font yoktur (logo SVG'deki Manrope hariç).

---

## 2. Responsive Davranış – AppSheet Mantığı

### 2.1. Tasarım prensibi

* **Mobile-first**: Tasarımın ana referansı **mobil görünüm**dür.
* **Tablet**: Ayrı layout tasarlanmamış; mobil layout genişleyerek kullanılır.
* **Desktop**:

  * Aynı bilgi mimarisi korunur.
  * Sadece geniş ekranda **ferahlık ve ek fonksiyonlar** eklenir.

### 2.2. Breakpoint yapısı (Tailwind mantığı)

* `base` (0–1023px): **Mobil + Tablet** ortak layout
* `lg` (≥1024px): **Desktop iyileştirmeleri**

Gereksiz yere `sm`, `md` gibi ek breakpoint kullanılmaz; sade tutulur.

### 2.3. Navigasyon

**Mobil & Tablet (0–1023px)**

* Üstte beyaz/siyah **app bar**:

  * Solda: hamburger veya geri ok
  * solda veya ortaya yakın hamburger menü ikonundan sonra: header logo
  * Sağda: arama / yenile ikonları
* Altta **tab bar**:

  * Örn: Rezervasyon, Extra, Kayıtlar, Kurumsal, Takvim
* Bu yapı, AppSheet uygulamasındaki akışa benzer şekilde sabittir.

**Desktop (≥1024px)**

* Üst app bar ve alt tab bar **aynen korunur** → cihazlar arası tutarlılık.
* İçerik alanı:

  * `max-width: 1024–1200px`
  * `margin: 0 auto;` ile ortalanır.
* (Opsiyonel – V2 veya V1.1):
  Sadece desktop’ta görünen **sol vertical menü / filtre paneli** eklenebilir.
  Bu panel:

  * Rezervasyon filtreleri
  * Partner kısayolları
  * Profil/ayar linkleri için kullanılabilir.

### 2.4. Tablet kararı

* Ayrı bir "tablet tasarımı" yoktur.
* Tablet kullanıcıları, **mobil layout'un genişlemiş hâlini** görür.
* Özellikle **portrait** kullanımda:

  * Rezervasyon formu
  * Takvim
  * Profil ekranı
    akışları test edilmelidir.

### 2.5. Mobil Swipe ve Gesture Davranışları

**Mobil Swipe Kuralları:**
* ListingGallery component'inde fullscreen slider için swipe gesture'ları kullanılır
* Yatay swipe: görsel geçişi için
* Dikey swipe: fullscreen moddan çıkış için
* Swipe threshold: minimum 50px hareket

**MobileStickyActionBar:**
* Mobil cihazlarda sayfa altında sabitlenmiş action bar
* Yükseklik: 56–64px
* Z-index: 1000 (diğer içeriklerin üstünde)
* Desktop'ta gizlenir veya sidebar'a dönüşür

### 2.6. Profil Paneli Responsive Davranışı

**Mobil (0–1023px):**
* Tab navigation: alt kısımda horizontal scroll
* İçerik: full-width, padding 15px
* Form'lar: tek sütun, tam genişlik

**Desktop (≥1024px):**
* Tab navigation: üst kısımda horizontal
* İçerik: max-width 1200px, ortalanmış
* Form'lar: iki sütun layout (mümkünse)

---

## 3. Header Logo Kuralları

### 3.1. Logo tipi (Wordmark + font)

Header’da kullanılacak logo:

* Metin: **`Yatta`**
* Yazım: **İlk harf büyük, diğerleri küçük**

  * `Yatta` ✅
  * `.Yatta`, `yatta.com.tr` ❌ (header için kullanılmaz)
* Font: **Manrope ExtraBold** (veya Bold)
* Kullanım şekli:

  * Ürün içinde **metin olarak değil**,
  * **SVG wordmark** olarak kullanılır.

> UI genel fontu Inter'dir, sadece logo SVG'de Manrope gömülü olur.

### 3.2. Boyutlar

Header için önerilen değerler:

**Mobil/Tablet**

* Header yüksekliği: **56px**
* Logo (SVG) yüksekliği: **24px**
* Soldan padding: **16px**

**Desktop**

* Header yüksekliği: **64px**
* Logo yüksekliği: **28px**
* Soldan padding: **16–20px**

UI tarafında, logo genelde aşağıdaki gibi ölçeklenir:

```css
.header-logo {
  height: 24px;          /* mobil */
}

@media (min-width: 1024px) {
  .header-logo {
    height: 28px;        /* desktop */
  }
}
```

### 3.3. Renk varyasyonları

Header ve diğer alanlar için üç ana SVG wordmark üretilir:

| Adı                    | Kullanım alanı                                | Metin rengi              | Arka plan   |
| ---------------------- | --------------------------------------------- | ------------------------ | ----------- |
| `yatta-header-primary` | Light tema header (beyaz zemin)               | `#2563EB` veya `#2D4ED8` | Transparent |
| `yatta-header-inverse` | Koyu mavi/dark arka planlar, hero, buton      | `#FFFFFF`                | Transparent |
| `yatta-header-mono`    | Bej/açık zeminler, doküman, siyah-beyaz işler | `#111827` (çok koyu gri) | Transparent |

> V1’de header için **primary** varyasyon kullanılır.
> Diğerleri kartlar, dark alanlar veya özel tasarımlar için yedek olarak tutulur.

### 3.4. Logo + maskot kullanımı

* Header’da:

  * **Maskot (kaptan)** ve **kompas** ikonları **kullanılmaz**.
* Maskot / kompas için uygun alanlar:

  * Landing hero
  * Onboarding ekranları
  * Boş durum ekranları (empty state)
  * Kampanya kartları

Amaç:
Header minimal, okunaklı ve fonksiyonel kalsın; maskot daha özgür alanlarda marka karakterini taşısın.

---

## 4. Dosya Yapısı ve İsimlendirme

Logo sistem klasöründe önerilen yapı:

```text
Yatta-Logo-System/
  01-Logo-Master/
    (Kaynak Canva/Figma dosyaları)
  02-Brand-Colors/
  03-Typography/
  04-Icon-Maskot/
  05-Exports/
    header-logo/
      yatta-header-primary.svg
      yatta-header-inverse.svg
      yatta-header-mono.svg
  06-HTML-Mockups/
```

* **Master tasarım dosyaları** → `01-Logo-Master`
* **Projede kullanılacak final SVG’ler** → `05-Exports/header-logo`

Next.js projesinde:

```text
/apps/frontend/public/brand/
  yatta-header-primary.svg
  yatta-header-inverse.svg
  yatta-header-mono.svg
```

Kullanım örneği (React):

```tsx
// Header.tsx
export function Header() {
  return (
    <header className="flex h-14 lg:h-16 items-center px-4 border-b bg-white">
      {/* Logo */}
      <img
        src="/brand/yatta-header-primary.svg"
        alt="Yatta"
        className="h-6 lg:h-7 header-logo"
      />

      {/* ... diğer header içerikleri ... */}
    </header>
  );
}
```

---

## 5. V2 İçin Notlar (Şimdiden Bilinsin)

* **Custom brand font (örn. "Yatta Sans")**:

  * V2'de, Inter font yerine özel brand fontuna geçiş yapılabilir (şu an Inter kullanılıyor).
* **Desktop’ta gelişmiş layout**:

  * Sol tarafta vertical menü + sağda içerik (split layout) düşünülebilir.
* **Dark tema**:

  * Açılırsa, dark header’da `yatta-header-inverse.svg` kullanılacaktır.

---

## 6. Global Layout Safe-Area ve Padding (Kasım 2025)

### 6.1. Safe-Area Padding Refactor

**Güncel 2025 durumu:** Global layout safe-area padding yapısı yeniden düzenlendi.

**Değişiklikler:**
- Root layout (`app/layout.jsx`) içinde global horizontal padding eklendi
- Site layout (`app/(site)/layout.jsx`) içindeki gereksiz padding kaldırıldı
- Tutarlı safe-area margin'ler sağlandı

**Padding Yapısı:**
- Root layout: Global horizontal padding (15px veya responsive değerler)
- Site layout: Gereksiz padding kaldırıldı
- Page shell: İçerik için maksimum genişlik ve ortalama

### 6.2. 15px Padding Ayarlamaları

**Uygulama:**
- Layout'larda 15px padding değerleri kullanıldı
- Responsive breakpoint'lerde padding değerleri ayarlandı
- Mobil ve desktop arasında tutarlılık sağlandı

**Kullanım:**
```css
/* globals.css veya Tailwind class'ları */
.padding-safe {
  padding-left: 15px;
  padding-right: 15px;
}

@media (min-width: 1024px) {
  .padding-safe {
    padding-left: 20px;
    padding-right: 20px;
  }
}
```

### 6.3. Footer Tasarımı Güncellemeleri

**Değişiklikler:**
- Footer'a header'dakine benzer layout yapısı kazandırıldı
- `.page-shell` container ile ortalama uygulandı
- Responsive padding ile safe-area sağlandı
- Footer link/paragraf renkleri Tailwind ile beyaz tonlarına çekildi

**Yapı:**
```tsx
<footer className="w-full border-t bg-white">
  <div className="page-shell px-4 py-6 sm:px-6 lg:px-8">
    {/* Footer içeriği */}
  </div>
</footer>
```

### 6.4. Global Site Layout Reset

**Amaç:** Root layout'tan `.page-shell` wrapper'ını kaldırıp, Next.js route group (`(site)`) kullanarak içerik sayfalarını `.page-shell` ile sarmak.

**Değişiklikler:**
- Root layout'tan `.page-shell` kaldırıldı
- `(site)` route group içinde `.page-shell` uygulandı
- Root `main` elementi unpadded bırakıldı
- Nested layout'larda safe-area padding uygulandı

---

## 7. Listing Wizard (İlan Verme Formu) UI Kuralları

### 7.1. Genel Yapı

Listing Wizard, satılık tekne ilanı oluşturmak için 5 adımlı bir form sistemidir.

**Adım Yapısı:**
1. **Step 1: Kimlik ve Konum** - Tekne kimlik bilgileri, marka, model, konum
2. **Step 2: Teknik Özellikler** - Boyut, kapasite, motor, yakıt tipi
3. **Step 3: Hikaye ve Fiyat** - Açıklama, fiyat, para birimi
4. **Step 4: Fotoğraflar** - Medya yükleme ve düzenleme
5. **Step 5: Satıcı Bilgileri** - Satıcı tipi, iletişim bilgileri, önizleme

**Stepper UI:**
* Üst kısımda adım göstergesi (1/5, 2/5, vb.)
* Mobil: sadece mevcut adım numarası
* Desktop: tüm adımlar görünür, aktif adım vurgulanır
* Geri/İleri butonları: alt kısımda sabit

### 7.2. Form Alanları Düzeni

**Genel Kurallar:**
* Her adımda maksimum 8–10 form alanı
* Label'lar: 14px, font-weight 600, gri ton
* Input yüksekliği: 44px (mobil erişilebilirlik)
* Alanlar arası boşluk: 20–24px

**Step 1 (Kimlik ve Konum):**
* Marka, model, yapım yılı: üst sıra
* İl, ilçe: alt sıra (dropdown'lar)
* Bayrağı (kayıt ülkesi): dropdown, varsayılan "Türkiye"

**Step 2 (Teknik Özellikler):**
* Boyut bilgileri: uzunluk, genişlik (metre cinsinden)
* Kapasite: kişi sayısı, kabin sayısı
* Motor: motor adedi, yakıt tipi
* Giriş alanları: number input'lar

**Step 3 (Hikaye ve Fiyat):**
* Açıklama: textarea, minimum 100 karakter
* Fiyat: number input, para birimi seçici (TRY/USD/EUR)
* **Not:** "Fiyat talep üzerine" checkbox kaldırıldı (2025-11-27)

**Step 4 (Fotoğraflar):**
* Maksimum 10 fotoğraf
* Drag & drop ile sıralama
* İlk fotoğraf otomatik "Kapak" olarak işaretlenir
* Fotoğraf önizleme: grid layout, 3 sütun (mobil: 2 sütun)
* Silme butonu: her fotoğrafın üst sağ köşesinde

**Step 5 (Satıcı Bilgileri):**
* Satıcı tipi: "Sahibinden" / "Emlakçıdan" / "Broker" (dropdown)
* İletişim telefonu: text input, validasyon (min 7–8 karakter)
* Önizleme: form verilerinin özeti

### 7.3. Validasyon ve Hata Mesajları

**Validasyon Kuralları:**
* Zorunlu alanlar: kırmızı asterisk (*) ile işaretlenir
* Hata mesajları: input'un altında, kırmızı renk, 12px
* Form gönderimi: tüm zorunlu alanlar dolu olmalı

**Görsel Geri Bildirim:**
* Başarılı kayıt: yeşil toast mesajı
* Hata durumu: kırmızı toast mesajı + form alanlarında hata işaretleme
* Loading state: butonlarda spinner, form alanları disabled

---

## 8. Yeni Component'ler ve UI Standartları

### 8.1. SaleBoatCard Component Kuralları

**Kullanım:**
* Satılık tekneler liste sayfasında (`/satilik-tekneler`)
* Design token'lara uyumlu
* Responsive: mobilde tek sütun, desktop'ta grid

**Tasarım Özellikleri:**
* Kart yüksekliği: otomatik (içerik bazlı)
* Border radius: 12px
* Shadow: hafif gölge (hover'da artar)
* Kapak fotoğrafı: aspect ratio 16:9, object-fit cover

**İçerik Düzeni:**
* Üst: kapak fotoğrafı
* Orta: başlık (H3), konum, teknik özellikler
* Alt: fiyat (sağda), "İncele" butonu (solda)
* Favori butonu: sağ üst köşe (kalp ikonu)

**Responsive Davranış:**
* Mobil: tam genişlik, dikey layout
* Desktop: grid layout, 2–3 sütun
* Hover: kart yükselir (transform: translateY(-2px))

### 8.2. ListingGallery Component Kuralları

**Fullscreen Slider:**
* Tıklama ile fullscreen moda geçiş
* Ok butonları: sağ/sol, yuvarlak, yarı saydam arka plan
* Klavye navigasyonu: ← → ok tuşları
* ESC tuşu: fullscreen'den çıkış

**Mobil Swipe İyileştirmeleri:**
* Yatay swipe: görsel geçişi (minimum 50px hareket)
* Dikey swipe: fullscreen'den çıkış
* Swipe animasyonu: smooth transition (300ms)

**Görsel Geçiş Animasyonları:**
* Fade transition: 300ms ease-in-out
* Thumbnail navigation: alt kısımda, scrollable
* Aktif thumbnail: border ile vurgulanır

### 8.3. CategoryComingSoon Component Kuralları

**Kullanım:**
* Kategori sayfalarında henüz içerik yoksa gösterilir
* Reusable component: turlar, kiralama, konaklama, organizasyon için

**Tasarım:**
* Merkezi layout
* İkon veya görsel: üst kısım
* "Yakında" başlığı: H2, 24–28px
* Açıklama metni: 16px, gri ton, ortalanmış
* CTA butonu: "Ana Sayfaya Dön" (opsiyonel)

**Responsive:**
* Mobil: padding 20px
* Desktop: padding 40px, max-width 600px, ortalanmış

### 8.4. CategoryShowcase Component Kuralları

**Görsel Tasarım Güncellemesi (2025-11-26):**
* Kartlar: modern standartlara göre güncellendi
* Slider mantığı korundu
* Hover efektleri: kart yükselme animasyonu
* Border radius: 12px

---

Bu doküman, **YATTA V1** tasarım kararlarının referansıdır.
Yeni ekranlar tasarlanırken ve komponent kütüphanesi oluşturulurken bu kurallara uyulmalıdır.

**Son Güncelleme:** 3 Aralık 2025 — UI Rules dokümantasyonu 7days-develop.md5 dosyasındaki UI/UX değişiklikleri ile güncellendi. Listing Wizard, yeni component'ler, form modernizasyonu ve responsive iyileştirmeleri eklendi.
