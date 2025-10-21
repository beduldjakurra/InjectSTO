/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Configure base path if deploying to a subdirectory
  // basePath: '/InjectSTO',
  // assetPrefix: '/InjectSTO/',
}

module.exports = nextConfig
