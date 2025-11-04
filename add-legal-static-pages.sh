#!/bin/bash
# === YATTA — URL doc: Hukuki & Statik Sayfalar (TR) BLOK EKLE/ENDER ===

set -euo pipefail

cd /home/yatta/apps/frontend

DOCS_DIR="./docs"

DOC_FILE="$DOCS_DIR/URL-Yapimiz-(Kasim-2025).md"

BACKUP="$DOC_FILE.bak.$(date +%Y%m%d_%H%M%S)"

mkdir -p "$DOCS_DIR"

chown -R yatta:yatta "$DOCS_DIR" 2>/dev/null || true

chmod 755 "$DOCS_DIR"

# Dosya yoksa boş oluştur

[ -f "$DOC_FILE" ] || : > "$DOC_FILE"

# Yedek al

cp "$DOC_FILE" "$BACKUP"

# Eski blok varsa sil (LEGACY markers)

awk '

  BEGIN {skip=0}

  /<!-- LEGAL_STATIC_START -->/ {skip=1; next}

  /<!-- LEGAL_STATIC_END -->/   {skip=0; next}

  skip==0 {print}

' "$BACKUP" > "$DOC_FILE"

# Yeni blok sonuna ekle

cat >> "$DOC_FILE" <<'EOF'

<!-- LEGAL_STATIC_START -->

## Hukuki & Statik Sayfalar (TR)

> Varsayılan dil **TR** (prefix yok). Redirect **yok** (eski sürüm indexlenmedi).

> **Indexleme:** tüm statik/hukuki sayfalar `index,follow`; **/hesap/** ve auth rotaları `noindex`.

> **Canonical:** self. **Sitemap:** statik/hukuki sayfaların tamamı dahil; **/hesap/** ve auth hariç.

**Kanonik TR rotaları**

- `/` — Anasayfa

- `/hakkimizda`

- `/iletisim`

- `/yardim`  *(SSS / Yardım Merkezi)*

- `/gizlilik-politikasi`

- `/kvkk-aydinlatma`

- `/kullanim-sartlari`

- `/cerez-politikasi`

- `/mesafeli-satis-sozlesmesi`

- `/iade-iptal-kosullari`

- `/odeme-ve-rezervasyon-kosullari`  *(varsa)*

**Auth & Panel**

- `/giris` — *(indexlenebilir; canonical self)*

- `/kayit` — *(indexlenebilir; canonical self)*

- `/hesap/**` — *(özel alan, **noindex**)*

> Not: WooCommerce kalıntıları (`/shop/`, `/cart/`, `/my-account/`) **kullanılmayacak**.

<!-- LEGAL_STATIC_END -->

EOF

# Sahiplik/izin

chown yatta:yatta "$DOC_FILE" 2>/dev/null || true

chmod 644 "$DOC_FILE"

# Özet göster

echo "----- DEĞİŞEN SATIR ÖZETİ -----"

diff -u "$BACKUP" "$DOC_FILE" || true

echo "--------------------------------"

# Git commit & push

git checkout main

git pull origin main

git add "$DOC_FILE"

git commit -m "docs: Hukuki & Statik Sayfalar (TR) eklendi — redirect yok, TR kanonik rotalar"

git push origin main || true

echo "✓ Doküman güncellendi ve push edildi:"

git log -1 --pretty=format:"%h %ad %s" --date=short

# === /SON ===

