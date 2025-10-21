/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Note: API routes (/api/*) won't work with static export
  // The app primarily uses the static PWA in public/ folder
  
  // Configure base path if deploying to a subdirectory
  // Uncomment and adjust if not deploying to root domain
  // basePath: '/InjectSTO',
  // assetPrefix: '/InjectSTO/',
}

module.exports = nextConfig
