# iMe - Personal Life Management App

## Overview
iMe is a comprehensive personal assistant application with five main sections: dashboard, schedule management, health tracking, finance management, and discovery/recommendations. Built with a warm, nature-inspired color palette and a mobile-first interface.

## Architecture
- **Frontend**: React + TypeScript, Vite, shadcn/ui (all inline styles, not Tailwind classes)
- **Backend**: Express.js with in-memory storage (MemStorage)
- **Auth**: Passport.js local strategy with bcrypt password hashing
- **Routing**: wouter
- **State**: TanStack React Query v5
- **Database**: PostgreSQL schema defined (Neon endpoint disabled, using MemStorage)

## Design System
- **Color Palette**: Oatmeal Beige + Soft Clay + Sage Green (all inline styles)
  - Background: `#e6e8d4` (light sage)
  - Cards: `#f0ede4` (oatmeal beige)
  - Primary accent: `#7d9b6f` (sage green)
  - Secondary accent: `#c4a882` (soft clay)
  - Dark text: `#3d3d2e` (olive charcoal)
  - Muted text: `#8a8a72`
  - Borders: `#d8d5c8`
- **Style**: Rounded cards (2xl), mobile-app-like interface

## Project Structure
```
client/src/
  pages/         - dashboard, schedule, health, finance, discovery, settings, auth-page
  components/
    dashboard/   - stat-card, health-tracker, schedule-list, transactions-list, etc.
    charts/      - health-chart, finance-chart
    health/      - health-form (steps, water, sleep, calories sliders)
    finance/     - transaction-form, budget-summary
    schedule/    - event-form (with reminder dropdown)
    ui/          - shadcn components + sidebar (with Settings link)
    mobile-nav   - 6-tab mobile bottom nav (includes Settings)
    layout       - global layout with notification bell + event reminders
  hooks/
    use-auth.tsx          - Auth context, login/register/logout
    use-events.ts         - Events CRUD
    use-health.ts         - Health metrics CRUD
    use-finance.ts        - Transactions + budget categories CRUD
    use-goals.ts          - Goals get/create/update
    use-dark-mode.ts      - Dark mode toggle (applies .dark to html element)
    use-notifications.ts  - Browser notification API wrapper
    use-event-reminders.ts - Auto-schedules toast + browser notifications for events
    use-voice-commands.tsx - Accessibility voice commands
  lib/ - queryClient, protected-route
server/
  routes.ts   - All API endpoints (auth, events, health, finance, goals, budget-categories, search)
  storage.ts  - MemStorage with full CRUD for all entities
  auth.ts     - Passport.js setup
shared/
  schema.ts   - Drizzle schema + Zod types for all tables
```

## Features
- **Dashboard**: Overview cards, today's events, recent transactions, quick health stats
- **Schedule**: Monthly calendar view, event CRUD with reminder settings (5min/15min/30min/1hr/etc.)
- **Health**: Daily metrics (steps, water, sleep, calories) with progress vs. goals; weekly trends chart; insights tab
- **Finance**: Income/expense tracking, monthly budget progress bar, budget categories with per-category spending limits, transaction search
- **Discovery**: Recommendations and tips
- **Settings**: Profile editing, health/finance goals config, budget categories management, dark mode toggle, notification permissions
- **Global Search**: Searches events, transactions, recommendations from the header
- **Notification Bell**: Shows count of upcoming events (next 24h) with reminders set
- **Event Reminders**: Auto-schedules in-app toasts and browser push notifications at reminder time

## Auth
- Demo login: username `demo`, password `demo123`
- `storage.ready` Promise pattern ensures demo user init completes before requests are handled

## Key Commands
- `npm run dev` - Start development server
- `npm run db:push` - Push schema to DB (currently disabled — Neon endpoint off)

## Monetization
- Stripe packages installed; premium UI in Settings page; awaiting API keys
