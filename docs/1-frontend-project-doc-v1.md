# YATTA — Proje Dokümantasyonu (kanonik): Frontend

> **Güncelleme tarihi:** 07 Kasım 2025 (UTC+3)  
> **Kapsam:** Üretim mimarisi, komutlar, servisler, CI/CD, güvenlik, tema kararı ve kısa yol haritası.  
> **Sürümler:** **Node 20**, **Python 3.12**, **Django 5.2.7**, **Next.js 15 (React 19)**, **Nginx**, **Let's Encrypt**.

---

## 1) Mimari Özeti (Üretim)
- **Sunucu:** Kamatera Cloud — Ubuntu 24.04 — IP: **185.247.118.58**
- **Frontend (SSR):** Next.js 15 — **Domain:** `yatta.com.tr` → **127.0.0.1:3000`** — **Servis:** `yatta-next.service`
- **Backend (API):** Django 5.2.7 (Gunicorn) — **Domain:** `api.yatta.com.tr` → **127.0.0.1:8000`** — **Servis:** `yatta-backend.service`
- **SSL:** Let's Encrypt (otomatik yenileme)  
- **CI/CD:** GitHub push → Flask Webhook → `webhook.sh` → `git pull` → `npm ci` → `npm run build` → `systemctl restart yatta-next`
- **Dizinler:**
  - Frontend: `/home/yatta/apps/frontend`
  - Backend: `/home/yatta/apps/backend`

---

## 2) Tema Kararı (V1)
- **V1:** **Sadece Light** (karar **kilitli**).  
- **V1.1:** **Dark** tema **backlog**'da.  
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
**CORS/JWT Notu:** V1'de **JWT + HttpOnly cookie** hedeflenmektedir (aşağıda Yol Haritası).

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
- **SSL:** Let's Encrypt (otomatik yenileme).  
- **Güvenlik başlıkları:** `Strict-Transport-Security`, `X-Frame-Options`, `Referrer-Policy`, `X-XSS-Protection` aktiftir.  
- **SEO:** `robots.txt`, `sitemap.xml`, **canonical** ve TR→ASCII **slug normalize** middleware devrede.

---

## 7) Renkler & UI (Light)
- **Durum:** Light tema **aktif**.  
- **Son teyit:** `palette-preview.html` ile grid önizleme (arka plan: açık).  
- **Kaynak:** `app/globals.css` tokenlar güncel; okunabilirlik (kontrast) ≥ WCAG AA hedefi.

> **Dark** ile ilgili tüm işler V1.1'e ertelenmiştir.

---

## 8) Veritabanı — Durum & Plan (RBAC V2)
- **Durum:** Çekirdek DB kurulu; migrations uygulanabilir durumda.  
- **Plan (RBAC V2 — Kasım 2025):**
  1. **Role** modeli: `accounts.Role` (slug: `admin`, `partner`, `member`, `integration`)  
  2. **User-Role bağı:** `accounts.UserRole` (OneToOne→User, FK→Role)  
  3. **Grup/İzin:** `auth.Group('seller')` + listing izinleri (`create:listing`, `update:listing`, `delete:listing`)  
  4. **JWT login** (HttpOnly cookie), `/login` & `/register` formları  
  5. Korumalı `/profil` erişimi için middleware kontrolü  

**RBAC V2 Rol Modeli:**
| Görünür Ad | slug         | Açıklama                                   | Panel   |
|------------|--------------|--------------------------------------------|---------|
| Yönetici   | admin        | Tam yetki                                  | Admin   |
| Partner    | partner      | Takvimli/rezervasyon ürünü yönetir         | /profil |
| Üye        | member       | Rezervasyon yapar; temel panel kullanıcısı | /profil |
| (Opsiyonel)| integration  | API erişimi; panele giriş yok             | —       |

**RBAC V2 Yapısı:**
```
RBAC
├─ roles
│  ├─ admin
│  ├─ partner          # takvimli/rezervasyon satan
│  └─ member           # standart üye (rezervasyon yapar)
└─ groups
   └─ seller           # satılık ilan açma/düzenleme yetkisi
```

**Grup/İzin:**
- Grup: `seller` → satılık ilan açma/düzenleme/silme yetkisi
- İzin örnekleri: `create:listing`, `update:listing`, `delete:listing`

**DRF Permission Sınıfları (özet):**
```python
# core/permissions.py (özet)
class IsPartner(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and \
               getattr(request.user.userrole.role, 'slug', None) == 'partner'

class InSellerGroup(IsAuthenticated):
    def has_permission(self, request, view):
        return super().has_permission(request, view) and \
               request.user.groups.filter(name='seller').exists()

# Kullanım örnekleri:
# Listing mutasyonları → seller grubu şart
permission_classes = [IsAuthenticated, InSellerGroup]

# BookingProduct/Slot mutasyonları → partner rolü şart
permission_classes = [IsAuthenticated, IsPartner]
```

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
# migrate & seed
python manage.py makemigrations accounts && python manage.py migrate
python manage.py seed_roles  # admin, partner, member, integration
python manage.py shell -c "from django.contrib.auth.models import Group; Group.objects.get_or_create(name='seller')"
```

**Migration (V1→V2) — Data Migration:**
```python
# accounts/migrations/000X_rbac_v2.py (özet)
# buyer → member
# seller_listing → member + seller(group)
# seller_booking → partner
# Detaylar için: RBAC V1→V2 migration dokümanına bakınız
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
- **Hafta 1:** Role modeli (V2: admin, partner, member, integration), `UserRole` OneToOne bağı, `seller` grubu, JWT login (cookie), CORS ayarları.  
- **Hafta 2:** `/login` & `/register`, korumalı `/profil` (tek panel, koşullu sekmeler), Light tema minör düzeltmeler.  
- **Riskler:** Cookie/CORS, form doğrulama; **2 gün tampon** ayrıldı.

**Panel/URL Yapısı (RBAC V2):**
```
/ (public)
├─ login
├─ register
└─ profil                [auth, tek panel — noindex]
   ├─ rezervasyonlar     [auth]
   ├─ ilanlar            [in_group('seller')]
   ├─ hizmetler          [role=='partner']
   ├─ takvim             [role=='partner']
   ├─ odemeler           [auth]
   ├─ mesajlar           [auth]
   └─ hesabim            [auth]
```

**Kategoriler (public, SEO):**
```
Kategoriler (public, SEO)
├─ konaklama/*
├─ kiralama/*
├─ turlar/*
├─ organizasyon/*
└─ satilik-tekneler/*   # satılık yat/tekne ilanları (seller grubundaki üyeler yönetir)
```

> **Not:** Tek panel yapısı; `/seller/*` ve `/partner/*` ayrı panelleri **yok**. Sekmeler rol/grup şartıyla görünür.

**Next.js Koşullu Sekme Görünürlüğü (özet):**
```tsx
// app/profil/layout.tsx (örnek, sunucu bileşeni)
const role = session?.user?.role;          // 'partner' | 'member' | 'admin'
const inSeller = session?.user?.groups?.includes('seller');

const tabs = [
  { href: '/profil/rezervasyonlar', label: 'Rezervasyonlar', show: true },
  { href: '/profil/ilanlar',        label: 'İlanlar',        show: inSeller },
  { href: '/profil/hizmetler',      label: 'Hizmetler',      show: role==='partner' },
  { href: '/profil/takvim',         label: 'Takvim',         show: role==='partner' },
  // ...
].filter(t => t.show);
```

---

## 12) Değişiklik Günlüğü
- **21.11.2025:** Müşteri ilişkileri sayfaları (5 adet) eklendi: mesafeli satış sözleşmesi, ödeme/rezervasyon, gizlilik politikası, iptal/iade koşulları, veri silme talebi. Root level URL yapısı (SEO optimize), footer entegrasyonu tamamlandı.
- **07.11.2025:** Tema **Light only** olarak **kilitlendi**; Dark **V1.1 backlog**.
- **07.11.2025:** Dokümantasyon sadeleştirildi; üretim komutları ve sağlık kontrolleri tek yerde toplandı.
- **Kasım 2025:** RBAC V1→V2 geçişi: `buyer`→`member`, `seller_listing`→`member`+`seller`(grup), `seller_booking`→`partner`. Tek panel `/profil` yapısı.

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
- [2-frontend-01-operations-v1.md](2-frontend-01-operations-v1.md) — Operasyon: CI/CD, Nginx, Go-Live, CSS Fix, Sağlık
- [3-frontend-02-setup-v1.md](3-frontend-02-setup-v1.md) — İlk Kurulum & Local Prod Test
- [4-frontend-03-db-env-migrate-v1.md](4-frontend-03-db-env-migrate-v1.md) — .env, migrate/collectstatic, servis & sağlık
- [7-frontend-ui-layout-v1.md](7-frontend-ui-layout-v1.md) — UI & Layout Yapısı, Responsive Davranış
- [8-frontend-tailwind-postcss-v4-v1.md](8-frontend-tailwind-postcss-v4-v1.md) — ⚡ Tailwind CSS v4 & PostCSS Konfigürasyonu
- [8-backend-04-rbac-v1-v2-migration-v1.md](../backend:docs/8-backend-04-rbac-v1-v2-migration-v1.md) — RBAC V1→V2 migration, roller, gruplar, izinler

> Tema: **V1 = Light only (kilitli)**, **Dark = V1.1 (backlog)**
