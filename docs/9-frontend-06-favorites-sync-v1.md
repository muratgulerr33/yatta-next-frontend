# Frontend Favoriler Sistemi — Satılık Tekneler & Profil Senkronizasyonu

> Durum: **Aktif (2025-12-07 sonrası gerçek durum)**  
> Kapsam: **Satılık tekneler liste sayfası** + **Profil › Favoriler** + **Favorites API (backend)**

---

## 1. Özet

Bu doküman, Yatta V1 için favori ilan sisteminin **backend + frontend** tarafında nasıl çalıştığını ve 7 Aralık 2025 akşamına kadar yaptığımız düzeltmeleri özetler.

**Temel Özellikler:**
- Member kullanıcılar satılık tekne kartlarındaki kalp ikonlarıyla ilanları favorileyebilir
- Favori durumları `/satilik-tekneler` listesi ile `Profil > Favorilerim` sayfası arasında senkron tutulur
- Guest kullanıcılar için güvenli davranış: API çağrısı yok, sadece login sayfasına yönlendirme
- Idempotent favori ekleme: Aynı ilan için tekrar ekleme isteği 400 hata yerine mevcut favoriyi döner

**Hedefler:**
1. Aynı ilan için favori ekleme isteği tekrarlandığında **400 hata yerine idempotent** davranış (her zaman tek kayıt)
2. **Satılık tekneler** sayfasındaki kalp ikonlarının, backend'deki favori kayıtlarıyla **tam senkron** çalışması
3. **Profil › Favoriler** sayfasının, satılık tekneler sayfası ile **çift yönlü senkron** olması (bir yerde yapılan değişiklik diğerine yansımalı)
4. **Guest kullanıcı** (login değil) için güvenli ve temiz davranış: API çağrısı yok, sadece login sayfasına yönlendirme

---

## 2. Backend API Davranışı

### 2.1. ViewSet Özeti

**Dosya:** `backend/main_app/views_api.py`

```python
class FavoriteViewSet(viewsets.ModelViewSet):
    """Favoriler ViewSet (sadece login kullanıcı için)"""
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Sadece kendi favorilerini görsün
        return (
            Favorite.objects
            .filter(user=self.request.user)
            .select_related("listing", "listing__owner")
            .prefetch_related("listing__media")
        )

    def create(self, request, *args, **kwargs):
        """Aynı ilan için ikinci kez POST geldiğinde
        400 yerine mevcut favoriyi dön (idempotent)."""
        ...
```

> **Not:** `permission_classes = [IsAuthenticated]` → **guest kullanıcı** backend tarafında bu endpoint'e erişemez. Tüm çağrılar Cookie JWT ile gelen giriş yapmış kullanıcıya özeldir.

### 2.2. `create` (POST /api/v1/favorites/) — Idempotent Davranış

`create` metodunda yapılan ana değişiklikler:

**1. Request Verisi Doğrulama:**
- `serializer = self.get_serializer(data=request.data)`
- `serializer.is_valid(raise_exception=True)`
- Burada `listing` alanı zorunlu; yanlış veya eksik ise standart DRF 400 hatası döner

**2. Listing Doğrulama:**
- `listing_id = serializer.validated_data["listing"]`
- `Listing.objects.get(pk=listing_id)` ile gerçekten var mı kontrol edilir
- Yoksa:
  ```python
  return Response(
      {"listing": ["Geçersiz ilan id."]},
      status=status.HTTP_400_BAD_REQUEST,
  )
  ```

**3. Idempotent Favori Oluşturma:**
Aynı kullanıcı + aynı ilan kombinasyonu için **tek kayıt** olması garanti edilir:

```python
favorite, created = Favorite.objects.get_or_create(
    user=request.user,
    listing=listing,
)
```

**4. Cevap Formatı (201 vs 200):**
```python
serializer = self.get_serializer(favorite)
status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
headers = self.get_success_headers(serializer.data)
return Response(serializer.data, status=status_code, headers=headers)
```

- İlk kez favoriye eklendiğinde → **201 Created**
- Zaten favorilerde ise → **200 OK** + aynı favori objesi
- Böylece frontend'de artık `"Bu ilan zaten favorilerinizde."` hatası alamıyoruz

### 2.3. Listeleme & Silme

**GET /api/v1/favorites/:**
- Giriş yapmış kullanıcının favorilerini döner
- Response formatı **DRF paginated**:
  ```json
  {
    "count": 2,
    "next": null,
    "previous": null,
    "results": [
      { "id": 16, "listing": { ... } },
      { "id": 17, "listing": { ... } }
    ]
  }
  ```

**DELETE /api/v1/favorites/{id}/:**
- İlgili favori kaydını siler
- Başarılı durumda **204 No Content** döner

### 2.4. Test Notları (curl)

Lokal backend için kullanılan temel testler:

```bash
# Login (Cookie JWT)
curl -i \
  -c cookies.txt \
  -X POST http://127.0.0.1:8000/api/v1/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "membertest1",
    "password": "TestPass123!"
  }'

# Favori ekleme (idempotent)
curl -i \
  -b cookies.txt \
  -X POST http://127.0.0.1:8000/api/v1/favorites/ \
  -H "Content-Type: application/json" \
  -d '{ "listing": 10 }'

# Favorileri listeleme
curl -i -b cookies.txt http://127.0.0.1:8000/api/v1/favorites/

# Favori silme
curl -i -b cookies.txt -X DELETE http://127.0.0.1:8000/api/v1/favorites/16/
```

Tüm bu çağrılar **201/200/204/200** statü kodlarıyla başarılı şekilde döner; 400 "Bu ilan zaten favorilerinizde" hatası artık yoktur.

---

## 3. Satılık Tekneler Sayfası (`/satilik-tekneler`)

### 3.1. Genel Akış

**Dosya:** `frontend/components/listing/SatilikTeknelerClient.tsx`

**Yüksek Seviye Akış:**

1. `useAuth()` hook'u ile kullanıcının **login / guest** durumu okunur
2. `loadFavorites` fonksiyonu `useCallback` ile tanımlanır ve içinde `getFavorites()` çağrılır
3. Response içindeki favorilerden, `Map<number, number>` oluşturulur:
   ```ts
   const map = new Map<number, number>();
   favoritesArray.forEach((fav) => {
     map.set(fav.listing.id, fav.id);
   });
   setFavoritesMap(map);
   ```
4. `favoritesMap`, her `SaleBoatCard`'a prop olarak geçirilir; kart içindeki kalp ikonu bu map'i kullanarak **kırmızı / beyaz** durumuna karar verir
5. Kullanıcı kalbe tıkladığında, ilgili callback hem backend'e POST/DELETE çağrısı yapar, hem de `favoritesMap`'i günceller
6. Guest kullanıcıysa:
   - Liste yüklenirken **hiç favorites API çağrısı yapılmaz**
   - Kalbe tıklayınca, mevcut davranış korunur: login sayfasına yönlendirme

### 3.2. `favoritesMap` State Yönetimi

`favoritesMap` bir `Map<number, number>` yapısıdır:
- **Key:** Listing ID
- **Value:** Favorite ID

Bu yapı sayesinde:
- Her kart için favori durumu O(1) karmaşıklığında kontrol edilir
- Favori ekleme/çıkarma işlemleri hızlıca yapılır
- Profil sayfası ile senkronizasyon kolaylaşır

### 3.3. Guest Kullanıcı Davranışı

Guest kullanıcılar için:
- **API çağrısı yapılmaz:** `isAuthenticated === false` durumunda `getFavorites()` çağrılmaz
- **Kalbe tıklama:** Login sayfasına yönlendirme yapılır
- **Gereksiz network trafiği oluşmaz:** 401 hatası ve gereksiz istekler engellenir

---

## 4. Profil > Favoriler Sayfası

### 4.1. Amaç

- Kullanıcının favorilediği ilanları tek yerde listelemek
- Kartlardaki kalp ikonlarının `/satilik-tekneler` sayfasıyla **tam senkron** çalışması
- Guest kullanıcıları güvenli şekilde dışarıda tutmak (login sayfasına yönlendirme)

### 4.2. Veri Kaynağı

Favoriler sayfası da, listeleme sayfası gibi **ortak helper** kullanır:

**Ortak Helper: `getFavorites()`**
- **Dosya:** `lib/api/favorites.ts`
- **Endpoint:** `GET /api/v1/favorites/`
- **Response:** Hem düz array, hem de paginated obje (`{ results: [...] }`) olabilir
- **Dönüş Tipi:** `FavoriteDto[]`

```ts
// lib/api/favorites.ts (özet)
export async function getFavorites(options?: RequestInit) {
  const data = await request<any>("/api/v1/favorites/", {
    method: "GET",
    ...(options ?? {}),
  });

  const results = Array.isArray(data) ? data : data?.results ?? [];
  return results as FavoriteDto[];
}
```

Bu helper hem:
- `SatilikTeknelerClient.tsx` içinde
- `app/profil/favoriler/page.tsx` içinde

ortak kullanılır; böylece backend response formatı değişse bile tek noktadan güncellenir.

### 4.3. Listing → Card Mapping

Favoriler sayfasında backend'den gelen her `Favorite` kaydı bir **SaleBoatCard** kartına dönüştürülür.

**Yardımcı Fonksiyon:**
```ts
// app/profil/favoriler/page.tsx (özet)
function mapListingToCardProps(listing: ListingDto): SaleBoatCardProps {
  return {
    id: listing.slug,          // kartta kullanılan id / slug
    title: listing.title,
    price: listing.price,
    location: listing.location,
    // ... diğer gerekli alanlar
  };
}
```

**Render Akışı:**
1. `getFavorites()` ile favoriler çekilir
2. `results[]` içindeki her kayıt için:
   - `fav.listing` alınır
   - `mapListingToCardProps(fav.listing)` ile karta dönüştürülür
3. `SaleBoatCard` component'i `isFavorite={true}` ve gerekli `onFavoriteToggle` callback'i ile render edilir

Bu sayede **satılık tekneler sayfasındaki kart yapısı ile profil/favoriler sayfasındaki kart yapısı aynı** kalır.

### 4.4. Favori Silme Senkronizasyonu

Profildeki karttan kalp ikonuna basıldığında:

1. İlgili `Favorite` kaydının `id`'si biliniyorsa:
   - `DELETE /api/v1/favorites/{favoriteId}/` çağrılır
   - Başarılıysa, frontend'de:
     - Favoriler listesinden bu kayıt çıkarılır
     - `favoritesMap` içinden ilgili `listing_id` key'i silinir

2. Kullanıcı tekrar `/satilik-tekneler` sayfasına döndüğünde:
   - Sayfa açılırken `getFavorites()` yeniden çağrılır
   - `favoritesMap` güncel state ile kurulmuş olduğu için
   - Silinen ilanların kalp ikonları **otomatik beyaz** görünür

**Çift Yönlü Senkronizasyon:**
- Listeleme sayfasında kalbi beyaz yaparsan → Profil/Favoriler'de kart kaybolur
- Profil/Favoriler'de kartı silersen → Listeleme sayfasında kalp beyaz olur

### 4.5. Guest Kullanıcı Davranışı

- Guest kullanıcı `/profil/favoriler` rotasına gitmeye çalışırsa:
  - `AuthGuard` / `useRequireAuth` pattern'i gereği login sayfasına yönlendirilir
- Guest kullanıcı `/satilik-tekneler` sayfasında kalbe tıklarsa:
  - Frontend, auth context'te `isAuthenticated === false` gördüğü için
  - **Hiç favori API çağrısı yapmadan** login sayfasına yönlendirir

Böylece guest kullanıcılar için:
- Gereksiz 401 hatası ve gereksiz network trafiği oluşmaz
- Kullanıcı deneyimi net: "Favori için önce giriş yap"

---

## 5. Manuel Test Senaryoları

Aşağıdaki senaryolar, hem geliştirme sırasında hem de regresyon testlerinde **checklist** olarak kullanılabilir.

### 5.1. Senaryo 1 — İlk Favori Ekleme

1. Login ol (`member` rolü yeterli)
2. `/satilik-tekneler` sayfasını aç
3. Herhangi bir ilandaki kalp ikonuna tıkla
4. Üst menüden **Profil → Favoriler** sayfasına git
5. **Beklenenler:**
   - Kalp ikonuna bastığın ilan burada listelenmiş olmalı
   - Karttaki kalp ikonu **kırmızı** olmalı

### 5.2. Senaryo 2 — Favoriden Çıkarma

1. Senaryo 1 sonunda en az 1 favorin olduğunu varsay
2. **Profil → Favoriler** sayfasında ilgili karttaki kalbe tıkla
3. Kart listeden kaybolmalı
4. `/satilik-tekneler` sayfasına geri dön
5. Aynı ilanın üstündeki kalp ikonunun **beyaz** olduğunu doğrula

### 5.3. Senaryo 3 — Çoklu Favori ve Refresh

1. Login ol
2. `/satilik-tekneler` sayfasında 2–3 farklı ilanı favorile
3. **Profil → Favoriler** sayfasına git
4. Tüm seçtiğin ilanların listede olduğunu doğrula
5. Sayfayı **yenile (⌘R)**
6. **Beklenenler:**
   - Favori sayısı aynı (ör: 3) kalmalı
   - Kartlardaki kalpler **kırmızı** kalmalı

### 5.4. Senaryo 4 — Logout & Tekrar Login

1. Senaryo 3 sonunda 2–3 favorin varken
2. Sağ üstten **Çıkış Yap**
3. Tarayıcıyı kapat / gizli sekmeyi kapat
4. Yeni gizli sekme aç, tekrar login ol
5. `/satilik-tekneler` sayfasını aç
6. **Beklenenler:**
   - Favorilediğin ilanların kalpleri **1 saniye içinde beyaza → kırmızıya güncellenir** (SSR + client sync)
7. **Profil → Favoriler** sayfasına git
8. **Beklenenler:**
   - Favori ilan sayısı doğru
   - Kartlar ile listeleme sayfasındaki kalpler **tam senkron**

### 5.5. Senaryo 5 — Guest Mod

1. Tüm sekmelerde logout ol
2. `/satilik-tekneler` sayfasını guest olarak aç
3. Kalp ikonuna tıkla
4. **Beklenenler:**
   - Network tab'da **/api/v1/favorites/** isteği yok
   - Uygulama login sayfasına yönlendirir

---

## 6. Bilinen Edge Case'ler / Notlar

### 6.1. Paginated Response

Backend'den gelen response formatı **DRF paginated** olabilir:
```json
{
  "count": 10,
  "next": "http://api.yatta.com.tr/api/v1/favorites/?page=2",
  "previous": null,
  "results": [...]
}
```

Frontend helper (`getFavorites()`) hem düz array, hem de paginated formatı destekler:
```ts
const results = Array.isArray(data) ? data : data?.results ?? [];
```

**Not:** Şu an backend paginated response döndürüyor. İleride sadece array'e dönülse bile frontend bozulmayacak.

### 6.2. 401 Hata Yönetimi

**Önceki Durum:**
- Guest kullanıcı kalbe tıklayınca API çağrısı yapılıyordu
- 401 hatası alınıyordu ve overlay gösteriliyordu

**Güncel Durum (V2.1):**
- Guest kullanıcı için API çağrısı yapılmıyor
- `isAuthenticated === false` kontrolü ile login sayfasına yönlendirme yapılıyor
- Gereksiz network trafiği ve 401 hataları engellenmiş durumda

### 6.3. Idempotent Favori Ekleme

**Önceki Durum:**
- Aynı ilan için ikinci kez favori ekleme isteği 400 hatası veriyordu
- Frontend'de "Bu ilan zaten favorilerinizde" hatası gösteriliyordu

**Güncel Durum (V2.1):**
- `get_or_create` kullanılarak idempotent davranış sağlandı
- İlk ekleme: 201 Created
- Tekrar ekleme: 200 OK (mevcut favori döner)
- Frontend'de hata mesajı gösterilmiyor

### 6.4. Senkronizasyon Notları

**Çift Yönlü Senkronizasyon:**
- Satılık tekneler sayfası ↔ Profil > Favoriler sayfası
- Her iki sayfa da aynı `getFavorites()` helper'ını kullanır
- `favoritesMap` state'i her iki sayfada da tutulur
- Bir sayfada yapılan değişiklik diğerine yansır

**Refresh Sonrası:**
- Sayfa yenilendiğinde `getFavorites()` yeniden çağrılır
- Backend'den güncel favori listesi alınır
- `favoritesMap` güncel state ile kurulur

---

## 7. Debug Rehberi (Network & Console)

Favorilerle ilgili bir bug olduğunda aşağıdaki sırayla kontrol et:

### 7.1. Cookie'ler

- DevTools → Network → herhangi bir `/api/v1/favorites/` isteği → **Cookies** sekmesi
- `yatta_access` ve `yatta_refresh` cookie'lerinin gönderildiğini doğrula

### 7.2. Status Code'lar

- **200:** Her şey normal, response body'ye bak
- **201 (POST):** Favori başarıyla oluşturulmuş
- **204 (DELETE):** Favori başarıyla silinmiş, body yok
- **401:** Büyük ihtimalle login state / cookie problemi

### 7.3. Response Body

**List Endpoint'i:**
- Paginated: `{ "count": X, "results": [...] }`
- Düz dizi: `[ ... ]`

Frontend her iki formatı da destekliyor; farklı bir format görürsen backend tarafını kontrol et.

### 7.4. Console Hataları

- `favs.forEach is not a function` benzeri hatalar
  - Genellikle response formatı beklentiden farklı olduğunda çıkar
  - `Array.isArray(data) ? data : data?.results ?? []` satırını kontrol et

### 7.5. Auth Akışı

- Guest modda **hiç favori isteği gitmemesi** gerekiyor
- Login modda `/api/v1/accounts/me/` isteğinin 200 dönüp dönmediğine bak

Bu adımlarla, favori sistemiyle ilgili çoğu problemi hızlıca teşhis edebilirsin.

---

## 8. İlgili Dokümanlar

- `1-frontend-project-doc-v1.md` — Ana frontend proje dokümantasyonu
- `2-frontend-01-operations-v1.md` — Frontend operasyon dokümantasyonu
- `6-backend-project-doc-v1.md` — Backend API dokümantasyonu
- `lib/api/favorites.ts` — Favoriler API helper implementasyonu
- `components/listing/SatilikTeknelerClient.tsx` — Satılık tekneler sayfası component'i
- `app/profil/favoriler/page.tsx` — Profil favoriler sayfası

---

**Son Güncelleme:** 2025-12-07 — Favoriler sistemi backend + frontend entegrasyonu ve senkronizasyon implementasyonu
