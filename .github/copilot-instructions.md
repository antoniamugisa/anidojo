# Copilot Instructions for AniDojo

## Project Overview
AniDojo is a frontend-only anime tracking and discovery platform built with Next.js 15 (App Router), React 19, and Tailwind CSS. It uses mock data for demonstration and is structured for easy extension with backend features in the future.

## Architecture & Structure
- **App Router**: All pages are under `src/app/`, using Next.js 15 conventions.
- **Components**: Shared React components are in `src/components/`.
- **State Management**: Zustand is included for future state needs, but most state is local or via React context.
- **Mock Data**: Anime data is loaded from `src/lib/mockData.ts`.
- **Icons**: Uses `lucide-react` for UI icons (import icons directly as needed).
- **Styling**: Tailwind CSS is used throughout, with utility classes and custom config in `tailwind.config.js`.

## Developer Workflows
- **Start Dev Server**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Type Checking**: TypeScript is enforced; fix type errors before merging.
- **Image Domains**: External images must be whitelisted in `next.config.ts` under `images.domains`.

## Conventions & Patterns
- **File Naming**: Use PascalCase for components, camelCase for hooks and utilities.
- **Icons**: Import icons from `lucide-react` (e.g., `import { Home } from 'lucide-react'`).
- **Page Structure**: Each route in `src/app/` is a folder with a `page.tsx` file.
- **Global Styles**: Defined in `src/app/globals.css`.
- **Providers**: Use `src/components/Providers.tsx` for context providers.
- **Auth**: Authentication is stubbed; see `src/app/auth/page.tsx` and `src/contexts/AuthContext.tsx`.

## Integration Points
- **Anime API**: See `src/lib/animeApi.ts` for API integration patterns (currently mock or stub).
- **External Images**: Add new domains to `next.config.ts` as needed.
- **State**: Use Zustand for global state if needed; otherwise, prefer React context or local state.

## Example Patterns
- **Component Import**:
  ```tsx
  import { Navbar } from '@/components/Navbar';
  import { Home, Search } from 'lucide-react';
  ```
- **Image Usage**:
  ```tsx
  <Image src={anime.images.jpg.large_image_url} ... />
  // Ensure domain is whitelisted in next.config.ts
  ```
- **Mock Data Access**:
  ```ts
  import mockData from '@/lib/mockData';
  ```

## Key Files & Directories
- `src/app/` - All Next.js pages/routes
- `src/components/` - Shared React components
- `src/lib/mockData.ts` - Demo anime data
- `src/lib/animeApi.ts` - API integration pattern
- `tailwind.config.js` - Tailwind customization
- `next.config.ts` - Next.js config (image domains, etc.)

## Notes
- No backend or database is present; all data is local or mocked.
- Follow Next.js 15 and React 19 conventions for new features.
- For new external images, update `next.config.ts`.

---
_If any conventions or workflows are unclear, please ask for clarification or provide feedback to improve these instructions._
