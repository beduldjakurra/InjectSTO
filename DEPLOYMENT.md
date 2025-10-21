# Deployment Guide

## GitHub Pages Deployment

This application is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Automatic Deployment

Every push to the `main` branch triggers the deployment workflow:

1. The workflow installs Node.js and project dependencies
2. Builds the Next.js application as a static export
3. Copies PWA assets from the `public/` directory
4. Deploys to GitHub Pages

### GitHub Pages Setup

1. Go to your repository settings
2. Navigate to "Pages" section
3. Under "Build and deployment":
   - Source: Select "GitHub Actions"
4. The workflow will automatically deploy on the next push to `main`

### Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public/` directory with your domain
2. Configure DNS with your domain provider:
   ```
   Type: CNAME
   Name: www (or your subdomain)
   Value: yourusername.github.io
   ```
3. In repository settings > Pages, add your custom domain

### Base Path Configuration

If deploying to a subdirectory (e.g., `https://yourusername.github.io/InjectSTO/`):

1. Edit `next.config.js`:
   ```javascript
   basePath: '/InjectSTO',
   assetPrefix: '/InjectSTO/',
   ```
2. Commit and push changes

## Manual Deployment

### Build Locally

```bash
npm install
npm run build
```

The build output will be in the `out/` directory.

### Deploy to Other Platforms

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Run: `netlify deploy --prod --dir=out`

#### Static Hosting
Upload the contents of `out/` directory to any static hosting provider.

## Environment Variables

### For GitHub Actions

Set secrets in repository settings:
1. Go to Settings > Secrets and variables > Actions
2. Add the following (if using Supabase):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### For Local Development

Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
# Edit .env.local with your values
```

## Troubleshooting

### Build Fails

1. **Missing dependencies**: Run `npm install`
2. **TypeScript errors**: Check `npm run lint`
3. **Out of memory**: Increase Node memory:
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" npm run build
   ```

### Deployment Fails

1. Check GitHub Actions logs in the "Actions" tab
2. Ensure GitHub Pages is enabled in repository settings
3. Verify workflow permissions (Settings > Actions > General > Workflow permissions)

### PWA Not Installing

1. Ensure HTTPS is enabled (required for PWA)
2. Check `manifest.json` is accessible
3. Verify Service Worker is registered (check browser console)
4. Clear browser cache and try again

## Performance Optimization

### Image Optimization

Images are unoptimized for static export. Consider:
- Pre-optimizing images before deployment
- Using WebP format
- Implementing lazy loading

### Caching Strategy

Service Worker caches:
- Static assets (CSS, JS)
- Images and fonts
- API responses (if applicable)

Update cache version in `public/sw.js` when deploying major changes.

## Monitoring

### Analytics (Optional)

Add analytics by including tracking code in `src/app/layout.tsx`:

```typescript
// Google Analytics example
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

### Error Tracking

Consider adding error tracking service like Sentry for production monitoring.

## Security

### Content Security Policy

Add security headers in production:
- Use HTTPS only
- Set appropriate CSP headers
- Enable HSTS

### API Keys

- Never commit API keys to the repository
- Use environment variables
- Rotate keys regularly
- Use different keys for development and production

## Support

For deployment issues:
1. Check GitHub Actions logs
2. Review this documentation
3. Open an issue on GitHub with deployment logs