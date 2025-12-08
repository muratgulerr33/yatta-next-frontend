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

## 11) Frontend Sayfalar ve Component'ler (Güncel 2025-12-03)

### ✅ Durum: Güncel 2025

**Güncel 2025 durumu:** Yeni müşteri ilişkileri sayfaları, chat component'leri, Listing Wizard, Profil paneli, Login/Register sayfaları, İlan detay sayfası ve Satılık tekneler sayfası eklendi.

### 📄 Yeni Sayfalar

**Müşteri İlişkileri Sayfaları:**
- `/biz-kimiz` — Hakkımızda sayfası
- `/destek-iletisim` — İletişim sayfası
- `/veri-silme-talebi` — Veri silme talebi sayfası

**Auth Sayfaları (Güncel 2025-11-27):**
- `/login` — Giriş sayfası (Cookie JWT authentication, LoginForm component kaldırıldı - sayfa içinde form implementasyonu - 2025-11-28)
- `/register` — Kayıt sayfası (Cookie JWT authentication)

**Profil Paneli Sayfaları (Güncel 2025-11-27):**
- `/profil` — Ana profil sayfası (skeleton UI, 6 sekme)
- `/profil/ilanlar` — İlanlarım sayfası (RBAC V2.1: artık tüm login kullanıcılar için)
- `/profil/rezervasyonlar` — Rezervasyonlar sayfası
- `/profil/favoriler` — Favoriler sayfası
- `/profil/mesajlar` — Mesajlar sayfası
- `/profil/hesabim` — Hesabım sayfası (ProfileEditForm)

**İlan Sayfaları (Güncel 2025-11-28):**
- `/ilan/[slug]` — İlan detay sayfası (gerçek backend verisiyle)
- `/satilik-tekneler` — Satılık tekneler liste sayfası (gerçek backend API ile)
- `/ilan-ver/satilik-tekne` — İlan verme wizard'ı (auth korumalı)

> **Favoriler Sistemi:** Kullanıcılar satılık tekne kartlarındaki kalp ikonlarıyla ilanları favorileyebilir. Favori durumları `/satilik-tekneler` listesi ile `Profil > Favorilerim` sayfası arasında senkron tutulur. Detaylı teknik dokümantasyon için `13-frontend-06-favorites-sync-v1.md` dosyasına bakın.

**Kategori "Yakında" Sayfaları (Güncel 2025-11-28):**
- `/turlar` — CategoryComingSoon component
- `/kiralama` — CategoryComingSoon component
- `/konaklama` — CategoryComingSoon component
- `/organizasyon` — CategoryComingSoon component

**Sayfa Yapısı:**
- Tüm sayfalar `.page-shell` container kullanır
- Responsive padding: `px-4 py-6 sm:px-6 lg:px-8`
- Metadata (SEO) her sayfada tanımlı

### 🧩 Yeni Component'ler

**HelinChat Component'leri:**
- `components/helin/HelinChatRoot.tsx` — Chat root component
- `contexts/HelinChatContext.tsx` — Chat context provider
  - `HelinChatProvider` — Context provider component
  - `useHelinChatContext` — Context hook

**FlagIcon Component:**
- `components/ui/FlagIcon.tsx` — Bayrak ikonu component (react-flagpack kullanır)
- `components/ui/FlagIconExample.tsx` — Örnek kullanım component'i

**Listing Wizard Component'leri (Güncel 2025-11-27):**
- `components/listing/ListingWizard.tsx` — Ana wizard container
- `components/listing/steps/Step1IdentityLocation.tsx` — Adım 1: Kimlik ve Konum (TR_CITIES data kullanır)
- `components/listing/steps/Step2Technical.tsx` — Adım 2: Teknik Özellikler
- `components/listing/steps/Step3StoryPrice.tsx` — Adım 3: Hikaye ve Fiyat
- `components/listing/steps/Step4Photos.tsx` — Adım 4: Fotoğraflar (10 foto limit)
- `components/listing/steps/Step5SellerReview.tsx` — Adım 5: Satıcı Bilgileri ve Özet

**Data Dosyaları:**
- `data/locations/tr-cities.ts` — Türkiye şehir/ilçe verisi (TR_CITIES), Step1IdentityLocation'da kullanılır

**Profil Paneli Component'leri (Güncel 2025-11-27):**
- `components/profil/ProfilTabs.tsx` — Profil sekme navigasyonu (RBAC V2.1: isAuthenticated kullanır)
- `components/profil/ProfileEditForm.tsx` — Profil düzenleme formu

**İlan Component'leri (Güncel 2025-11-28):**
- `components/listing/SaleBoatCard.tsx` — Satılık tekne kartı
- `components/listing/ListingGallery.tsx` — İlan galeri (fullscreen slider desteği)
- `components/listing/ListingActionSidebar.tsx` — İlan aksiyon sidebar'ı
- `components/listing/MobileStickyActionBar.tsx` — Mobil yapışkan aksiyon çubuğu
- `components/listings/ListingEditDialog.tsx` — İlan düzenleme dialog'u
- `components/listings/ListingRow.tsx` — İlan satırı (liste görünümü)

**Layout Component'leri (Güncel 2025-11-27):**
- `components/layout/SiteHeader.tsx` — Header bileşeni (logo, navigasyon menüsü, RBAC V2 + Helin entegrasyonu - 2025-11-27)

**UI Component'leri (Güncel 2025-11-27):**
- `components/ui/Input.tsx` — Input component (hydration fix ile, useId kullanımı - 2025-11-28)
- `components/ui/PasswordInput.tsx` — Şifre input component
- `components/ui/Button.tsx` — Button component
- `components/ui/CategoryComingSoon.tsx` — Kategori "yakında" component'i
- `components/ui/CategoryShowcase.tsx` — Kategori showcase component'i (görsel tasarım güncellemesi - 2025-11-26)

**Kullanım:**
```tsx
import { FlagIcon } from '@/components/ui/FlagIcon';

<FlagIcon code="TR" size="lg" />
```

### 📦 Bağımlılıklar

**Yeni Paketler:**
- `react-flagpack` — Bayrak ikonları için

**Kurulum:**
```bash
cd /home/yatta/apps/frontend
npm install react-flagpack
```

### 🔄 Global Layout Değişiklikleri

**app/layout.jsx:**
- `metadata` ve `revalidate` export'ları eklendi
- Global safe-area padding düzenlemeleri yapıldı
- 15px padding ayarlamaları uygulandı

**app/globals.css:**
- Tailwind CSS token'ları güncellendi
- Safe-area padding değişkenleri eklendi

**tailwind.config.js:**
- Yeni utility class'lar eklendi
- Responsive breakpoint'ler güncellendi

---

## 11.1) Authentication Sistemi — Cookie JWT (Güncel 2025-12-03)

### ✅ Durum: Tamamlandı

**Cookie JWT Authentication:**
- JWT token'ları HttpOnly cookie olarak backend'den set edilir
- Frontend'de `credentials: "include"` ile tüm API isteklerinde cookie'ler otomatik gönderilir
- Cookie'den authentication durumu kontrol edilir

**Dosyalar:**
- `contexts/AuthContext.tsx` — Cookie JWT desteği ile authentication context
  - `AuthProvider` — Context provider component
  - `useAuth` — Authentication hook
  - `User`, `AuthContextType` — Type definitions
- `hooks/useRequireAuth.ts` — Auth korumalı sayfalar için hook
- `lib/api/auth.ts` — Auth API client (Cookie JWT entegrasyonu)
  - `RegisterData`, `LoginData`, `AuthResponse` — Type definitions

**API Client Güncellemeleri:**
- `lib/api.ts` — `request` fonksiyonuna `credentials: "include"` eklendi
  - `fetchListing` — Gerçek backend'e bağlandı
  - `api.health.ping()` — 404 ve diğer hata durumlarında throw etmeyecek şekilde düzenlendi (2025-11-28)
  - `ListingMedia`, `ListingSummary`, `ListingDetail`, `PartnerPublicProfile`, `PaginatedResponse` — Type definitions
- `lib/media.ts` — `getMediaUrl` helper fonksiyonu
- `lib/api/favorites.ts` — Favoriler API client
  - `Favorite` — Type definition
- `lib/api.ts` — Utility fonksiyonlar
  - `mapListingToCardProps` — Listing verisini SaleBoatCard props formatına dönüştürür (2025-11-29)

**Context Güncellemeleri:**
- `contexts/AppStateContext.jsx` — Health endpoint 404 hatası düzeltmesi (2025-11-28)
  - `useAppState`, `AppStateProvider`, `useStore` — State management hooks

**Kullanım:**
```tsx
// Auth context kullanımı
import { useAuth } from '@/contexts/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();

// Auth korumalı sayfa
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ProtectedPage() {
  useRequireAuth(); // Giriş yapmamışsa yönlendirir
  // ...
}
```

**Güncelleme (2025-12-03):**
- `lib/api.ts` dosyasındaki `request` fonksiyonuna `credentials: "include"` eklendi
- Bu sayede tüm API isteklerinde cookie'ler otomatik olarak gönderilir
- 401 Unauthorized hatalarının önlenmesi için kritik bir düzeltmedir

---

## 12) Kısa Yol Haritası (2 Hafta)
- **Hafta 1:** Role modeli (V2: admin, partner, member, integration), `UserRole` OneToOne bağı, `seller` grubu, JWT login (cookie), CORS ayarları.  
- **Hafta 2:** `/login` & `/register`, korumalı `/profil` (tek panel, koşullu sekmeler), Light tema minör düzeltmeler.  
- **Riskler:** Cookie/CORS, form doğrulama; **2 gün tampon** ayrıldı.

**Panel/URL Yapısı (RBAC V2.1 - Güncel 2025-12-03):**
```
/ (public)
├─ login
├─ register
└─ profil                [auth, tek panel — noindex]
   ├─ rezervasyonlar     [auth]
   ├─ ilanlar            [auth]  # RBAC V2.1: artık tüm login kullanıcılar için
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
└─ satilik/*             # satılık yat/tekne ilanları (seller grubundaki üyeler yönetir)
```

> **Not:** Tek panel yapısı; `/seller/*` ve `/partner/*` ayrı panelleri **yok**. Sekmeler rol/grup şartıyla görünür.

**Next.js Koşullu Sekme Görünürlüğü (RBAC V2.1 - Güncel 2025-12-03):**
```tsx
// app/profil/layout.tsx (örnek, sunucu bileşeni)
const role = session?.user?.role;          // 'partner' | 'member' | 'admin'
const isAuthenticated = !!session?.user;   // RBAC V2.1: inSeller yerine isAuthenticated

const tabs = [
  { href: '/profil/rezervasyonlar', label: 'Rezervasyonlar', show: true },
  { href: '/profil/ilanlar',        label: 'İlanlar',        show: isAuthenticated }, // RBAC V2.1
  { href: '/profil/hizmetler',      label: 'Hizmetler',      show: role==='partner' },
  { href: '/profil/takvim',         label: 'Takvim',         show: role==='partner' },
  // ...
].filter(t => t.show);
```

> **Not (2025-12-03 - RBAC V2.1):** `ProfilTabs` component'inde `inSeller: boolean` prop'u `isAuthenticated: boolean` olarak değiştirildi. "Tekne İlanlarım" ve "İlan ver" tab'ları artık tüm login kullanıcılar için görünür.

---

## 13) Değişiklik Günlüğü
- **03.12.2025:** Profil ilanlar rota düzeltmesi: `/profil/ilanlarim` → `/profil/ilanlar` olarak güncellendi. Eski `/profil/ilanlarim` URL'si artık `/profil/ilanlar`'a redirect ediyor. `app/profil/layout.tsx` dosyasındaki navigasyon linkleri güncellendi.
- **03.12.2025:** Cookie JWT authentication sistemi tamamlandı. `credentials: "include"` tüm API isteklerine eklendi. Profil paneli iyileştirmeleri (RBAC V2.1: isAuthenticated kullanımı).
- **01.12.2025:** `/api/v1/listings/mine/` endpoint'inde 401 hatası düzeltildi.
- **30.11.2025:** Listing Wizard implementasyonu tamamlandı (Step1-5). İlan CRUD işlemleri backend'e bağlandı. Email bildirimleri eklendi.
- **29.11.2025:** İlan detay sayfası gerçek backend entegrasyonu tamamlandı. ListingGallery fullscreen slider eklendi. Favoriler sistemi implementasyonu.
- **29.11.2025:** Profil paneli skeleton UI yapısı oluşturuldu. ProfileEditForm component'i eklendi. `/ilan-ver/satilik-tekne` sayfası auth korumasına alındı.
- **28.11.2025:** Satılık tekneler sayfası (`/satilik-tekneler`) gerçek backend API ile çalışır hale getirildi. CategoryComingSoon component'i eklendi.
- **28.11.2025:** Health endpoint 404 hatası düzeltildi. `api.health.ping()` fonksiyonu 404 ve diğer hata durumlarında throw etmeyecek şekilde düzenlendi. AppStateContext güncellendi.
- **28.11.2025:** Login/Register sayfaları ve formları modernize edildi. Input, PasswordInput, Button component'leri güncellendi. Hydration mismatch hatası düzeltildi (useId kullanımı). LoginForm component kaldırıldı, sayfa içinde form implementasyonu yapıldı.
- **27.11.2025:** Listing Wizard UI/UX iyileştirmeleri: Step 3'te "Fiyat talep üzerine" checkbox kaldırıldı, Step 4'te medya UX iyileştirmeleri (10 foto limit, drag & drop, preview grid), Step 5'te satıcı tipi label'ı "Sahibi"den "Sahibinden"e güncellendi.
- **27.11.2025:** SiteHeader component'i RBAC V2 + Helin entegrasyonu ile güncellendi.
- **26.11.2025:** CategoryShowcase component'inin görsel tasarımı modern standartlara göre güncellendi (slider mantığı korundu).
- **27.11.2025:** Member login/register sayfaları ve profil paneli sekmeleri eklendi. RBAC V2 entegrasyonu tamamlandı.
- **24.11.2025:** Yeni müşteri ilişkileri sayfaları eklendi (`/biz-kimiz`, `/destek-iletisim`, `/veri-silme-talebi`). HelinChat component'leri ve FlagIcon component'i eklendi. Global layout safe-area refactor yapıldı.
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
- [8-backend-04-rbac-v1-v2-migration-v1.md](../backend:docs/8-backend-04-rbac-v1-v2-migration-v1.md) — RBAC V1→V2 migration, roller, gruplar, izinler

> Tema: **V1 = Light only (kilitli)**, **Dark = V1.1 (backlog)**
