# Logic Looper

Daily puzzle logic game where players solve one challenge per day, maintain streaks, and climb the leaderboard.

![Capstone](https://img.shields.io/badge/Capstone-Bluestock%20SDE-blue)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Ready-5A0FC8)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎯 Overview

Logic Looper is a daily puzzle experience built as a Capstone Project for the Bluestock Fintech SDE internship. Every day unlocks one deterministic puzzle, and players build momentum through streaks, achievements, and leaderboard progression.

The game currently supports two puzzle types:

- Number Matrix (grid-based logic puzzle)
- Sequence Solver (pattern continuation puzzle)

Core user experience highlights:

- Daily challenge loop with rotating puzzle type
- Streak tracking with current and longest streak visibility
- GitHub-style contribution heatmap for activity history
- Offline-first architecture powered by IndexedDB
- Progressive Web App (PWA) support for installability and offline play

## 🧰 Tech Stack

**Frontend**

- React 19
- TypeScript
- Vite
- Tailwind CSS v3
- Redux Toolkit
- Framer Motion
- Day.js
- Crypto-js (HMAC-SHA256)
- idb (IndexedDB)

**Backend**

- Vercel Serverless Functions
- Prisma ORM
- PostgreSQL (Neon.tech)

**Testing**

- Vitest
- React Testing Library
- fake-indexeddb

**Deployment**

- Vercel
- PWA (`manifest.json` + service worker)

## ✨ Features

- Daily puzzle generation using deterministic HMAC-SHA256 seed logic
- Two puzzle types: Number Matrix (grid-based) and Sequence Solver
- Three difficulty levels that scale with day-of-year progression
- GitHub-style contribution heatmap with 5 intensity levels
- Streak tracking for both current and longest streaks with fire animation
- Achievement system with milestone badges: 7-day streak, 30-day streak, Century, and Perfect Month
- Offline-first data model with IndexedDB as the primary store
- Smart sync strategy: batch POST to server every 5 puzzle completions
- PWA-ready experience: installable and playable offline

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation and Local Development

```bash
git clone https://github.com/<your-username>/logic-looper.git
cd logic-looper
npm install
npm run dev
```

### Optional Backend Sync Setup (Neon + Prisma)

```bash
cp .env.example .env
# Add your Neon PostgreSQL connection string as DATABASE_URL
npx prisma migrate dev --name init
```

Backend sync is optional for local puzzle play. It is required for persistent server-side leaderboard syncing.

## 📜 Available Scripts

| Script                  | Purpose                                  |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start Vite development server            |
| `npm run build`         | Type-check and build production bundle   |
| `npm run lint`          | Run ESLint checks                        |
| `npm run lint:fix`      | Auto-fix ESLint issues                   |
| `npm run format`        | Format code with Prettier                |
| `npm run format:check`  | Check formatting without writing changes |
| `npm run test`          | Run all tests with Vitest                |
| `npm run test:watch`    | Run tests in watch mode                  |
| `npm run test:coverage` | Run tests with coverage report           |
| `npm run analyze`       | Build and open bundle analysis           |
| `npm run preview`       | Preview production build locally         |

## 🗂️ Project Structure

```text
logic-looper/
├── src/
│   ├── engine/        # Puzzle generation and deterministic seed logic
│   ├── components/    # UI, puzzle views, heatmap, badges, layout
│   ├── pages/         # Home, Puzzle, Profile, Leaderboard, Settings
│   ├── db/            # IndexedDB schema and operations
│   ├── services/      # Streaks, achievements, sync
│   └── store/         # Redux Toolkit slices and middleware
├── api/               # Vercel serverless endpoints
├── prisma/            # Prisma schema and migrations
└── public/            # PWA assets (manifest, service worker, static files)
```

## 🏗️ Architecture

Logic Looper follows a client-first architecture:

- IndexedDB is the source of truth for puzzle activity and player progress
- Puzzle logic runs entirely client-side (generation, validation, scoring)
- Server only stores synced score/activity payloads for leaderboard features
- Sync is event-driven and batched, preserving offline reliability while reducing network calls

This approach keeps gameplay resilient without network dependency while still enabling competitive features.

## 🔮 Future Enhancements

- Google OAuth for persistent identity and cross-device continuity
- Additional puzzle types: Pattern Matching, Deduction Grids, and Binary Logic
- Truecaller integration
- Redis cache layer for high-throughput leaderboard reads
- Flutter mobile app reusing the same puzzle logic core

## 📄 License

This project is licensed under the MIT License.

## 🙌 Credits

Built for the **Bluestock Fintech SDE Internship** by **Team Group 23FMBF**.
