/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://yatta.com.tr',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [
    '/api/*',
    '/_next/*',
    '/health/*',
    '/status/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/', '/health/', '/status/'],
      },
    ],
    additionalSitemaps: [],
  },
  // Canonical URL'ler otomatik olarak siteUrl + pathname olarak oluşturulur
  // Her sayfa için lastmod, changefreq, priority ayarları
  transform: async (config, path) => {
    // Default priority ve changefreq
    let priority = 0.7
    let changefreq = 'weekly'

    // Önemli sayfalar için yüksek priority
    if (path === '/yakindayiz') {
      priority = 1.0
      changefreq = 'daily'
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    }
  },
}

