# YATTA Frontend — Next.js 16 + React 19 + Tailwind CSS v4

> **Domain:** [yatta.com.tr](https://yatta.com.tr)  
> **Tech Stack:** Next.js 16.0.1, React 19, Tailwind CSS v4.1.16, TypeScript  
> **Deployment:** Kamatera Cloud (Ubuntu 24.04) via systemd service  

---

## 🚀 Quick Start

### Development Mode
```bash
npm install
npm run dev
```
Server runs at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── (site)/              # Site layout group
│   │   ├── kiralama/        # Kiralama sayfaları
│   │   ├── mesafeli-satis-sozlesmesi/  # Müşteri ilişkileri sayfaları (5 adet)
│   │   ├── odeme-ve-rezervasyon/
│   │   ├── gizlilik-politikasi/
│   │   ├── iptal-iade-kosullari/
│   │   ├── veri-silme-talebi/
│   │   └── layout.jsx       # Site-wide layout
│   ├── layout.jsx           # Root layout
│   └── globals.css          # Global CSS + Tailwind
├── components/
│   └── layout/
│       ├── SiteHeader.tsx   # Header component
│       └── SiteFooter.tsx   # Footer component
├── docs/                    # Dokümantasyon
│   ├── 1-frontend-project-doc-v1.md
│   ├── 7-frontend-ui-layout-v1.md  # UI & Layout (müşteri ilişkileri sayfaları dahil)
│   ├── 8-frontend-tailwind-postcss-v4-v1.md  # ⚡ Tailwind v4 Guide
│   └── ...
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind konfigürasyonu
└── postcss.config.cjs       # PostCSS konfigürasyonu
```

---

## 🎨 Styling - Tailwind CSS v4

### ⚠️ Önemli: Tailwind v4 Syntax Farkları

**globals.css (v4 syntax):**
```css
@import "tailwindcss";  /* ✅ v4 için */

/* ❌ KULLANMA (v3 syntax):
@tailwind base;
@tailwind components;
@tailwind utilities;
*/
```

**postcss.config.cjs (v4 syntax):**
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ✅ v4 için
    // ❌ KULLANMA: 'tailwindcss': {}
  },
};
```

📖 **Detaylı bilgi:** `docs/8-frontend-tailwind-postcss-v4-v1.md`

---

## 📚 Documentation

- **[1-frontend-project-doc-v1.md](docs/1-frontend-project-doc-v1.md)** — Proje mimarisi, CI/CD, deployment
- **[2-frontend-01-operations-v1.md](docs/2-frontend-01-operations-v1.md)** — Operasyonlar ve bakım
- **[3-frontend-02-setup-v1.md](docs/3-frontend-02-setup-v1.md)** — İlk kurulum
- **[7-frontend-ui-layout-v1.md](docs/7-frontend-ui-layout-v1.md)** — UI & Layout yapısı
- **[8-frontend-tailwind-postcss-v4-v1.md](docs/8-frontend-tailwind-postcss-v4-v1.md)** — ⚡ Tailwind v4 Guide

---

## 🛠️ Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | Next.js | 16.0.1 |
| React | React | 19.2.0 |
| Styling | Tailwind CSS | 4.1.16 |
| Language | TypeScript | 5.9.3 |
| PostCSS | @tailwindcss/postcss | 4.1.16 |

---

## 🔧 Common Issues

### Tailwind Responsive Classes Çalışmıyor

**Belirtiler:** `md:grid-cols-3` gibi responsive class'lar çalışmıyor

**Çözüm:**
1. `globals.css` dosyasında `@import "tailwindcss";` kullanıldığından emin ol (v4 syntax)
2. `postcss.config.cjs` dosyasında `@tailwindcss/postcss` kullanıldığından emin ol
3. Dev server'ı yeniden başlat
4. Tarayıcıda hard refresh: `Cmd/Ctrl + Shift + R`

📖 **Detaylı troubleshooting:** `docs/8-frontend-tailwind-postcss-v4-v1.md`

---

## 📝 Scripts

```bash
npm run dev          # Development server (port 3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

---

## 🌐 Production Deployment

Production ortamında `yatta-next.service` systemd servisi ile çalışır:

```bash
# Servis kontrolü
sudo systemctl status yatta-next
sudo systemctl restart yatta-next

# Loglar
journalctl -u yatta-next -n 100 --no-pager
```

**Domain:** https://yatta.com.tr  
**Port:** 3000 (internal)  
**Proxy:** Nginx → 127.0.0.1:3000

---

## 📄 License

Private project - © 2025 Yatta.com.tr

---

## 📋 Müşteri İlişkileri Sayfaları (Yeni - Kasım 2025)

5 adet hukuki/bilgilendirme sayfası eklendi:

| Sayfa | URL | Açıklama |
|-------|-----|----------|
| Mesafeli Satış Sözleşmesi | `/mesafeli-satis-sozlesmesi` | 6502 sayılı kanun uyumlu sözleşme |
| Ödeme ve Rezervasyon | `/odeme-ve-rezervasyon` | Rezervasyon süreci, ödeme yöntemleri |
| Gizlilik Politikası | `/gizlilik-politikasi` | KVKK uyumlu veri koruma politikası |
| İptal ve İade Koşulları | `/iptal-iade-kosullari` | İptal, erteleme ve iade süreçleri |
| Veri Silme Talebi | `/veri-silme-talebi` | KVKK veri silme hakkı kullanımı |

**Özellikler:**
- SEO optimize (canonical URL, OpenGraph, unique metadata)
- Root level URL yapısı (SEO best practice)
- `/kiralama` sayfası ile aynı layout ve stil standardı
- Footer'dan erişilebilir
- Internal linking (gizlilik ↔ veri silme, mesafeli satış ↔ iptal/iade)

---

**Son Güncelleme:** 21 Kasım 2025
