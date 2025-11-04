# Rollback Script
# Production deploy sonrası sorun olursa rollback için kullanılır

#!/bin/bash
set -e

echo "=== ROLLBACK SCRIPT ==="
echo ""

# Git commit hash'i al (geri dönülecek commit)
if [ -z "$1" ]; then
    echo "Usage: $0 <commit-hash>"
    echo "Example: $0 abc123def456"
    exit 1
fi

ROLLBACK_COMMIT=$1
CURRENT_DIR=$(pwd)
FRONTEND_DIR="/home/yatta/apps/frontend"

cd "$FRONTEND_DIR"

# Mevcut commit'i kaydet
CURRENT_COMMIT=$(git rev-parse HEAD)
echo "Current commit: $CURRENT_COMMIT"
echo "Rolling back to: $ROLLBACK_COMMIT"
echo ""

# Backup oluştur
echo "📦 Creating backup..."
BACKUP_DIR="/home/yatta/apps/frontend_backup_$(date +%Y%m%d_%H%M%S)"
cp -r "$FRONTEND_DIR" "$BACKUP_DIR"
echo "Backup created: $BACKUP_DIR"
echo ""

# Git checkout
echo "🔄 Rolling back git..."
git fetch origin
git checkout "$ROLLBACK_COMMIT" || {
    echo "❌ Failed to checkout commit $ROLLBACK_COMMIT"
    exit 1
}
echo ""

# Dependencies install
echo "📦 Installing dependencies..."
npm ci
echo ""

# Build
echo "🔨 Building..."
npm run build
if [ ! -d ".next/standalone" ]; then
    echo "❌ Build failed"
    echo "Restoring previous version..."
    git checkout "$CURRENT_COMMIT"
    exit 1
fi
echo ""

# Servis restart
echo "🔄 Restarting services..."
sudo systemctl restart yatta-next
sleep 3

# Health check
echo "🏥 Health check..."
if curl -sf http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Health check passed"
else
    echo "❌ Health check failed - restoring previous version..."
    git checkout "$CURRENT_COMMIT"
    npm ci
    npm run build
    sudo systemctl restart yatta-next
    exit 1
fi

echo ""
echo "✅ Rollback completed successfully"
echo "Previous commit: $CURRENT_COMMIT"
echo "Current commit: $(git rev-parse HEAD)"

