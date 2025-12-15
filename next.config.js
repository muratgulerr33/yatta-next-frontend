/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cross-origin request için local network IP'lerine izin ver
  allowedDevOrigins: [
    '127.0.0.1',
    'localhost',
    '192.168.1.26', // Senin local IP'n
  ],
  // Use standalone output to produce .next/standalone for production
  // Local build için NEXT_CONFIG_OUTPUT=standard ile devre dışı bırakılabilir
  ...(process.env.NEXT_CONFIG_OUTPUT !== 'standard' && { output: 'standalone' }),
  // Trailing slash'i middleware'de handle edeceğiz, Next.js'in kendi redirect'ini devre dışı bırak
  trailingSlash: false,
  
  // Cache & Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // ISR (Incremental Static Regeneration) configuration
  experimental: {
    staleTimes: {
      default: 3600, // 1 saat
    },
    // Build cache optimizasyonu - build süresini kısaltır
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
  
  // Build cache optimizasyonu - değişmeyen dosyaları yeniden build etmez
  // Not: swcMinify Next.js 15'te varsayılan olarak aktif, eklemeye gerek yok
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production', // Production'da console.log'ları kaldır
  },
  
  // Bundle analyzer (opsiyonel - ANALYZE=true npm run build:analyze)
  // Not: ESM formatında require kullanılamaz, bu özellik şimdilik devre dışı
  // İhtiyaç duyulduğunda dynamic import ile eklenebilir
  // ...(process.env.ANALYZE === 'true' && {
  //   webpack: async (config, { isServer }) => {
  //     if (!isServer) {
  //       const { BundleAnalyzerPlugin } = await import('webpack-bundle-analyzer')
  //       config.plugins.push(
  //         new BundleAnalyzerPlugin({
  //           analyzerMode: 'static',
  //           openAnalyzer: false,
  //           reportFilename: '../.next/analyze/client.html',
  //         })
  //       )
  //     }
  //     return config
  //   },
  // }),
  
  // Image optimization
  // Media base URL'den türetilen config
  // Tek gerçek media origin: NEXT_PUBLIC_MEDIA_BASE_URL (default: https://api.yatta.com.tr)
  // Local dev: http://127.0.0.1:8000, Production: https://api.yatta.com.tr
  ...(function() {
    const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || 'https://api.yatta.com.tr';
    const mediaUrl = new URL(mediaBase);
    
    // Local IP kontrolü: sadece 127.0.0.1 veya localhost için true
    const isLocalIp =
      mediaUrl.hostname === '127.0.0.1' ||
      mediaUrl.hostname === 'localhost';
    
    return {
      images: {
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
        deviceSizes: [640, 750, 828, 1080, 1200, 1500, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 500],
        // Local IP'ye izin ver: sadece localhost/127.0.0.1 için true, prod'da false (güvenlik)
        dangerouslyAllowLocalIP: isLocalIp,
        // Remote patterns: tek kaynak - mediaBase + /media/**
        remotePatterns: [
          {
            protocol: mediaUrl.protocol.replace(':', ''), // 'http' veya 'https'
            hostname: mediaUrl.hostname,                  // '127.0.0.1' veya 'api.yatta.com.tr'
            port: mediaUrl.port || '',                    // localde '8000', prod'da ''
            pathname: '/media/**',
          },
        ],
      },
    };
  })(),
  
  // Redirects - Next.js'in 308 redirect'lerini 301'e çevirmek için
  async redirects() {
    // Bu fonksiyon Next.js'in base server normalizasyonundan ÖNCE çalışır
    // Bu yüzden burada trailing slash ve case normalization için redirect yapmıyoruz
    // Middleware'de handle edeceğiz, burada sadece özel durumlar için redirect eklenebilir
    return [];
  },
  
  // Headers for cache control and security
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/image/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/favicon.ico',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400',
          },
        ],
      },
      // Security headers (middleware'de de var ama burada da eklenebilir)
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

export default nextConfig

