# Pre-deploy Health Check Script
# Bu script production deploy öncesi sistem sağlığını kontrol eder

#!/bin/bash
set -e

echo "=== PRE-DEPLOY HEALTH CHECK ==="
echo ""

# Renkler
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Kontrol fonksiyonu
check_service() {
    local service_name=$1
    local service_status=$(systemctl is-active $service_name 2>/dev/null || echo "unknown")
    
    if [ "$service_status" = "active" ]; then
        echo -e "${GREEN}✅${NC} $service_name: active"
        return 0
    else
        echo -e "${RED}❌${NC} $service_name: $service_status"
        return 1
    fi
}

check_endpoint() {
    local url=$1
    local name=$2
    
    if curl -sf "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅${NC} $name: accessible"
        return 0
    else
        echo -e "${RED}❌${NC} $name: not accessible"
        return 1
    fi
}

# Servis kontrolleri
echo "📦 Checking services..."
check_service "yatta-next" || SERVICE_ERROR=true
check_service "yatta-backend" || SERVICE_ERROR=true
check_service "yatta-webhook" || SERVICE_ERROR=true
check_service "nginx" || SERVICE_ERROR=true
echo ""

# Endpoint kontrolleri
echo "🌐 Checking endpoints..."
check_endpoint "http://localhost:3000" "Next.js (localhost)" || ENDPOINT_ERROR=true
check_endpoint "http://localhost:8000/health/ping" "Backend API (localhost)" || ENDPOINT_ERROR=true
check_endpoint "https://yatta.com.tr/health" "Frontend (production)" || ENDPOINT_ERROR=true
check_endpoint "https://api.yatta.com.tr/health/ping" "Backend API (production)" || ENDPOINT_ERROR=true
echo ""

# Disk alanı kontrolü
echo "💾 Checking disk space..."
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -lt 90 ]; then
    echo -e "${GREEN}✅${NC} Disk usage: ${DISK_USAGE}%"
else
    echo -e "${RED}❌${NC} Disk usage: ${DISK_USAGE}% (critical)"
    DISK_ERROR=true
fi
echo ""

# Memory kontrolü
echo "🧠 Checking memory..."
MEM_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100}')
if [ "$MEM_USAGE" -lt 90 ]; then
    echo -e "${GREEN}✅${NC} Memory usage: ${MEM_USAGE}%"
else
    echo -e "${YELLOW}⚠️${NC} Memory usage: ${MEM_USAGE}% (high)"
fi
echo ""

# Build kontrolü
echo "🔨 Checking build..."
if [ -d "/home/yatta/apps/frontend/.next/standalone" ]; then
    echo -e "${GREEN}✅${NC} Build artifacts found"
else
    echo -e "${RED}❌${NC} Build artifacts not found"
    BUILD_ERROR=true
fi
echo ""

# Sonuç
echo "=== HEALTH CHECK SUMMARY ==="
if [ "$SERVICE_ERROR" = true ] || [ "$ENDPOINT_ERROR" = true ] || [ "$DISK_ERROR" = true ] || [ "$BUILD_ERROR" = true ]; then
    echo -e "${RED}❌ Health check failed${NC}"
    echo "Please fix the errors above before deploying."
    exit 1
else
    echo -e "${GREEN}✅ All checks passed${NC}"
    echo "System is ready for deployment."
    exit 0
fi

