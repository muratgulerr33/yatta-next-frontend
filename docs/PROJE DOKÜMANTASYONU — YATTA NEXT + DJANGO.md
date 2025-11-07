# PROJE DOKÜMANTASYONU — YATTA NEXT + DJANGO (TÜMLEŞİK, GÜNCEL)

> **Güncelleme tarihi:** 07 Kasım 2025 (UTC+3)  
> **Kapsam:** Üretim mimarisi, komutlar, servisler, CI/CD, güvenlik, tema kararı ve kısa yol haritası.  
> **Sürümler:** **Node 20**, **Python 3.12**, **Django 5.2.7**, **Next.js 15 (React 19)**, **Nginx**, **Let’s Encrypt**.

---

## 1) Mimari Özeti (Üretim)
- **Sunucu:** Kamatera Cloud — Ubuntu 24.04 — IP: **185.247.118.58**
- **Frontend (SSR):** Next.js 15 — **Domain:** `yatta.com.tr` → **127.0.0.1:3000`** — **Servis:** `yatta-next.service`
- **Backend (API):** Django 5.2.7 (Gunicorn) — **Domain:** `api.yatta.com.tr` → **127.0.0.1:8000`** — **Servis:** `yatta-backend.service`
- **SSL:** Let’s Encrypt (otomatik yenileme)  
- **CI/CD:** GitHub push → Flask Webhook → `webhook.sh` → `git pull` → `npm ci` → `npm run build` → `systemctl restart yatta-next`
- **Dizinler:**
  - Frontend: `/home/yatta/apps/frontend`
  - Backend: `/home/yatta/apps/backend`

---

## 2) Tema Kararı (V1)
- **V1:** **Sadece Light** (karar **kilitli**).  
- **V1.1:** **Dark** tema **backlog**’da.  
- **Gerekçe kısa:** Test yükü ↓, okunabilirlik ↑, CSS kapsamı ↓, CI/CD hızlanır.

> **Not:** Tüm tasarım/renk doğrulamalarında şimdilik **Light** dikkate alınacaktır.

---

## 3) Frontend — Next.js 15 (SSR)
**Build (CI/CD ve lokal prod test):**
```bash
# Amaç: Üretim build'i
cd /home/yatta/apps/frontend
npm ci && npm run build                 # build
npm run start -- -p 3000                # lokal prod başlat (test için)
```
**Servis (systemd):**
```bash
# Amaç: Üretim servis yönetimi
sudo systemctl status yatta-next
sudo systemctl restart yatta-next
journalctl -u yatta-next -n 100 --no-pager
```
**Nginx:** `yatta.com.tr` → `127.0.0.1:3000` (proxy).  
**SEO & Middleware:** `robots.txt`, `sitemap.xml`, **canonical** link, güvenlik başlıkları aktiftir.  
**Sağlık kontrolü (hızlı):**
```bash
curl -I https://yatta.com.tr/
CSS_URL=$(curl -s https://yatta.com.tr/yakindayiz | grep -oE '/_next/static/[^\"]+\.css' | head -1)
echo $CSS_URL && curl -I -L https://yatta.com.tr$CSS_URL | sed -n '1,8p'
```

> **Not (build standardı):** Üretimde **standart build + `npm run start`** kullanılır. Ek kopyalama adımlarına gerek yoktur.

---

## 4) Backend — Django 5.2.7 (Gunicorn)
**Temel komutlar:**
```bash
cd /home/yatta/apps/backend
source .venv/bin/activate
python manage.py migrate && python manage.py collectstatic --noinput
```
**Servis (systemd):**
```bash
sudo systemctl status yatta-backend
sudo systemctl restart yatta-backend
journalctl -u yatta-backend -n 100 --no-pager
```
**Sağlık ucu:**
```bash
curl -s https://api.yatta.com.tr/health/ping
# Beklenen: {"status":"healthy"}
```
**CORS/JWT Notu:** V1’de **JWT + HttpOnly cookie** hedeflenmektedir (aşağıda Yol Haritası).

---

## 5) CI/CD — Webhook Akışı
**Akış:** GitHub push → Flask Webhook → `/home/yatta/apps/frontend/webhook.sh`  
**Örnek `webhook.sh` (özet):**
```bash
#!/bin/bash
cd /home/yatta/apps/frontend

echo "=== GÜNCELLEME BAŞLADI ==="
git pull origin main

echo "=== BUILD BAŞLADI ==="
npm ci && npm run build

echo "=== SERVİS YENİDEN BAŞLATILIYOR ==="
sudo systemctl restart yatta-next

echo "=== TAMAM ==="
```
> **Not:** Dosya yürütülebilir olmalı: `chmod +x /home/yatta/apps/frontend/webhook.sh`

---

## 6) Güvenlik & SEO
- **SSL:** Let’s Encrypt (otomatik yenileme).  
- **Güvenlik başlıkları:** `Strict-Transport-Security`, `X-Frame-Options`, `Referrer-Policy`, `X-XSS-Protection` aktiftir.  
- **SEO:** `robots.txt`, `sitemap.xml`, **canonical** ve TR→ASCII **slug normalize** middleware devrede.

---

## 7) Renkler & UI (Light)
- **Durum:** Light tema **aktif**.  
- **Son teyit:** `palette-preview.html` ile grid önizleme (arka plan: açık).  
- **Kaynak:** `app/globals.css` tokenlar güncel; okunabilirlik (kontrast) ≥ WCAG AA hedefi.

> **Dark** ile ilgili tüm işler V1.1’e ertelenmiştir.

---

## 8) Veritabanı — Durum & Plan
- **Durum:** Çekirdek DB kurulu; migrations uygulanabilir durumda.  
- **Plan (sıradaki):**
  1. **Role** modeli (`accounts.Role`)  
  2. `User.role = ForeignKey(Role, null=True, on_delete=SET_NULL)`  
  3. **JWT login** (HttpOnly cookie), `/login` & `/register` formları  
  4. Korumalı `/profil` yönlendirmeleri  

**Mini adım — Role (özet):**
```python
# accounts/models.py
class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=50, unique=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```
```bash
# migrate
python manage.py makemigrations accounts && python manage.py migrate
```

---

## 9) Nginx (özet)
- `yatta.com.tr` → `127.0.0.1:3000` (proxy_pass)  
- `api.yatta.com.tr` → `127.0.0.1:8000`  
- **HTTP→HTTPS** kalıcı yönlendirme; **HSTS** aktif.  
- **Proxy başlıkları:** `X-Forwarded-For`, `X-Forwarded-Proto` set edilir.

---

## 10) Hızlı Sağlık Kontrol Komutları
```bash
# Servisler
sudo systemctl status yatta-next yatta-backend
journalctl -u yatta-next -n 50 --no-pager
journalctl -u yatta-backend -n 50 --no-pager

# HTTP başlık & CSS
curl -I https://yatta.com.tr/
CSS_URL=$(curl -s https://yatta.com.tr/yakindayiz | grep -oE '/_next/static/[^\"]+\.css' | head -1)
curl -I -L https://yatta.com.tr$CSS_URL | sed -n '1,8p'

# API sağlık
curl -s https://api.yatta.com.tr/health/ping
```

---

## 11) Kısa Yol Haritası (2 Hafta)
- **Hafta 1:** Role modeli, `User.role` FK, JWT login (cookie), CORS ayarları.  
- **Hafta 2:** `/login` & `/register`, korumalı `/profil`, Satıcı profil iskeleti, Light tema minör düzeltmeler.  
- **Riskler:** Cookie/CORS, form doğrulama; **2 gün tampon** ayrıldı.

---

## 12) Değişiklik Günlüğü
- **07.11.2025:** Tema **Light only** olarak **kilitlendi**; Dark **V1.1 backlog**.
- **07.11.2025:** Dokümantasyon sadeleştirildi; üretim komutları ve sağlık kontrolleri tek yerde toplandı.

---

### Ek — Sık Kullanılan Komutlar (Cheat‑Sheet)
```bash
# FRONTEND
cd /home/yatta/apps/frontend
npm ci && npm run build
npm run start -- -p 3000
sudo systemctl restart yatta-next

# BACKEND
cd /home/yatta/apps/backend
source .venv/bin/activate
python manage.py migrate && python manage.py collectstatic --noinput
sudo systemctl restart yatta-backend

# NGINX/SSL (kontrol)
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl status certbot || true
```


## Doküman Dizini (Kasım 2025)
- [01-OPERASYON.md](docs/01-OPERASYON.md) — Operasyon: CI/CD, Nginx, Go-Live, CSS Fix, Sağlık
- [02-KURULUM.md](docs/02-KURULUM.md) — İlk Kurulum & Local Prod Test
- [03-DB_ENV_MIGRATE.md](docs/03-DB_ENV_MIGRATE.md) — .env, migrate/collectstatic, servis & sağlık

> Tema: **V1 = Light only (kilitli)**, **Dark = V1.1 (backlog)**
