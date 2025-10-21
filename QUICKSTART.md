# 🚀 Quick Start Guide

## To Enable Automatic Deployment

### Step 1: Merge This Pull Request
Merge this PR to the `main` branch to enable the GitHub Actions workflow.

### Step 2: Configure GitHub Pages
1. Go to your repository on GitHub
2. Click on **Settings** tab
3. In the left sidebar, click **Pages**
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. Click **Save** if prompted

### Step 3: First Deployment
Once merged to `main`, the workflow will automatically:
1. Install dependencies
2. Build the React/TypeScript application
3. Deploy to GitHub Pages

**Monitor the deployment:**
- Go to the **Actions** tab in your repository
- Click on the running workflow to see progress
- Wait for all steps to complete (usually 2-3 minutes)

### Step 4: Access Your Site
After successful deployment, your site will be available at:
```
https://<your-username>.github.io/InjectSTO/
```
Or if repository is named differently:
```
https://<your-username>.github.io/<repository-name>/
```

**Note:** If deploying to a subdirectory, you'll need to update `next.config.js`:
```javascript
basePath: '/InjectSTO',
assetPrefix: '/InjectSTO/',
```

## Local Development

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```
Output will be in the `out/` directory

### Test the Build Locally
```bash
npm run build
npx serve out
```

## What Happens on Every Push to Main

1. **Trigger**: Workflow starts automatically
2. **Build**: Compiles TypeScript, bundles React, processes Tailwind CSS
3. **Export**: Creates static HTML/CSS/JS files
4. **Deploy**: Uploads to GitHub Pages
5. **Live**: Your changes are live in ~2-3 minutes!

## Troubleshooting

### Workflow Fails
Check the Actions tab for error logs. Common issues:
- Missing dependencies (check package.json)
- TypeScript errors (run `npm run lint` locally)
- Build errors (run `npm run build` locally first)

### Site Not Loading
- Wait 1-2 minutes after deployment completes
- Clear browser cache
- Check GitHub Pages settings are correct
- Verify workflow completed successfully

### PWA Not Installing
- HTTPS is required for PWA (GitHub Pages provides this)
- Check browser console for errors
- Verify manifest.json is accessible
- Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Features Available After Deployment

✅ **Progressive Web App** - Can be installed on devices
✅ **Offline Support** - Works without internet via Service Worker
✅ **Production Tracking** - Full stock management features
✅ **Excel Import/Export** - Data management tools
✅ **Day/Night Shift Mode** - Separate shift tracking
✅ **Responsive Design** - Works on all devices

## Need Help?

- 📖 See [README.md](README.md) for full documentation
- 🚀 See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment details
- 📝 See [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
- 🐛 Open an issue on GitHub if you encounter problems

## Configuration Files Summary

| File | Purpose |
|------|---------|
| `package.json` | Dependencies and build scripts |
| `tsconfig.json` | TypeScript configuration |
| `next.config.js` | Next.js build settings |
| `tailwind.config.js` | Styling configuration |
| `.github/workflows/deploy-pages.yml` | Deployment automation |

## Environment Variables (Optional)

If using Supabase for backend:
1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials
3. The app works without these (uses local storage)

For GitHub Actions deployment:
- Add secrets in Settings > Secrets and variables > Actions
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## That's It! 🎉

Your React/TypeScript PWA is now set up for automatic deployment to GitHub Pages!

Every push to `main` will trigger a new build and deploy your latest changes automatically.