# Tailwind CSS v4 & PostCSS Konfigürasyonu

> **Güncelleme tarihi:** 21 Kasım 2024  
> **Kapsam:** Tailwind CSS v4 kurulumu, PostCSS yapılandırması, globals.css syntax, responsive davranış  
> **Sürümler:** Tailwind CSS v4.1.16, @tailwindcss/postcss v4.1.16, Next.js 16.0.1

---

## 1. Tailwind CSS v4 - Önemli Değişiklikler

### 1.1 Versiyon Bilgisi

Projede **Tailwind CSS v4.1.16** kullanılmaktadır. Bu major sürüm değişikliği bazı önemli syntax ve konfigürasyon değişiklikleri getirmiştir.

**package.json:**
```json
{
  "devDependencies": {
    "tailwindcss": "^4.1.16",
    "@tailwindcss/postcss": "^4.1.16",
    "postcss": "^8.5.6",
    "postcss-import": "^16.1.1",
    "autoprefixer": "^10.4.21"
  }
}
```

### 1.2 v3 → v4 Temel Farklar

| Özellik | Tailwind v3 | Tailwind v4 |
|---------|-------------|-------------|
| **CSS Import** | `@tailwind base;`<br>`@tailwind components;`<br>`@tailwind utilities;` | `@import "tailwindcss";` |
| **PostCSS Plugin** | `'tailwindcss': {}` | `'@tailwindcss/postcss': {}` |
| **Config Dosyası** | Zorunlu | Opsiyonel (extend için) |

---

## 2. PostCSS Konfigürasyonu

### 2.1 Doğru Yapılandırma

**Dosya:** `postcss.config.cjs`

```js
// CommonJS format - Next.js + Tailwind v4 uyumlu

module.exports = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/postcss': {},  // ← Tailwind v4 için kritik!
    'autoprefixer': {},
  },
};
```

### 2.2 Yaygın Hatalar

#### ❌ YANLIŞ (Tailwind v3 syntax):
```js
module.exports = {
  plugins: {
    'tailwindcss': {},  // ← v3 için, v4'te çalışmaz!
  },
};
```

**Hata mesajı:**
```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin. 
The PostCSS plugin has moved to a separate package...
```

#### ✅ DOĞRU (Tailwind v4 syntax):
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ← v4 için
  },
};
```

---

## 3. globals.css Konfigürasyonu

### 3.1 Tailwind v4 Import Syntax

**Dosya:** `app/globals.css`

#### ✅ DOĞRU (Tailwind v4):
```css
@import "tailwindcss";

@layer base {
  html,
  body {
    margin: 0;
    padding: 0;
  }
  
  body {
    font-family: var(--font-sans);
  }
}

/* Diğer custom CSS'ler */
```

#### ❌ YANLIŞ (Tailwind v3 - v4'te çalışmaz):
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Bu syntax v3 içindir */
```

### 3.2 @layer Kullanımı

Tailwind v4'te `@layer` kullanımı aynen devam ediyor:

```css
@import "tailwindcss";

@layer base {
  /* Base HTML elementleri için global stiller */
  body {
    @apply font-sans antialiased;
  }
}

@layer components {
  /* Özel component class'ları */
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded;
  }
}

@layer utilities {
  /* Özel utility class'ları */
  .text-balance {
    text-wrap: balance;
  }
}
```

---

## 4. Tailwind Config Dosyası

### 4.1 Minimal Konfigürasyon

**Dosya:** `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
}
```

### 4.2 Content Paths

Tailwind v4'te content paths **kritik öneme** sahiptir. Tüm component dosyalarınızın yollarını eklemelisiniz:

```js
content: [
  "./app/**/*.{js,jsx,ts,tsx}",      // Next.js app directory
  "./components/**/*.{js,jsx,ts,tsx}", // Component'ler
  "./pages/**/*.{js,jsx,ts,tsx}",     // Pages (varsa)
]
```

---

## 5. Responsive Breakpoint'ler

### 5.1 Tailwind Varsayılan Breakpoint'leri

Projede Tailwind'in varsayılan breakpoint'leri kullanılmaktadır:

| Prefix | Min Width | Açıklama |
|--------|-----------|----------|
| `sm:` | 640px | Küçük tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Büyük ekran |
| `2xl:` | 1536px | Çok büyük ekran |

### 5.2 Kullanım Örnekleri

```jsx
// Mobilde tek kolon, desktop'ta 3 kolon
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

// Mobilde gizli, desktop'ta görünür
<div className="hidden lg:flex">

// Mobilde dikey, desktop'ta yatay
<div className="flex flex-col sm:flex-row">
```

### 5.3 Footer Grid Örneği

```jsx
// Footer - Responsive 3 Kolon Layout
<footer className="border-t bg-slate-50">
  <div className="max-w-[896px] mx-auto px-[11px] py-10">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
      <section>...</section>
      <section>...</section>
      <section>...</section>
    </div>
  </div>
</footer>
```

**Davranış:**
- **< 768px (mobil):** `grid-cols-1` → Alt alta 1 kolon
- **≥ 768px (desktop):** `md:grid-cols-3` → Yan yana 3 kolon

---

## 6. Build ve Development

### 6.1 Development Mode

```bash
npm run dev
```

Tailwind, development modunda:
- ✅ JIT (Just-In-Time) mode ile sadece kullanılan class'ları compile eder
- ✅ Hot reload çalışır
- ✅ Tüm responsive class'lar aktiftir

### 6.2 Production Build

```bash
npm run build
```

Production build'de:
- ✅ CSS minify edilir
- ✅ Kullanılmayan class'lar temizlenir (PurgeCSS)
- ✅ Autoprefixer browser desteği ekler

### 6.3 Build Hatası Çözümü

**Hata:** `tailwindcss` directly as a PostCSS plugin

**Çözüm:**
1. `postcss.config.cjs` dosyasını kontrol et
2. `'tailwindcss'` yerine `'@tailwindcss/postcss'` kullan
3. Dev server'ı yeniden başlat: `npm run dev`
4. Hard refresh: `Cmd/Ctrl + Shift + R`

---

## 7. Özel Utility Class'lar

### 7.1 Arbitrary Values (Custom Değerler)

Tailwind v4'te arbitrary values desteklenir:

```jsx
// Custom padding
<div className="px-[11px]">

// Custom max-width
<div className="max-w-[896px]">

// Custom color
<div className="bg-[#004aad]">
```

### 7.2 Opacity Utilities

```jsx
// Text opacity
<p className="text-white/80">  // 80% opacity

// Background opacity
<div className="bg-slate-900/50">  // 50% opacity
```

---

## 8. Common Issues & Troubleshooting

### 8.1 Responsive Class'lar Çalışmıyor

**Problem:** `md:grid-cols-3` gibi responsive class'lar çalışmıyor, hep tek kolon görünüyor.

**Computed CSS'te görünen:**
```css
grid-template-columns: repeat(1, minmax(0, 1fr));  /* Hep 1 kolon */
```

**Çözüm:**
1. `globals.css` dosyasında `@import "tailwindcss";` kullanıldığından emin ol
2. `postcss.config.cjs` dosyasında `@tailwindcss/postcss` kullanıldığından emin ol
3. Dev server'ı yeniden başlat
4. Tarayıcıda hard refresh yap

### 8.2 Yatay Scroll Sorunu

**Problem:** Footer veya container'da yatay scroll çıkıyor.

**Neden:** `width: 100%` + padding kombinasyonu.

**Yanlış:**
```jsx
<div className="page-shell px-[11px]">  // width: 100% + padding = taşma!
```

**Doğru:**
```jsx
<div className="max-w-[896px] mx-auto px-[11px]">  // max-width ile sınırlı
```

### 8.3 Build Hatası - Plugin Bulunamadı

**Hata:** `Cannot find module '@tailwindcss/postcss'`

**Çözüm:**
```bash
npm install @tailwindcss/postcss --save-dev
```

---

## 9. Best Practices

### 9.1 Container Kullanımı

✅ **Önerilen:**
```jsx
<div className="max-w-[896px] mx-auto px-[11px]">
  {/* İçerik */}
</div>
```

❌ **Öneri değil:**
```jsx
<div className="page-shell px-[11px]">
  {/* width: 100% + padding = taşma riski */}
</div>
```

### 9.2 Responsive Design

✅ **Mobile-first yaklaşım:**
```jsx
// Önce mobil (base), sonra büyük ekranlar
<div className="text-sm md:text-base lg:text-lg">
```

### 9.3 @layer Kullanımı

✅ **Global stiller için @layer base:**
```css
@layer base {
  body {
    @apply font-sans antialiased;
  }
}
```

❌ **Global selector'ü direkt kullanma:**
```css
/* Tailwind utility'lerini override edebilir */
body {
  color: #000;  /* Tailwind'i ezer */
}
```

---

## 10. Değişiklik Günlüğü

- **21.11.2024:** İlk versiyon oluşturuldu (Tailwind v4.1.16)
- **21.11.2024:** PostCSS config v3→v4 güncellendi
- **21.11.2024:** globals.css syntax v3→v4 güncellendi
- **21.11.2024:** Footer responsive grid fix uygulandı

---

## 11. Referanslar

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [PostCSS Documentation](https://postcss.org/)
- [Next.js Tailwind Integration](https://nextjs.org/docs/app/building-your-application/styling/tailwind-css)

---

**Hazırlayan:** Frontend Team  
**Son Kontrol:** 21.11.2024

