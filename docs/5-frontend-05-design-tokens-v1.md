# Tasarım Sistemi Rehberi - Tailwind CSS Token'ları ve Stil Kuralları

Bu dosya, projenin tüm tasarım tokenlarını, renk paletini, tipografi kurallarını ve stil rehberini içermektedir. Gemini AI tarafından parse edilebilir formatta yapılandırılmıştır.

---

## 1. RENK SİSTEMİ (OKLCH)

Proje OKLCH (Oklch) renk uzayını kullanmaktadır. OKLCH formatı: `oklch(lightness chroma hue)`

### 1.1 Light Tema Renk Tokenları

#### Primary Colors (Mavi Tonları)
```css
--color-primary: oklch(0.45 0.20 250)
--color-primary-hover: color-mix(in oklch, var(--color-primary), oklch(0.55 0.20 250) 20%)
--color-primary-active: color-mix(in oklch, var(--color-primary), oklch(0.35 0.20 250) 20%)
```

**Açıklama:**
- Primary: Ana marka rengi (koyu mavi)
- Hue: 250 (mavi ton)
- Chroma: 0.20 (doygunluk)
- Lightness: 0.45 (orta koyu)

#### Accent Colors (Açık Mavi/Vurgu)
```css
--color-accent: oklch(0.70 0.15 240)
--color-accent-hover: color-mix(in oklch, var(--color-accent), oklch(0.60 0.15 240) 15%)
--color-accent-active: color-mix(in oklch, var(--color-accent), oklch(0.75 0.15 240) 15%)
```

**Açıklama:**
- Accent: Vurgu rengi (açık mavi)
- Hue: 240 (biraz daha soğuk mavi)
- Chroma: 0.15 (daha az doygun)
- Lightness: 0.70 (açık)

#### Background Colors
```css
--color-bg-primary: oklch(0.98 0.005 250)    /* Ana arka plan - çok açık */
--color-bg-secondary: oklch(0.95 0.01 250)   /* İkincil arka plan */
--color-bg-tertiary: oklch(0.92 0.015 250)    /* Üçüncül arka plan */
```

**Açıklama:**
- Primary: En açık arka plan (neredeyse beyaz)
- Secondary: Kartlar ve bölümler için
- Tertiary: Daha koyu kartlar için

#### Text Colors
```css
--color-text-primary: oklch(0.20 0.02 250)     /* Ana metin - çok koyu */
--color-text-secondary: oklch(0.40 0.015 250)  /* İkincil metin */
--color-text-inverse: oklch(0.98 0.005 250)   /* Ters metin (açık arka plan üzerinde) */
```

**Açıklama:**
- Primary: Başlıklar ve önemli metinler
- Secondary: Açıklamalar ve yardımcı metinler
- Inverse: Koyu arka plan üzerinde kullanılacak açık metin

#### Border Colors
```css
--color-border: oklch(0.85 0.02 250)           /* Standart kenarlık */
--color-border-focus: var(--color-primary)     /* Odaklanma kenarlığı */
```

#### Focus Ring
```css
--color-focus-ring: oklch(0.55 0.25 250)      /* Odaklanma halkası rengi */
--focus-ring-width: 3px                        /* Halka genişliği */
--focus-ring-offset: 2px                      /* Halka offset değeri */
```

### 1.2 Dark Tema Renk Tokenları

#### Primary Colors
```css
--color-primary: oklch(0.65 0.20 250)          /* Açık mavi (dark tema için) */
--color-primary-hover: color-mix(in oklch, var(--color-primary), oklch(0.75 0.20 250) 20%)
--color-primary-active: color-mix(in oklch, var(--color-primary), oklch(0.55 0.20 250) 20%)
```

#### Accent Colors
```css
--color-accent: oklch(0.50 0.15 240)
--color-accent-hover: color-mix(in oklch, var(--color-accent), oklch(0.55 0.15 240) 15%)
--color-accent-active: color-mix(in oklch, var(--color-accent), oklch(0.45 0.15 240) 15%)
```

#### Background Colors
```css
--color-bg-primary: oklch(0.15 0.02 250)       /* Koyu ana arka plan */
--color-bg-secondary: oklch(0.20 0.025 250)    /* Koyu ikincil arka plan */
--color-bg-tertiary: oklch(0.25 0.03 250)      /* Koyu üçüncül arka plan */
```

#### Text Colors
```css
--color-text-primary: oklch(0.95 0.005 250)   /* Açık metin (dark tema için) */
--color-text-secondary: oklch(0.75 0.01 250)   /* Açık ikincil metin */
--color-text-inverse: oklch(0.20 0.02 250)     /* Ters metin (koyu) */
```

#### Border Colors
```css
--color-border: oklch(0.35 0.03 250)           /* Koyu tema kenarlık */
--color-border-focus: var(--color-primary)
```

#### Focus Ring
```css
--color-focus-ring: oklch(0.70 0.25 250)       /* Daha parlak focus ring */
--focus-ring-width: 3px
--focus-ring-offset: 2px
```

### 1.3 Styleguide Aliases (CSS Custom Properties)

Bu alias'lar, bileşen kütüphaneleri ve utility class'lar için kullanılır:

#### Light Tema Aliases
```css
--bg: var(--color-bg-primary, #ffffff)
--fg: var(--color-text-primary, #0b1220)
--muted: var(--color-bg-secondary, #f5f7fa)
--muted-foreground: var(--color-text-secondary, #5b6676)
--card: var(--color-bg-tertiary, #ffffff)
--card-foreground: var(--color-text-primary, #0b1220)
--border: var(--color-border, #e6e9ef)
--primary: var(--color-primary, #002b5b)
--primary-foreground: var(--color-on-primary, #ffffff)
--primary-hover: var(--color-primary-hover, color-mix(in oklch, var(--primary) 85%, black))
--primary-active: var(--color-primary-active, color-mix(in oklch, var(--primary) 70%, black))
--accent: var(--color-accent, #00b7c2)
--accent-foreground: var(--color-on-accent, #002b5b)
--accent-solid: var(--color-accent-solid, color-mix(in oklch, var(--accent) 75%, black))
--accent-solid-foreground: var(--color-on-accent-solid, #ffffff)
--ring: var(--color-focus-ring, color-mix(in oklch, var(--accent) 65%, white))
--success: var(--color-success, #16a34a)
--warning: var(--color-warning, #d97706)
--danger: var(--color-danger, #dc2626)
```

#### Dark Tema Aliases
```css
--bg: var(--color-bg-primary, #0b1220)
--fg: var(--color-text-primary, #e6e9ef)
--muted: var(--color-bg-secondary, #0f1625)
--muted-foreground: var(--color-text-secondary, #b6beca)
--card: var(--color-bg-tertiary, #0f1625)
--card-foreground: var(--color-text-primary, #e6e9ef)
--border: var(--color-border, #233048)
--primary: var(--color-primary, #3a79b4)
--primary-foreground: var(--color-on-primary, #ffffff)
--primary-hover: var(--color-primary-hover, color-mix(in oklch, var(--primary) 85%, white))
--primary-active: var(--color-primary-active, color-mix(in oklch, var(--primary) 70%, white))
--accent: var(--color-accent, #00b7c2)
--accent-foreground: var(--color-on-accent, #0b1220)
--accent-solid: var(--color-accent-solid, color-mix(in oklch, var(--accent) 75%, black))
--accent-solid-foreground: var(--color-on-accent-solid, #ffffff)
--ring: var(--color-focus-ring, color-mix(in oklch, var(--accent) 70%, white))
```

### 1.4 Tema Kullanımı

Tema değiştirmek için `data-theme` attribute'u kullanılır:
- `data-theme="light"` - Açık tema
- `data-theme="dark"` - Koyu tema
- Varsayılan: Light tema

---

## 2. TİPOGRAFİ

### 2.1 Font Ailesi

```css
font-family: var(--font-inter), sans-serif
```

**Açıklama:**
- Ana font: Inter
- Fallback: Sistem sans-serif fontları
- Tailwind config'de: `fontFamily.sans` olarak tanımlı

### 2.2 Font Boyutları

#### Mobil (Base)
```css
p, li {
  font-size: 16px;
  line-height: 1.6;
}
```

#### Tablet/Desktop (768px+)
```css
p, li {
  font-size: 17px;
  line-height: 1.7;
}
```

### 2.3 Font Özellikleri

#### Global Ayarlar
```css
font-size: 16px;
line-height: 1.6;
letter-spacing: 0.2px;
font-feature-settings: "cv11", "cv05";
```

#### Button ve Link Özellikleri
```css
button, a {
  font-weight: 600;
  letter-spacing: 0.5px;
}
```

### 2.4 Font Weight Değerleri

- **Normal**: 400 (varsayılan)
- **Medium**: 500
- **Semibold**: 600 (button ve linkler için)
- **Bold**: 700 (başlıklar için)

### 2.5 Letter Spacing Kuralları

- **Normal metin**: 0.2px
- **Button/Link**: 0.5px
- **Büyük başlıklar (H1)**: -0.01em (daha derli toplu)
- **Büyük harf metinler**: 0.02-0.04em

---

## 3. SPACING SİSTEMİ

### 3.1 Standart Spacing Değerleri

Tailwind CSS'in varsayılan spacing ölçeği kullanılır:
- `0` = 0px
- `0.5` = 2px
- `1` = 4px
- `1.5` = 6px
- `2` = 8px
- `2.5` = 10px
- `3` = 12px
- `4` = 16px
- `5` = 20px
- `6` = 24px
- `8` = 32px
- `10` = 40px
- `12` = 48px
- `16` = 64px
- `20` = 80px
- `24` = 96px

### 3.2 Padding Değerleri

#### Button Padding
```css
padding: 0.75rem 1.5rem;  /* 12px 24px */
```

#### Kart Padding
```css
padding: 2rem;  /* 32px */
```

#### Mobil Padding
```css
padding: 1rem;  /* 16px */
```

#### Responsive Padding
```css
px-4 py-6        /* Mobil: 16px yatay, 24px dikey */
sm:px-6 lg:px-8  /* Tablet: 24px yatay, Desktop: 32px yatay */
```

### 3.3 Margin Değerleri

#### Sayfa İçi Bölümler
```css
margin-bottom: 3rem;  /* 48px */
margin: 0 auto;       /* Ortalama */
```

### 3.4 Gap Değerleri

#### Flexbox/Grid Gap
- `gap-1` = 4px
- `gap-2` = 8px
- `gap-3` = 12px
- `gap-4` = 16px (en yaygın)
- `gap-6` = 24px
- `gap-8` = 32px

**Kullanım Örnekleri:**
```html
<div className="flex gap-4">
<div className="grid grid-cols-2 gap-4">
```

---

## 4. BORDER & RADIUS

### 4.1 Border Radius Değerleri

```css
border-radius: 4px;   /* Küçük öğeler, focus ring */
border-radius: 8px;   /* Button'lar, kartlar (standart) */
border-radius: 12px;  /* Büyük kartlar, modal'lar */
border-radius: 16px; /* Çok büyük kartlar */
border-radius: 24px; /* Tam yuvarlak (rounded-2xl) */
```

**Tailwind Sınıfları:**
- `rounded` = 4px
- `rounded-lg` = 8px
- `rounded-xl` = 12px
- `rounded-2xl` = 16px
- `rounded-full` = 9999px (tam yuvarlak)

### 4.2 Border Renkleri

#### Light Tema
```css
--color-border: oklch(0.85 0.02 250)  /* Standart kenarlık */
--color-border-focus: var(--color-primary)  /* Odaklanma kenarlığı */
```

#### Dark Tema
```css
--color-border: oklch(0.35 0.03 250)  /* Koyu tema kenarlık */
--color-border-focus: var(--color-primary)
```

### 4.3 Border Genişlikleri

```css
border: 1px solid var(--color-border);      /* İnce kenarlık */
border: 2px solid var(--color-border);      /* Orta kenarlık */
border: 3px solid var(--color-focus-ring);  /* Focus ring */
```

**Tailwind Sınıfları:**
- `border` = 1px
- `border-2` = 2px
- `border-4` = 4px

---

## 5. FOCUS & ACCESSIBILITY

### 5.1 Focus Ring Sistemi

```css
*:focus-visible {
  outline: var(--focus-ring-width) solid var(--color-focus-ring);
  outline-offset: var(--focus-ring-offset);
  border-radius: 4px;
}
```

**Değerler:**
- `--focus-ring-width: 3px`
- `--focus-ring-offset: 2px`
- `--color-focus-ring`: Light tema için `oklch(0.55 0.25 250)`, Dark tema için `oklch(0.70 0.25 250)`

### 5.2 Erişilebilirlik Kuralları

- Tüm interaktif öğeler `focus-visible` ile erişilebilir olmalı
- Focus ring her zaman görünür olmalı (klavye navigasyonu için)
- Renk kontrast oranları WCAG AA standartlarına uygun olmalı

---

## 6. BUTTON STİLLERİ

### 6.1 Primary Button

```css
.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-text-inverse);
  border: none;
  padding: 0.75rem 1.5rem;  /* 12px 24px */
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
}

.btn-primary:active {
  background-color: var(--color-primary-active);
}
```

**Kullanım:**
```html
<button className="btn-primary">Buton Metni</button>
```

### 6.2 Accent Button

```css
.btn-accent {
  background-color: var(--color-accent);
  color: var(--color-text-primary);
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-accent:hover {
  background-color: var(--color-accent-hover);
}

.btn-accent:active {
  background-color: var(--color-accent-active);
}
```

**Kullanım:**
```html
<button className="btn-accent">Buton Metni</button>
```

### 6.3 Button Durumları

- **Normal**: Varsayılan renk
- **Hover**: Daha açık/koyu ton (color-mix ile %20 karışım)
- **Active**: Daha belirgin değişim (color-mix ile %20 karışım)
- **Transition**: 0.2s ease

---

## 7. UTILITY CLASSES

### 7.1 Layout Utility Classes

#### Page Shell (Ortalanmış Ana Kolon)
```css
.page-shell {
  width: 100%;
  max-width: 896px;  /* 4xl eşdeğeri */
  margin-left: auto;
  margin-right: auto;
}
```

**Kullanım:**
```html
<div className="page-shell">İçerik</div>
```

### 7.2 Özel Utility Classes

#### Neon Glow Efekti
```css
.neon-glow {
  text-shadow:
    0 0 10px #ff00ff,
    0 0 20px #ff00ff,
    0 0 40px #ff00ff,
    0 0 80px #ff00ff;
}
```

### 7.3 YATTA Contact Sayfası Stilleri

```css
.yatta-contact {
  font-family: "Inter", sans-serif;
  text-align: center;
  color: #222;
  background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%);
  min-height: 100vh;
  padding: 2rem 1rem;
}
```

---

## 8. RESPONSIVE BREAKPOINTS

### 8.1 Tailwind CSS Breakpoint'leri

```javascript
// Tailwind varsayılan breakpoint'ler
sm: '640px'   // Küçük ekranlar (tablet)
md: '768px'   // Orta ekranlar (tablet yatay)
lg: '1024px'  // Büyük ekranlar (desktop)
xl: '1280px'  // Çok büyük ekranlar
2xl: '1536px' // Ultra geniş ekranlar
```

### 8.2 Kullanım Örnekleri

```html
<!-- Responsive padding -->
<div className="px-4 sm:px-6 lg:px-8">

<!-- Responsive grid -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

<!-- Responsive font size -->
<p className="text-base md:text-lg lg:text-xl">

<!-- Responsive display -->
<div className="hidden md:flex">
```

### 8.3 Media Query Örnekleri

```css
/* Mobil base */
@media (min-width: 768px) {
  p, li {
    font-size: 17px;
    line-height: 1.7;
  }
}

/* Mobil için özel stiller */
@media (max-width: 768px) {
  .yatta-contact .hero h1 {
    font-size: 2rem;
  }
}
```

---

## 9. LAYOUT KURALLARI

### 9.1 Container Genişlikleri

```css
max-width: 896px;   /* Page shell için (4xl) */
max-width: 1280px;  /* Geniş container (#root) */
```

### 9.2 Header Yüksekliği

```css
h-14 lg:h-16  /* 56px mobil, 64px desktop */
```

### 9.3 Z-Index Katmanları

- `z-40`: Sticky header
- `z-50`: Logo ve önemli öğeler
- `z-100`: Fixed bottom navigation

### 9.4 Background Colors

#### Global Body Background
```css
background-color: rgb(248 250 252);  /* Slate-50 */
```

#### Card Backgrounds
- Primary: `var(--color-bg-primary)`
- Secondary: `var(--color-bg-secondary)`
- Tertiary: `var(--color-bg-tertiary)`

---

## 10. TAILWIND CONFIG

### 10.1 Font Family Ayarları

```javascript
theme: {
  extend: {
    fontFamily: {
      sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
    },
  },
}
```

### 10.2 Content Paths

```javascript
content: [
  "./app/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
  "./pages/**/*.{js,jsx,ts,tsx}",
]
```

---

## 11. KULLANIM ÖRNEKLERİ

### 11.1 Renk Kullanımı

```html
<!-- CSS Variable ile -->
<div style={{ backgroundColor: 'var(--color-primary)' }}>

<!-- Tailwind utility ile (eğer config'de tanımlıysa) -->
<div className="bg-primary text-primary-foreground">
```

### 11.2 Button Kullanımı

```html
<!-- Primary button -->
<button className="btn-primary">Kaydet</button>

<!-- Accent button -->
<button className="btn-accent">İptal</button>
```

### 11.3 Responsive Layout

```html
<div className="page-shell">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <!-- İçerik -->
  </div>
</div>
```

### 11.4 Typography

```html
<h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">
  Başlık
</h1>
<p className="text-base md:text-lg">
  Paragraf metni
</p>
```

---

## 12. ÖNEMLİ NOTLAR

1. **OKLCH Renk Sistemi**: Proje OKLCH renk uzayını kullanır. Bu, daha tutarlı renk geçişleri ve erişilebilirlik sağlar.

2. **Tema Değiştirme**: Tema değiştirmek için `data-theme` attribute'u kullanılır. Varsayılan light temadır.

3. **CSS Variables**: Tüm renkler CSS custom properties olarak tanımlıdır. Bu sayede runtime'da tema değiştirilebilir.

4. **Accessibility**: Focus ring ve renk kontrastları WCAG standartlarına uygun olmalıdır.

5. **Responsive Design**: Mobil-first yaklaşım kullanılır. Önce mobil stiller, sonra `sm:`, `md:`, `lg:` prefix'leri ile daha büyük ekranlar için stiller eklenir.

6. **Font Loading**: Inter font'u `var(--font-inter)` ile yüklenir. Fallback olarak sistem sans-serif fontları kullanılır.

---

## 13. RENK DÖNÜŞÜM TABLOSU (Yaklaşık)

### Light Tema
- Primary: `oklch(0.45 0.20 250)` ≈ `#002b5b` (koyu mavi)
- Accent: `oklch(0.70 0.15 240)` ≈ `#00b7c2` (açık turkuaz)
- BG Primary: `oklch(0.98 0.005 250)` ≈ `#fafbfc` (neredeyse beyaz)
- Text Primary: `oklch(0.20 0.02 250)` ≈ `#0b1220` (çok koyu)

### Dark Tema
- Primary: `oklch(0.65 0.20 250)` ≈ `#3a79b4` (açık mavi)
- Accent: `oklch(0.50 0.15 240)` ≈ `#4a9bc4` (orta turkuaz)
- BG Primary: `oklch(0.15 0.02 250)` ≈ `#0b1220` (çok koyu)
- Text Primary: `oklch(0.95 0.005 250)` ≈ `#e6e9ef` (açık)

**Not**: Bu dönüşümler yaklaşık değerlerdir. Tam renk eşleşmesi için OKLCH değerleri kullanılmalıdır.

---

## 14. GEMINI AI İÇİN KULLANIM TALİMATLARI

Bu tasarım sistemi kullanılırken:

1. **Renkler**: Her zaman CSS custom properties (`var(--color-*)`) kullanın. Doğrudan hex/rgb değerleri kullanmayın.

2. **Tema Desteği**: Light ve dark tema için farklı değerler tanımlıdır. `data-theme` attribute'una göre doğru değerleri kullanın.

3. **Spacing**: Tailwind'in spacing ölçeğini kullanın (`p-4`, `m-6`, `gap-4` gibi).

4. **Typography**: Inter font ailesini kullanın. Font boyutları responsive olmalıdır.

5. **Buttons**: `.btn-primary` veya `.btn-accent` class'larını kullanın. Custom button stilleri oluştururken bu pattern'i takip edin.

6. **Accessibility**: Her zaman focus ring ve yeterli renk kontrastı sağlayın.

7. **Responsive**: Mobil-first yaklaşımı kullanın. Breakpoint'ler: `sm:640px`, `md:768px`, `lg:1024px`.

---

**Son Güncelleme**: Bu dosya projenin mevcut tasarım sistemini yansıtmaktadır. Değişiklikler yapıldığında bu dosya güncellenmelidir.

