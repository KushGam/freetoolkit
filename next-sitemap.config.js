module.exports = {
    siteUrl: 'https://www.freetoolkitapp.com',
    generateRobotsTxt: true,
    exclude: ['/api/*', '/robots.txt', '/sitemap.xml'],
    additionalPaths: async (config) => [
      await config.transform(config, '/all-tools'),
    ],
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
