# Development Guidelines

## Code Quality Standards

### ESLint baseline

The project uses TypeScript-first linting with React and Hooks rules.

- Parser: `@typescript-eslint/parser`
- Extends:
  - `eslint:recommended`
  - `plugin:@typescript-eslint/recommended`
  - `plugin:react/recommended`
  - `plugin:react-hooks/recommended`
  - `prettier`

### Rule intent

- `no-unused-vars`: warning to keep signal high without blocking iteration.
- `react/react-in-jsx-scope`: off because React 17+ JSX transform does not require importing React.
- `react/prop-types`: off because TypeScript handles prop typing.
- `@typescript-eslint/no-explicit-any`: warning to encourage explicit domain types.
- `@typescript-eslint/explicit-function-return-type`: off to reduce boilerplate in component and callback code.
- Import ordering: enforced through import sorting to keep modules consistent and readable.

### Prettier baseline

Prettier is the single formatting source of truth with:

- `singleQuote: true`
- `trailingComma: all`
- `tabWidth: 2`
- `printWidth: 80`
- `semi: true`
- `bracketSpacing: true`
- `arrowParens: always`

## Performance Budgets

| Metric | Target | Notes |
| --- | --- | --- |
| Initial Bundle | 50 KB (`50_000`) | Core code required for first render |
| First Load Total | 100 KB (`100_000`) | Initial + critical chunks |
| Max Chunk Size | 30 KB (`30_000`) | Keep async chunks focused |
| Time to Interactive | 3000 ms | User can interact quickly on mobile-grade devices |
| Puzzle Generation | 100 ms | Keeps gameplay loop responsive |
| Lighthouse Score | 95 | Minimum acceptable quality bar |
| Sync Batch Size | 5 | Small IndexedDB/network write batches |
| Max Writes Per Day | 10 | Limits storage/network churn |
| Sync Interval | 30,000 ms | Background sync pacing |

## Bundle Optimization Strategy

- Vendor splitting with manual chunks:
  - `react-vendor`: `react`, `react-dom`
  - `animations`: `framer-motion`
  - `state`: `@reduxjs/toolkit`, `react-redux`
- Use lazy loading (`React.lazy` + `Suspense`) for non-critical screens and features.
- Enable gzip precompression in Vite build output.
- Keep `chunkSizeWarningLimit` at 50 KB and treat warnings as optimization opportunities.
- Generate bundle reports (`dist/bundle-analysis.html`) during analysis runs.

## Security Checklist

- Enforce CSP and security headers in `vercel.json`:
  - `Content-Security-Policy`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
- Sanitize all user-controlled text input before storage/rendering.
- Validate client-side data primitives (dates, scores, and time ranges).
- Never commit secrets to frontend code or repository history.
- Keep sensitive values in environment variables, not in client bundles.

## Testing Requirements

- Coverage thresholds are enforced at 90% for:
  - Lines
  - Functions
  - Branches
  - Statements
- Test framework: Vitest (`jsdom`, globals enabled).
- Test setup includes:
  - `@testing-library/jest-dom`
  - `fake-indexeddb/auto` for IndexedDB mocking.
- Required coverage scope:
  - Puzzle generation and validation logic
  - State transitions and reducers
  - Storage/sync behavior
  - Critical UI interaction flows
  - Input sanitization and compression helpers

## PR Review Checklist

- Lint passes with zero warnings.
- Format check passes.
- Build succeeds.
- Tests and coverage thresholds pass.
- No direct secrets or credentials in code/config.
- New features include tests and docs updates where applicable.
- Performance impact reviewed (bundle size, runtime hotspots).
- Accessibility and keyboard interaction verified for changed UI.

## Setup For New Developers

1. Install Node.js LTS (recommended 20+).
2. Install dependencies:
   - `npm install`
3. Copy environment template:
   - `cp .env.example .env`
4. Start local development server:
   - `npm run dev`
5. Before opening a PR, run:
   - `npm run lint`
   - `npm run format:check`
   - `npm run test`
   - `npm run build`

## Available npm Scripts

- `npm run dev`: Start Vite dev server.
- `npm run build`: Type-check and build production bundle.
- `npm run preview`: Preview built app locally.
- `npm run lint`: Run ESLint on TypeScript source with strict warning gate.
- `npm run lint:fix`: Auto-fix lint issues where possible.
- `npm run format`: Apply Prettier formatting.
- `npm run format:check`: Validate formatting.
- `npm run test`: Run Vitest once.
- `npm run test:watch`: Run Vitest in watch mode.
- `npm run test:coverage`: Run tests with coverage reporting.
- `npm run analyze`: Build and open bundle analysis report.
