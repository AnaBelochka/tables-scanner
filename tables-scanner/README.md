This project implements a **real-time token scanner dashboard** using **Next.js, TypeScript, Zustand, TanStack Table, and WebSocket integration**.

## Features
- 📊 **Two side-by-side tables**:
    - **Trending Tokens** (sorted by volume)
    - **New Tokens** (sorted by age)
- 🔌 **API integration**:
    - Initial data from REST API (`/scanner`)
    - Live updates via WebSocket (`scanner-filter`, `pair`, `pair-stats`)
- ⚡ **Performance**:
    - Virtualized rows (>1000 rows)
    - Sticky headers with synchronized column widths
- 🎨 **UI/UX**:
    - Dark theme with alternating row backgrounds
    - Right-aligned numeric columns
    - Compact number formatting (K / M / B)
    - Audit indicators (mintable, freezable, honeypot, burned, verified)
    - Social link icons (Twitter, Telegram, Discord, Website)
- 🔄 **Real-time updates**:
    - Dynamic recalculation of market cap on each tick
    - Liquidity and audit fields updated from `pair-stats` events
- 🧩 **Additional**:
    - Skeleton loaders, error states, and empty states
    - Modular architecture with reusable hooks and components

## Tech Stack
- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Zustand](https://github.com/pmndrs/zustand) for state management
- [TanStack Table](https://tanstack.com/table) + [TanStack Virtual](https://tanstack.com/virtual) for performant tables
- [TailwindCSS](https://tailwindcss.com/) for styling
- [lucide-react](https://lucide.dev/) for icons

## Running locally
```bash
npm install
npm run dev