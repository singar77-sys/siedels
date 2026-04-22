# Deployment Guide - Siedels Barbershop

## Project Structure

```
siedels/
├── src/                           # Next.js app source code
│   └── app/                       # App Router structure
│       ├── layout.tsx             # Root layout with metadata
│       ├── page.tsx               # Home page
│       ├── globals.css            # Global styles with Tailwind
│       └── favicon.ico
├── public/                        # Static assets
│   └── images/                    # Image assets
├── docs/                          # Documentation & materials
│   ├── campaigns/                 # Campaign plans & strategies
│   ├── design/                    # Design references
│   └── research/                  # SEO & research materials
├── scripts/                       # Utility scripts
├── node_modules/                  # Dependencies
├── .gitignore                     # Git ignore rules
├── .env.example                   # Environment template
├── vercel.json                    # Vercel deployment config
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── postcss.config.mjs             # PostCSS configuration
├── eslint.config.mjs              # ESLint configuration
└── package.json                   # Dependencies & scripts

```

## Technology Stack

- **Framework**: Next.js 16.2.0 (App Router)
- **UI Library**: React 19.2.4
- **Styling**: Tailwind CSS 4 with PostCSS
- **Language**: TypeScript 5
- **Compiler**: Babel React Compiler for optimization
- **Linting**: ESLint 9

## Deployment to Vercel

### Prerequisites
1. Code pushed to GitHub/GitLab/Bitbucket
2. Vercel account created
3. Project connected to Vercel

### Quick Deploy Steps

1. **Connect Repository**
   - Visit https://vercel.com/new
   - Select your GitHub repository
   - Click "Import"

2. **Configure Environment**
   - Add any environment variables from `.env.example`
   - Leave defaults if not needed

3. **Deploy**
   - Vercel will automatically detect Next.js
   - Build will run: `npm install && next build`
   - Site will be live at `<project-name>.vercel.app`

### Environment Variables

- `GOOGLE_SHEET_ID` — overrides the default team-schedule sheet ID used
  by `src/lib/schedule.ts`. Optional; a fallback sheet ID is hardcoded.

No other env vars are required; shop contact info, team, services, and
hours all live in `src/data/shop.ts`.

## Build & Local Development

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

### Production Server
```bash
npm start
```

### Linting
```bash
npm run lint
```

## Performance Optimizations

- ✅ React Compiler enabled (Babel plugin)
- ✅ Tailwind CSS 4 with optimized bundle
- ✅ Next.js 16 with latest optimizations
- ✅ Security headers configured
- ✅ TypeScript for type safety

## Security Headers

Configured in `vercel.json`:
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block

## Troubleshooting

### Build Fails
- Run `npm install` locally and test with `npm run build`
- Check for TypeScript errors: `npm run lint`
- Review Vercel build logs

### Styling Issues
- Ensure Tailwind classes are used correctly
- Check `globals.css` is imported in layout
- Rebuild with `npm run build`

### Environment Variables Not Loading
- Verify variable names in `.env.example`
- Check Vercel project settings for correct values
- Prefix with `NEXT_PUBLIC_` for client-side variables

## Documentation Files

Research and planning materials are in `docs/`:
- **campaigns/**: Campaign plans and SEO strategies
- **design/**: Design sketches and brand guidelines
- **research/**: Market research and SEO mapping

## Next Steps

1. Push code to GitHub
2. Connect to Vercel
3. Deploy! 🚀
4. Monitor performance at https://vercel.com/dashboard

