# Redux Kullanım Raporu

**Proje:** Next.js 15 Frontend  
**Tarih:** Analiz Raporu  
**Kod Kök Dizini:** `/home/yatta/apps/frontend`

---

## 1. Package.json Analizi

### ✅ Kontrol Edilen Paketler:

- ❌ **"redux"** - Bulunamadı
- ❌ **"@reduxjs/toolkit"** - Bulunamadı
- ❌ **"react-redux"** - Bulunamadı
- ❌ **"zustand"** - Bulunamadı (sadece yorum satırında referans var)
- ❌ **"jotai"** - Bulunamadı
- ❌ **"recoil"** - Bulunamadı

**Sonuç:** `package.json` dosyasında Redux, Redux Toolkit veya alternatif state management kütüphaneleri **yüklü değil**.

---

## 2. Kaynak Kod Taraması

### Redux Pattern'leri Arama Sonuçları:

- ❌ `"@reduxjs/toolkit"` - Bulunamadı
- ❌ `"configureStore"` - Bulunamadı
- ❌ `"createSlice"` - Bulunamadı
- ❌ `"createAsyncThunk"` - Bulunamadı
- ❌ `"react-redux"` - Bulunamadı
- ❌ `"<Provider store="` - Bulunamadı
- ❌ `"useSelector"` - Bulunamadı
- ❌ `"useDispatch"` - Bulunamadı

**Sonuç:** Kaynak kodda Redux veya Redux Toolkit kullanımına dair **hiçbir iz yok**.

---

## 3. Ana Sonuç

### ❌ **Bu projede Redux / Redux Toolkit kullanılmıyor.**

---

## 4. Kullanılan Global State Yönetimi

Proje, **React Context API** kullanarak global state yönetimi yapıyor. Aşağıdaki Context'ler tanımlanmış:

### 4.1. Context Dosyaları:

1. **`contexts/AuthContext.tsx`**
   - **Amaç:** Kullanıcı kimlik doğrulama ve oturum yönetimi
   - **State:** `user`, `isLoading`, `isAuthenticated`
   - **Fonksiyonlar:** `login()`, `logout()`, `refreshUser()`
   - **Hook:** `useAuth()`

2. **`contexts/AppStateContext.jsx`**
   - **Amaç:** Backend health check ve genel uygulama durumu
   - **State:** `backendStatus`, `loading`, `error`
   - **Fonksiyonlar:** `checkBackendHealth()`
   - **Hook:** `useAppState()`

3. **`contexts/HelinChatContext.tsx`**
   - **Amaç:** Helin chat bot durumu ve mesaj yönetimi
   - **State:** `isOpen`, `messages`, `isLoading`, `hasUnread`, `sessionContext`
   - **Fonksiyonlar:** `toggleChat()`, `sendMessage()`
   - **Hook:** `useHelinChatContext()`
   - **Not:** LocalStorage ile persistence kullanıyor

### 4.2. Next.js App Router Entegrasyonu

Provider'lar **`app/layout.jsx`** dosyasında entegre edilmiş:

```87:106:app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="tr" data-theme="light" className={inter.variable}>
      <body className="font-sans antialiased bg-light text-primary min-h-screen flex flex-col">
        <AppStateProvider>
          <AuthProvider>
            <HelinChatProvider>
              <SiteHeader />
              <main className="flex-1 px-[11px]">
                {children}
              </main>
              <SiteFooter />
              <HelinChatRoot />
            </HelinChatProvider>
          </AuthProvider>
        </AppStateProvider>
      </body>
    </html>
  )
}
```

**Provider Hiyerarşisi:**
1. `AppStateProvider` (en dış)
2. `AuthProvider`
3. `HelinChatProvider` (en iç)

---

## 5. Özet

| Özellik | Durum |
|---------|-------|
| Redux Toolkit | ❌ Kullanılmıyor |
| Redux | ❌ Kullanılmıyor |
| React Context API | ✅ Kullanılıyor (3 Context) |
| Zustand / Jotai / Recoil | ❌ Kullanılmıyor |
| Store/Slice Sayısı | 0 (Redux yok) |
| Provider Entegrasyonu | `app/layout.jsx` içinde |

---

## 6. Notlar

- `AppStateContext.jsx` dosyasında Zustand için yorum satırı halinde örnek kod var (65-87. satırlar), ancak gerçek kullanım yok.
- Tüm Context'ler `'use client'` direktifi ile client-side component olarak tanımlanmış (Next.js 15 App Router uyumlu).
- State persistence için sadece `HelinChatContext` LocalStorage kullanıyor.

---

**Rapor Hazırlayan:** AI Assistant  
**Analiz Tarihi:** Bugün

