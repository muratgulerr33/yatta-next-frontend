# 01-OPERASYON

## Amaç
CI/CD (webhook), Nginx proxy, Go‑Live doğrulama, CSS/static fix ve sağlık kontrollerini **tek dosyada** toplayarak operasyonu kolaylaştırmak.

> **Sürümler:** Node 20 · Next.js 15 (React 19) · Python 3.12 · Django 5.2.7 · Nginx · Let's Encrypt  
> **Tema:** **V1 = Light only (kilitli)** · **V1.1 = Dark (backlog)**  
> **Servisler:** `yatta-next` (3000) · `yatta-backend` (8000)  
> **Domain → Proxy:** `yatta.com.tr → 127.0.0.1:3000` · `api.yatta.com.tr → 127.0.0.1:8000`

---

## CI/CD (Webhook — Üretim Hattı)

**Amaç →** GitHub push sonrası otomatik build ve servis restart.  

**İşlem/Komut →**
```bash
# 1) Frontend dizinine geç
cd /home/yatta/apps/frontend

# 2) Değişiklikleri çek
git pull origin main

# 3) Üretim build (Next.js 15)
npm ci && npm run build

# 4) SSR servisini yeniden başlat
sudo systemctl restart yatta-next
```

**Beklenen Çıktı →** Build hatasız biter, `yatta-next` yeniden başlar.  

**Test →** `journalctl -u yatta-next -n 50 --no-pager`  

**Hata & Çözüm →** Node sürümü/permission hataları için `node -v`, `whoami` ve servis loglarını kontrol et.

> **Not:** Standalone kopyalama adımı **yok**. Üretimde standart build + `npm run start` hattı kullanılır.

---

## Nginx Proxy (yatta.com.tr / api.yatta.com.tr)

**Amaç →** Trafiği uygulama portlarına yönlendirmek, HTTPS ve HSTS sağlamak.  

**Özet →**
- `yatta.com.tr` → `127.0.0.1:3000` (Next SSR)  
- `api.yatta.com.tr` → `127.0.0.1:8000` (Django/Gunicorn)  
- HTTP→HTTPS 301, HSTS açık, proxy başlıkları (`X-Forwarded-*`) set.

**Test →**
```bash
# Nginx testi ve reload
sudo nginx -t && sudo systemctl reload nginx

# Ana sayfa başlıklarını kontrol
curl -I https://yatta.com.tr/
```

---

## Go‑Live / Doğrulama (HTTP · SEO)

**Amaç →** Yayın sonrası temel doğrulamaları hızlıca yapmak.  

**Komutlar →**
```bash
# robots ve sitemap
curl -I https://yatta.com.tr/robots.txt
curl -I https://yatta.com.tr/sitemap.xml

# Canonical link'i sayfa içinde kontrol (örnek sayfa)
curl -s https://yatta.com.tr/yakindayiz | grep -i '<link rel="canonical"' | head -1
```

**Beklenen →** 200 OK, canonical etiketi tekil, içerikler erişilebilir.

---

## CSS / Static Fix (V1 Light)

**Amaç →** CSS/asset 404-307 hatalarını teşhis ve doğrulama.  

**Komutlar →**
```bash
# /yakindayiz sayfasındaki ilk CSS dosyasını bul ve başlıklarını kontrol et
CSS_URL=$(curl -s https://yatta.com.tr/yakindayiz | grep -oE '/_next/static/[^"']+\.css' | head -1)
echo "$CSS_URL"
[ -n "$CSS_URL" ] && curl -I -L "https://yatta.com.tr$CSS_URL" | sed -n '1,12p'
```

**Beklenen →** 200 OK (veya 304 Not Modified), gereksiz yönlendirme yok.  

**Hata & Çözüm →** 404 ise deploy sonrası `.next/static` dosyalarının bulunduğunu doğrula; Nginx cache/purge gerekebilir.

---

## Sağlık Kontrolleri (Hızlı)

**Amaç →** Servis ve API sağlığını ölçmek.  

**Komutlar →**
```bash
# Servis durumları
sudo systemctl status yatta-next yatta-backend
journalctl -u yatta-next -n 50 --no-pager
journalctl -u yatta-backend -n 50 --no-pager

# API sağlık ucu
curl -s https://api.yatta.com.tr/health/ping
```

**Beklenen →** `{ "status": "healthy" }`.

---

## EK: URL Yapımız (Kasım 2025)

**Özet →** URL mimarisi ve yönlendirmeler (appendix).  

**Kaynak →** `URL-Yapimiz-(Kasim-2025).md` (kısa özet + ana proje dokümanına link).

**Temel Kökler (TR — aktif):**
- `/kiralama` — Tekne/yat kiralama listesi
- `/turlar` — Tur listesi
- `/konaklama` — Konaklama listesi
- `/organizasyon/*` — Organizasyon kategorisi
- `/satilik-tekneler/*` — Satılık yat/tekne ilanları (seller grubundaki üyeler yönetir)
- `/yakindayiz` — Ana sayfa (canonical, priority 1.0)

**Detay Deseni:** `/{kök}/{slug}-{id}` (örn: `/kiralama/lorhan-yat-luks-1-saatlik-101`)

**Normalizasyon:** Trailing slash yok, lowercase, ASCII, tracking params temizlenir (301 redirect).

---

### Checklist (Hızlı)
- [ ] GitHub push → webhook çalıştı (logda görüldü)
- [ ] `yatta-next` restart sonrası hata yok
- [ ] `robots.txt` / `sitemap.xml` → 200 OK
- [ ] İlk CSS dosyası → 200 OK
- [ ] API `/health/ping` → healthy
