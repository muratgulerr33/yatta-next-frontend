#!/usr/bin/env bash
set -euo pipefail

# Next.js standalone içine statikleri kopyala
mkdir -p .next/standalone/.next/static .next/standalone/public
rsync -a .next/static/ .next/standalone/.next/static/ 2>/dev/null || true
rsync -a public/ .next/standalone/public/ 2>/dev/null || true
