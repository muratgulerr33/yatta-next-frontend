# 02-KURULUM

## Amaç
İlk kurulum, **local prod build/test** ve hızlı doğrulama adımlarını tek yerde toplamak.

> **Sürümler:** Node 20 · Next.js 15 (React 19) · Python 3.12 · Django 5.2.7  
> **Tema:** **V1 = Light only (kilitli)** · Dark = V1.1 (backlog)  
> **Servis (prod sunucu):** `yatta-next.service` (lokalde systemd yok)

---

## 1) Kurulum (Local)

**Amaç →** Bağımlılıkları kur ve prod build al.  

**İşlem/Komut →**
```bash
# Proje köküne geç (frontend)
cd /home/yatta/apps/frontend   # kendi dizinine göre güncelle

# Bağımlılıkları temiz kur (npm ci: package-lock'a sadık)
npm ci

# Prod build (SSR için)
npm run build
```

**Beklenen Çıktı →** Next.js build hatasız tamamlanır (`.next/` oluşur).  

**Test →** Build sonunda "Compiled successfully" benzeri mesaj.  

**Hata & Çözüm →** Node sürümü değilse `node -v` kontrol et (Node 20), eksik izinlerde terminali yeniden başlat.

---

## 2) Local Prod Başlat (Test)

**Amaç →** Üretime yakın ortamda SSR'ı lokalde test etmek.  

**İşlem/Komut →**
```bash
# SSR başlat (3000 portunda)
npm run start -- -p 3000
```

**Beklenen Çıktı →** Sunucu `http://localhost:3000` adresinde dinler.  

**Test →** Tarayıcıdan `http://localhost:3000/yakindayiz` açılır.  

**Hata & Çözüm →** Port meşgulse başka süreç kapat (`lsof -i :3000`), ya da `-p 3001` kullan.

---

## 3) Hızlı Doğrulama (Local)

**Amaç →** CSS ve sayfa çıktısını kısa tur test etmek.  

**Komutlar →**
```bash
# Ana sayfa başlıkları
curl -I http://localhost:3000/

# /yakindayiz sayfasından ilk CSS'i yakala ve kontrol et
CSS_URL=$(curl -s http://localhost:3000/yakindayiz | grep -oE '/_next/static/[^"']+\.css' | head -1)
echo "$CSS_URL" && curl -I -L "http://localhost:3000$CSS_URL" | sed -n '1,12p'
```

**Beklenen →** 200 OK.  

**Hata & Çözüm →** 404 ise build eksik/başarısız; komutları tekrar et.

---

## 4) Notlar (Üretim ile farklar)

- Local'de **systemd** yok; prod'da `yatta-next.service` var.
- Prod'da Nginx `yatta.com.tr → 127.0.0.1:3000` proxy eder (lokalde Nginx şart değil).
- Tema kararımız **Light only**; tasarım doğrulamaları Light'a göre yapılır.

---

## 5) Kısa Checklist

- [ ] `npm ci` tamam
- [ ] `npm run build` hatasız
- [ ] `npm run start -p 3000` ile açıldı
- [ ] `/yakindayiz` görüntülendi
- [ ] CSS dosyası **200 OK**

---

## 6) Sık Yapılan Hatalar

- **Node 18/22** ile build hatası → **Node 20** kullan.  
- `ERR_PORT_IN_USE` → Portu kapat veya `-p` ile değiştir.  
- Build sonrası boş sayfa → Terminal loguna bak; ortam değişkenleri `.env` dosyanla uyumlu mu kontrol et.
- **Tailwind build hatası** → PostCSS config doğru mu kontrol et (detay: `8-frontend-tailwind-postcss-v4-v1.md`)

---

## 7) Tailwind CSS v4 Notları

⚠️ **Önemli:** Proje **Tailwind CSS v4.1.16** kullanıyor. v3'ten farklı syntax gerektirir:

### PostCSS Config
```js
// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // ✅ v4 için
    // ❌ 'tailwindcss': {}  (v3 syntax - kullanma!)
  },
};
```

### globals.css
```css
@import "tailwindcss";  /* ✅ v4 için */

/* ❌ KULLANMA (v3 syntax):
@tailwind base;
@tailwind components;
@tailwind utilities;
*/
```

📖 **Detaylı bilgi:** `docs/8-frontend-tailwind-postcss-v4-v1.md`

