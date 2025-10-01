# AniDojo - Frontend Only

Your ultimate anime tracking and discovery platform built with Next.js 15, React 19, and Tailwind CSS.

## Features

- **Browse Anime**: Discover popular anime with detailed information
- **Modern UI**: Clean, responsive design with dark theme
- **Mock Data**: Pre-loaded with sample anime data for demonstration
- **TypeScript**: Fully type-safe development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling

## Tech Stack

- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Zustand** - State management (ready for future features)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── browse/         # Browse anime page
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── Navbar.tsx     # Navigation component
│   └── Providers.tsx  # App providers
└── lib/               # Utility functions and data
    ├── mockData.ts    # Sample anime data
    └── utils.ts       # Helper utilities
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

The app uses mock data located in `src/lib/mockData.ts`. You can easily modify this file to add more anime or change the existing data structure.

## Deployment

This is a frontend-only application that can be deployed to any static hosting service:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **GitHub Pages**
- **AWS S3 + CloudFront**

## Future Enhancements

This frontend is designed to be easily extended with backend functionality:

- User authentication
- Database integration
- Real-time features
- API endpoints
- User profiles and tracking