# iMe - Personal Life Management App

## Overview
iMe is a comprehensive personal assistant application with four main features: schedule management, health tracking, finance management, and discovery/recommendations. The app is designed with a warm, nature-inspired color palette and mobile-first interface.

## Architecture
- **Frontend**: React + TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Express.js with in-memory storage
- **Auth**: Passport.js local strategy
- **Routing**: wouter
- **State**: TanStack React Query
- **Mobile**: Capacitor integration prepared

## Design System
- **Color Palette**: Oatmeal Beige + Soft Clay + Sage Green
  - Background: `#e6e8d4` (light sage)
  - Cards: `#f0ede4` (oatmeal beige)
  - Primary accent: `#7d9b6f` (sage green)
  - Secondary accent: `#c4a882` (soft clay)
  - Dark text: `#3d3d2e` (olive charcoal)
  - Muted text: `#8a8a72`
  - Progress/borders: `#d8d5c8`
- **Style**: Rounded cards (2xl), clean shadows, mobile-app-like interface
- **Typography**: Clean sans-serif, large headings, readable body text

## Project Structure
```
client/src/
  pages/        - Main app pages (dashboard, schedule, health, finance, discovery, auth)
  components/   - Reusable UI components
    dashboard/  - Dashboard widgets (stat-card, health-tracker, schedule-list, etc.)
    charts/     - Chart components (health-chart, finance-chart)
    ui/         - shadcn/ui components + sidebar
  hooks/        - Custom hooks (use-auth, use-events, use-health, use-finance)
  lib/          - Utilities (queryClient, protected-route)
server/
  routes.ts     - API endpoints
  storage.ts    - In-memory storage implementation
  auth.ts       - Authentication setup
shared/
  schema.ts     - Drizzle schema + Zod validation types
```

## Key Commands
- `npm run dev` - Start development server
- `npm run db:push` - Push schema changes to database

## Monetization
- Stripe integration packages installed (stripe, @stripe/stripe-js, @stripe/react-stripe-js)
- Awaiting Stripe API keys for full implementation
