# Nexo UI

Alternative web application to Notion, built with React and TypeScript.

## Features

- **Authentication**: Login and registration with JWT
- **Dual Sidebar Layout** (Slack-style):
  - Left sidebar with space icons for quick switching
  - Main sidebar with documents and favorites
  - Fully responsive (mobile-optimized header + overlay)
- **Spaces Management**:
  - Visual space icons with custom colors
  - One-click space switching
  - Create/manage multiple workspaces
- **Documents**: Hierarchical document organization
- **Favorites**: Quick access to favorite documents
- **Dark Mode**: System-aware theme with manual toggle
- **Rich Text Editor**: Powered by Tiptap (MIT license)

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS v4
- **UI Components**: Radix UI
- **State Management**: TanStack Query
- **HTTP Client**: Axios
- **Editor**: Tiptap
- **Icons**: Lucide React
- **Routing**: React Router v7

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://127.0.0.1:8080`

### Installation

```bash
# Install dependencies
npm install

# Generate TypeScript types from OpenAPI spec
npm run generate:api
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
npm run build
```

The built files will be in the `dist/` directory, ready to be embedded in the Go binary.

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run generate:api` - Generate TypeScript types from OpenAPI spec

## Project Structure

```
src/
├── api/              # API client and generated types
├── components/       # React components
│   ├── ui/          # Reusable UI components (Button, Input, Dialog, Tooltip, etc.)
│   ├── layout/      # Layout components
│   │   ├── main-layout.tsx       # Responsive double sidebar layout
│   │   ├── spaces-sidebar.tsx    # Left sidebar with space icons
│   │   ├── sidebar.tsx           # Main sidebar with docs/favorites
│   │   └── mobile-header.tsx     # Mobile-only header
│   └── spaces/      # Space-related components
│       ├── space-icon.tsx        # Reusable space icon
│       ├── space-switcher.tsx    # Space dropdown (mobile)
│       └── create-space-modal.tsx # Create space modal
├── contexts/        # React contexts (Auth, Space, Theme)
├── hooks/           # Custom React hooks
│   ├── use-media-query.ts        # Responsive breakpoint detection
│   ├── use-spaces.ts             # Space management
│   ├── use-documents.ts          # Document operations
│   └── use-favorites.ts          # Favorites management
├── pages/           # Page components
├── lib/             # Utilities
└── main.tsx         # Application entry point
```

## API Integration

The application communicates with a Go backend API. The API specification is located in `spec/api-spec.json`.

TypeScript types are automatically generated from the OpenAPI spec using `openapi-typescript`.

## Configuration

- **API Base URL**: Configured in `vite.config.ts` (proxy to `/api`)
- **Theme**: System-aware with manual toggle
- **Authentication**: JWT stored in localStorage

## License

MIT
