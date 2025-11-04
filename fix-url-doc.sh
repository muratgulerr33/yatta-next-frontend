#!/bin/bash
# === YATTA URL .md OTOMATIK DÜZELT + COMMIT/PUSH + TEST ===

set -euo pipefail

cd /home/yatta/apps/frontend

echo "→ 1/6: docs klasörü ve izinler"

mkdir -p ./docs

chown -R yatta:yatta ./docs 2>/dev/null || true

chmod 755 ./docs

echo "→ 2/6: URL dosyasını bul ve 'docs/URL-Yapimiz-(Kasim-2025).md' konumuna al (uzantı + ASCII)"

FILE_CANDIDATE=$(find . -maxdepth 3 -type f -iregex ".*/url.*yap.*kas.*2025.*" | head -n 1 || true)

DIR_CANDIDATE=$(find . -maxdepth 3 -type d -iregex ".*/url.*yap.*kas.*2025.*" | head -n 1 || true)

if [ -n "${FILE_CANDIDATE:-}" ]; then

  echo "   • Dosya bulundu: $FILE_CANDIDATE"

  mv "$FILE_CANDIDATE" "./docs/URL-Yapimiz-(Kasim-2025).md"

elif [ -n "${DIR_CANDIDATE:-}" ]; then

  echo "   • Klasör bulundu: $DIR_CANDIDATE"

  INSIDE_FILE=$(find "$DIR_CANDIDATE" -maxdepth 1 -type f | head -n 1 || true)

  if [ -n "${INSIDE_FILE:-}" ]; then

    mv "$INSIDE_FILE" "./docs/URL-Yapimiz-(Kasim-2025).md"

    rmdir "$DIR_CANDIDATE" 2>/dev/null || true

  else

    echo "   • Klasörde dosya yok → boş .md oluşturuluyor (içeriği Cursor'dan yapıştırman gerekir)"

    : > "./docs/URL-Yapimiz-(Kasim-2025).md"

  fi

elif [ -f "./docs/URL-Yapimiz-(Kasim-2025).md" ]; then

  echo "   • Zaten doğru yerde."

else

  echo "   • Aday bulunamadı → boş .md oluşturuluyor (içeriği Cursor'dan yapıştırman gerekir)"

  : > "./docs/URL-Yapimiz-(Kasim-2025).md"

fi

echo "→ 3/6: Sahiplik/izinler"

chown yatta:yatta "./docs/URL-Yapimiz-(Kasim-2025).md" 2>/dev/null || true

chmod 644 "./docs/URL-Yapimiz-(Kasim-2025).md"

ls -l "./docs/URL-Yapimiz-(Kasim-2025).md" || true

head -n 3 "./docs/URL-Yapimiz-(Kasim-2025).md" || true

echo "→ 4/6: Git commit & push (main)"

git checkout main

git pull origin main

git add "./docs/URL-Yapimiz-(Kasim-2025).md" || true

git commit -m "docs: URL Yapımız (Kasım 2025) dokümanı eklendi" || echo "   • Commit edecek değişiklik yok."

git push origin main || true

echo "→ 5/6: Webhook/Next logları (son 50/100 satır)"

journalctl -u yatta-webhook.service -n 50 --no-pager || true

journalctl -u yatta-next.service -n 100 --no-pager || true

echo "→ 6/6: HTTP testleri (200/301 beklenir)"

curl -Is https://yatta.com.tr/ | head -n 1 || true

curl -Is https://yatta.com.tr/robots.txt | head -n 1 || true

curl -Is https://yatta.com.tr/KIRALAMA/ | sed -n '1p;/^location:/Ip' || true

curl -Is "https://yatta.com.tr/kiralama?utm_source=test&gclid=abc" | sed -n '1p;/^location:/Ip' || true

echo "✓ Bitti. Eğer dosya boş oluşturulduysa, Cursor'daki içeriği 'docs/URL-Yapimiz-(Kasim-2025).md' içine yapıştır ve bu bloğu tekrar çalıştır."

# === /SON ===

