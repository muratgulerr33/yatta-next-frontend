# Helin Chatbot Logging Stratejisi

## V1 Mevcut Durum
Şu anda Helin Chatbot, V1 kapsamında sadece **console log** üzerinden loglama yapmaktadır. `lib/helin/logger.ts` dosyası, tüm mesajları JSON formatında konsola basar. Bu loglar, serverless ortamların (Vercel vb.) log yönetim panellerinden izlenebilir.

## Veri Şeması Taslağı (İleri Aşama)
Gerçek bir veritabanına geçildiğinde kullanılacak minimum tablo şeması aşağıdaki gibidir:

**Tablo Adı:** `chat_messages`

| Alan Adı | Tip | Açıklama |
| --- | --- | --- |
| `id` | UUID / Auto-inc | Kayıt ID |
| `session_id` | UUID / String | Oturum ID (istemcide üretilen) |
| `timestamp` | DateTime | Mesajın atıldığı zaman |
| `from_role` | String | 'user' veya 'bot' |
| `content` | Text | Mesaj içeriği |
| `intent` | String | Tespit edilen niyet (opsiyonel, sadece bot için) |
| `matched_faq_id` | String | Eşleşen SSS ID'si (opsiyonel) |
| `needs_human` | Boolean | İnsan desteği gerekti mi? |

## Entegrasyon Önerisi
Helin Chatbot frontend (Next.js) üzerinde çalıştığı, ancak ana iş mantığı ve veritabanının Django tarafında olduğu düşünülürse, loglamanın asenkron bir HTTP POST isteği ile Django API'ye gönderilmesi önerilir.

**Örnek Akış:**
1. Kullanıcı mesaj atar -> Next.js API Route (`/api/helin-chat`) karşılar.
2. Cevap üretilir.
3. Next.js API, cevabı kullanıcıya dönmeden HEMEN ÖNCE veya döndükten sonra (fire-and-forget), log verisini Django endpoint'ine (`POST /api/v1/chat/logs/`) gönderir.

Bu yapı, frontend'in veritabanı bağlantısı yönetmesini engeller ve tüm iş verilerinin merkezi backend'de (Django) toplanmasını sağlar.

