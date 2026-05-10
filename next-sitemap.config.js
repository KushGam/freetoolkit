module.exports = {
    siteUrl: 'https://www.freetoolkitapp.com',
    generateRobotsTxt: true,
    exclude: ['/api/*', '/robots.txt', '/sitemap.xml'],
    robotsTxtOptions: {
      policies: [
        {
          userAgent: '*',
          allow: '/',
          disallow: ['/api/'],
        },
      ],
    },
  }
