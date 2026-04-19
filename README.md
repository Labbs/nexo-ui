# Nexo UI

Frontend for Nexo — a self-hosted alternative to Notion, built with React and TypeScript.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Nexo backend running

### Installation

```bash
pnpm install

# Generate TypeScript types from OpenAPI spec
pnpm run generate:api
```

### Development

```bash
pnpm run dev
```

App available at `http://localhost:5173`.

### Build

```bash
pnpm run build
```

Output in `dist/` — served as static files embedded in the Go binary.

---

## Configuration

All variables are prefixed `VITE_` and must be set at **build time** (Vite inlines them).
Create a `.env.local` for local overrides (never commit it).

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | *(dev: `http://127.0.0.1:8080/api/v1`, prod: `/api/v1`)* | Full base URL of the backend API. Set this in production if the API lives on a different origin than the frontend (e.g. `https://api.example.com/api/v1`). |
| `VITE_COLLAB_WS_URL` | *(auto-detected from page protocol)* | WebSocket URL for real-time collaboration. Auto-resolves to `wss://` when the page is served over HTTPS, `ws://` over HTTP. Override if needed: `wss://api.example.com/ws/collab` |

### `.env` files

| File | Purpose |
|------|---------|
| `.env` | Committed defaults (no secrets) |
| `.env.local` | Local overrides — gitignored |
| `.env.production` | Production build values |

Example `.env.production`:

```env
VITE_API_URL=https://api.example.com/api/v1
VITE_COLLAB_WS_URL=wss://api.example.com/ws/collab
```

Example `.env.local` (local dev against a non-default port):

```env
VITE_API_URL=http://127.0.0.1:9000/api/v1
VITE_COLLAB_WS_URL=ws://127.0.0.1:9000/ws/collab
```

---

## Tech Stack

- **React 18** + TypeScript
- **Vite** — build tool
- **TailwindCSS v4** — styling
- **Radix UI** — accessible primitives
- **TanStack Query** — server state
- **Axios** — HTTP client
- **React Router v7** — routing
- **Y.js** + `y-websocket` — real-time collaboration

## Project Structure

```
src/
├── api/              # Axios client + generated types
├── components/       # Shared components
│   ├── ui/           # Design-system primitives
│   ├── editor/       # Rich text and database editors
│   └── error-boundary.tsx
├── contexts/         # React contexts (Auth, Space, Theme…)
├── hooks/            # Custom hooks
├── lib/              # Utilities (formula evaluator, query client…)
├── pages/            # Route-level components
└── main.tsx
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Dev server with HMR |
| `pnpm build` | Production build |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | ESLint |
| `pnpm generate:api` | Regenerate TypeScript types from `spec/api-spec.json` |

## License

MIT
