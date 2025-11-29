# YATTA Frontend UI Kuralları (V1)

Bu doküman, **YATTA V1** için tipografi, responsive (mobil/desktop) davranış ve header logo kullanım kurallarını özetler 
dosya adı:5-frontend-04-ui-rules-v1.md
Amaç: **mobil öncelikli, hızlı, okunaklı ve tutarlı** bir arayüz standartı oluşturmak.

---

## 1. Font Sistemi

### 1.1. Ürün UI font ailesi (system font stack)

Tüm arayüz (metinler, butonlar, formlar, tablo vs.) için **tek font ailesi** kullanılır:

```css
:root {
  /* Tüm UI için ana sans-serif font ailesi */
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont,
               "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

body {
  font-family: var(--font-sans);
}
````

> Not: Bu fontlar cihazın kendi native UI fontlarıdır
> (iOS/macOS: SF Pro, Windows: Segoe UI, Android: Roboto).

**Neden?**

* Harici font dosyası yok → **daha hızlı yüklenme**.
* Kullanıcı zaten bu fontlara alışık → **güven ve okunabilirlik** yüksek.
* Hem e-ticaret hem booking için gereken “kurumsal ama sıcak” hissi verir.
* V1 bakımı kolay; V2’de istersek kendi brand fontumuzu ekleriz.

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

Genel kural:
**Butonlar, formlar ve tüm UI elemanları aynı system font ailesini kullanır.**
V1’de UI içinde ikinci bir font yoktur.

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

* Ayrı bir “tablet tasarımı” yoktur.
* Tablet kullanıcıları, **mobil layout’un genişlemiş hâlini** görür.
* Özellikle **portrait** kullanımda:

  * Rezervasyon formu
  * Takvim
  * Profil ekranı
    akışları test edilmelidir.

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

> UI genel fontu system-ui kalır, sadece logo SVG’de Manrope gömülü olur.

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

* **Custom brand font (örn. “Yatta Sans”)**:

  * V2’de, system font yerine self-host edilen tek bir sans-serif fonta geçiş yapılabilir.
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

Bu doküman, **YATTA V1** tasarım kararlarının referansıdır.
Yeni ekranlar tasarlanırken ve komponent kütüphanesi oluşturulurken bu kurallara uyulmalıdır.

**Son Güncelleme:** 24 Kasım 2025 — Global layout safe-area ve padding değişiklikleri eklendi
