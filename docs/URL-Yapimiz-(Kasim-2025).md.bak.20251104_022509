# 🌊 YATTA — URL Yapımız (Kasım 2025, V1-TR-Default)

> **Varsayılan dil:** Türkçe (prefix yok)  
> **Gelecek diller:** `/en`, `/ru`, `/ar` (prefix’li). İlk fazda sadece TR aktif.  
> **Frontend:** Next.js 15 (React 19, SSR) — `yatta.com.tr` → :3000  
> **Backend:** Django 5.2.7 (Gunicorn, DRF) — `api.yatta.com.tr` → :8000  
> **Proxy:** Nginx + Let’s Encrypt

---

## 0) Tasarım İlkeleri

1. **Kısa & sabit kökler:** TR kökler prefix’siz; i18n geldiğinde diğer diller prefix’li.  
2. **Kalıcı kimlik:** Detay sayfaları `{slug}-{id}` deseni ile *tekil ve stabil*.  
3. **Kanonik tek adres:** lowercase, ASCII, trailing slash yok (root `/` hariç), izleme paramları temiz.  
4. **Facet/filtre kontrolü:** Liste sayfalarında yalnızca `?page=`, `?sort=`, temel filtreler; canonical köke işaretler.  
5. **Temiz migrasyon:** Eski uzun hiyerarşilerden → yeni köklere 301.  
6. **İçerik yaşam döngüsü:** Aktif → Arşiv → 301 (denk var ise) → 410 (denk yoksa).  
7. **Performans:** Kısa yollar, önbellek dostu, statik/SSR karışık.

---

## 1) Kökler (TR — aktif) ve Gelecek Dil Eşlemeleri

> TR şu an **prefix’siz**; diğer diller devreye alındığında tablo kullanılır.

| İçerik Türü            | TR (aktif)      | EN (gelecek) | RU (gelecek) | AR (gelecek) |
|------------------------|------------------|--------------|--------------|--------------|
| Kiralama (tekne/yat)   | `/kiralama`      | `/en/rentals`| `/ru/arenda` | `/ar/تأجير`   |
| Turlar                 | `/turlar`        | `/en/tours`  | `/ru/tury`   | `/ar/جولات`   |
| Konaklama              | `/konaklama`     | `/en/stays`  | `/ru/prozh`  | `/ar/إقامات`   |
| Satılık (deniz araçları)| `/satilik`      | `/en/for-sale`| `/ru/prodaja`| `/ar/للبيع`   |
| İkinci El              | `/ikinci-el`     | `/en/used`   | `/ru/bu`     | `/ar/مستعمل`  |
| Kampanyalar            | `/kampanyalar`   | `/en/deals`  | `/ru/akcii`  | `/ar/عروض`     |
| Organizasyonlar/Etkinlik| `/organizasyonlar`| `/en/events`| `/ru/sobytiya`| `/ar/فعاليات` |
| Rehber/Blog            | `/blog`          | `/en/blog`   | `/ru/blog`   | `/ar/مدونة`    |
| Yardım/Merkez          | `/yardim`        | `/en/help`   | `/ru/help`   | `/ar/help`     |
| Hesap (özel alan)      | `/hesap`         | `/en/account`| `/ru/akkaunt`| `/ar/الحساب`   |
| Kullanıcı profil (genel)| `/u/{username}` | `/en/u/{username}` | ... | ... |

> 🟡 *i18n karşılıkları projede onaylandıkça tablo güncellenecek. TR tarafı sabit kalır.*

---

## 2) URL Desenleri

### 2.1 Liste Sayfaları
- **Kiralama liste:** `/kiralama`
  - Örnek filtreli: `/kiralama?q=gulet&page=2&sort=price_asc&min_price=2000&max_price=10000&guests=6`
- **Turlar:** `/turlar`
- **Konaklama:** `/konaklama`
- **Satılık:** `/satilik`
- **İkinci El:** `/ikinci-el`
- **Kampanyalar:** `/kampanyalar`
- **Organizasyonlar:** `/organizasyonlar`
- **Blog:** `/blog`

**Parametre sözleşmesi (liste):**
- `page` (1..n), `sort` (`price_asc|price_desc|rating|popularity|newest`), `q` (aranan metin)
- Opsiyonel filtreler içerik türüne göre: `min_price`, `max_price`, `guests`, `cabin`, `length`, `location`, `date_from`, `date_to`
- **SEO:** Tüm liste/filtre URL’leri **canonical** → kök liste (ör. `/kiralama`). Robots: `index, follow`.

### 2.2 Detay Sayfaları (kalıcı)
- Desen: `/{kök}/{slug}-{id}`
  - Örnek: `/kiralama/lorhan-yat-luks-1-saatlik-101`
  - Örnek: `/turlar/bozburun-gun-batı-turu-5892`
- **Kural:** `id` integer, `slug` ASCII-lowercase, tire ile ayrılmış.  
- **Kanonik:** self-canonical.  
- **404/410 davranışı:** İçerik kaldırıldıysa bkz. **Yaşam Döngüsü**.

### 2.3 Özel Akışlar
- **Sepet/Checkout:** `/checkout` (noindex, canonical self)
- **Giriş/Kayıt:** `/giris`, `/kayit` (noindex)
- **Hesap alanı:** `/hesap/**` (noindex)
- **Kullanıcı profili (public):** `/u/{username}` (index).  
  - `username` kuralları: lowercase, `^[a-z0-9][a-z0-9-_\.]{2,30}$`, rezerve kelimeler hariç (aşağıda).

---

## 3) Reserved Paths & Usernames

- **Reserved kökler:** `api`, `u`, `hesap`, `checkout`, `giris`, `kayit`, `blog`, tüm içerik kökleri (tablodaki TR kökler).  
- **Username çakışma koruması:** `username ∉ reserved`.  
- **Case/charset:** kullanıcı adları lowercase tutulur; Unicode giriş kabul edilse dahi URL’de ASCII normalize edilir.

---

## 4) URL Normalizasyonu (Kanonikleştirme)

### 4.1 Kurallar
- Tümü **lowercase**
- **Trailing slash yok** (`/` hariç): `/kiralama/` → **301** → `/kiralama`
- Türkçe karakter → ASCII: `ğ→g, ü→u, ş→s, ı→i, ö→o, ç→c`
- Boşluk ve özel karakterler → `-`  
- Çoklu tire → tek tire  
- İzleme paramları **drop & redirect**: `utm_*`, `gclid`, `fbclid` temizlenir → kanonik URL’ye **301**

### 4.2 Next.js `middleware.ts` (App Router)
```ts
// /home/yatta/apps/frontend/src/middleware.ts
import { NextResponse, NextRequest } from "next/server";

const TRACKING_PARAMS = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"];

function toAsciiTR(s: string) {
  const map: Record<string,string> = { "ğ":"g", "ü":"u", "ş":"s", "ı":"i", "İ":"i", "ö":"o", "ç":"c",
                                       "Ğ":"g", "Ü":"u", "Ş":"s", "Ö":"o", "Ç":"c" };
  return s.replace(/[ğüşiİöçĞÜŞÖÇ]/g, ch => map[ch] || ch);
}

export function middleware(req: NextRequest) {
  const url = new URL(req.url);
  const origPath = url.pathname;

  // 1) trailing slash (root hariç)
  let path = origPath !== "/" && origPath.endsWith("/") ? origPath.slice(0, -1) : origPath;

  // 2) lowercase + ascii normalize
  path = toAsciiTR(path).toLowerCase();

  // 3) collapse multiple dashes
  path = path.replace(/-{2,}/g, "-");

  // 4) strip tracking params
  let paramsChanged = false;
  TRACKING_PARAMS.forEach(p => {
    if (url.searchParams.has(p)) {
      url.searchParams.delete(p);
      paramsChanged = true;
    }
  });

  // 5) rebuild if changed
  if (path !== origPath || paramsChanged) {
    url.pathname = path;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|robots.txt|sitemap*.xml|images/|static/).*)"],
};
