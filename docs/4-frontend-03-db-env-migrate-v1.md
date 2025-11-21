# 03-DB_ENV_MIGRATE

## Amaç
Backend için **.env şablonu**, **migrate/collectstatic** komutları, **servis** ve **sağlık testi** adımlarını tek dosyada toplamak.

> **Sürümler:** Python 3.12 · Django 5.2.7 · Gunicorn · PostgreSQL  
> **Servis:** `yatta-backend.service` (127.0.0.1:8000)  
> **Domain:** `api.yatta.com.tr`

---

## 1) .env Şablonu (PROD)

> Gizli değerleri doldur (parola/anahtar paylaşma yok). Liste virgül ile ayrılır.

```dotenv
# Django
DJANGO_DEBUG=False
DJANGO_SECRET_KEY=CHANGE_ME_STRONG_SECRET
ALLOWED_HOSTS=yatta.com.tr,api.yatta.com.tr,127.0.0.1,localhost
CSRF_TRUSTED_ORIGINS=https://yatta.com.tr,https://api.yatta.com.tr
CORS_ALLOWED_ORIGINS=https://yatta.com.tr
USE_X_FORWARDED_HOST=True
SECURE_PROXY_SSL_HEADER=HTTP_X_FORWARDED_PROTO,https

# Statik/Medya
STATIC_ROOT=/home/yatta/apps/backend/staticfiles
MEDIA_ROOT=/home/yatta/apps/backend/media

# Veritabanı (ikiden birini kullan)
# 1) Tek satır URL
DATABASE_URL=postgres://yatta:CHANGE_ME@127.0.0.1:5432/yatta

# 2) Ayrı alanlar
POSTGRES_DB=yatta
POSTGRES_USER=yatta
POSTGRES_PASSWORD=CHANGE_ME
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
```

> Konum: `/home/yatta/apps/backend/.env` (sunucuda) — **UTF‑8**.

**Not (LOCAL):** Gerekirse `DJANGO_DEBUG=True`, `ALLOWED_HOSTS=127.0.0.1,localhost` yeterli.

---

## 2) Migrate & Static (Komutlar)

```bash
# Sanal ortamı aç ve proje dizinine geç
cd /home/yatta/apps/backend
source .venv/bin/activate

# (Gerekirse) bağımlılıkları yükle
pip install -r requirements.txt

# Sağlık: temel kontrol
python manage.py check

# Veritabanı işlemleri
python manage.py migrate && python manage.py collectstatic --noinput
```

**Beklenen Çıktı:** `System check identified no issues`, migrations uygulandı, statikler kopyalandı.

---

## 3) Servis Yönetimi (Gunicorn)

```bash
# Servisi yeniden başlat ve logları kontrol et
sudo systemctl restart yatta-backend
sudo systemctl status yatta-backend
journalctl -u yatta-backend -n 100 --no-pager
```

**Beklenen:** `active (running)`.

---

## 4) Sağlık Testi

```bash
# Health endpoint
curl -s https://api.yatta.com.tr/health/ping
```

**Beklenen:** `{ "status": "healthy" }`.

---

## 5) Hata & Çözüm (Kısa)

- **DB bağlantı hatası:** `DATABASE_URL` / `POSTGRES_*` değerlerini ve PostgreSQL servisini kontrol et.  
- **`psycopg`/bağımlılık hatası:** `pip install -r requirements.txt` ve Python 3.12 doğrula.  
- **`collectstatic` izinleri:** `STATIC_ROOT` dizin izinlerini kontrol et (`mkdir -p` + sahiplik).  
- **`ALLOWED_HOSTS`/CSRF:** Domainler ekli mi? `CSRF_TRUSTED_ORIGINS` https ile yazılmalı.

---

## 6) Checklist

- [ ] `.env` yerinde ve dolu (PROD)  
- [ ] `python manage.py check` sorunsuz  
- [ ] `migrate` ve `collectstatic` başarılı  
- [ ] `yatta-backend` **active (running)**  
- [ ] `/health/ping` → **healthy**

