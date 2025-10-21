# PT Fuji Seat Indonesia - STO PWA Application

Production tracking and stock management Progressive Web Application (PWA) for PT Fuji Seat Indonesia's Injection Division.

## Features

- 📱 **Progressive Web App** - Install and use offline
- 📊 **Production Tracking** - Real-time stock and production data
- 📦 **Box Calculation** - Automated box quantity calculations
- 💪 **Stock Strength Analysis** - Monitor stock levels and forecasts
- 🌓 **Day/Night Shift Mode** - Separate data tracking for shifts
- 📤 **Excel Import/Export** - Easy data management
- 📸 **Share as Image** - Export reports as JPG
- 🔄 **Auto-sync** - Supabase integration for data synchronization (optional)

## Tech Stack

- **Framework**: Next.js 15 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **State Management**: Zustand
- **Database**: Supabase (optional)
- **PWA**: Service Workers, Web App Manifest

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/beduldjakurra/InjectSTO.git
cd InjectSTO
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Configure Supabase:
   - Copy `.env.example` to `.env.local`
   - Add your Supabase credentials

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

This creates an optimized static export in the `out/` directory.

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch.

### GitHub Actions Workflow

The workflow:
1. Installs Node.js and dependencies
2. Builds the Next.js application
3. Copies PWA static assets
4. Deploys to GitHub Pages

See `.github/workflows/deploy-pages.yml` for details.

### Manual Deployment

To deploy manually:

```bash
npm run build
# Deploy the 'out/' directory to your hosting provider
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── production/   # Production tracking components
│   │   ├── ui/          # shadcn/ui components
│   │   └── auth/        # Authentication components
│   ├── lib/             # Utility libraries
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript types
│   └── constants/       # App constants
├── public/              # Static assets & PWA files
│   ├── index.html       # Standalone PWA (legacy)
│   ├── manifest.json    # PWA manifest
│   ├── sw.js           # Service Worker
│   └── icons/          # App icons
├── .github/
│   └── workflows/       # GitHub Actions
└── [config files]       # Various configuration files
```

## Environment Variables

See `.env.example` for required environment variables. Supabase is optional - the app works without it using local storage.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Copyright © 2025 PT Fuji Seat Indonesia. All rights reserved.

## Support

For issues or questions, please open an issue on GitHub.
