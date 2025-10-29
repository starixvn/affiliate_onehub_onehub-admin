# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Admin dashboard UI built with React 19, Vite, TanStack Router, and ShadcnUI. Features include RTL support, light/dark themes, responsive design, and accessibility-first approach.

**Package Manager**: `pnpm` (always use pnpm, never npm or yarn)

## Development Commands

```bash
# Development
pnpm dev                # Start dev server (http://localhost:5173)

# Building
pnpm build              # TypeScript check + production build

# Code Quality
pnpm lint               # ESLint check
pnpm format:check       # Prettier check
pnpm format             # Auto-format with Prettier
pnpm knip               # Find unused files/exports/dependencies

# Preview
pnpm preview            # Preview production build
```

## Architecture Overview

### Tech Stack
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite (with SWC for fast compilation)
- **Routing**: TanStack Router (file-based, auto code-splitting enabled)
- **Styling**: Tailwind CSS v4 + ShadcnUI components
- **State Management**:
  - Zustand for global client state (auth)
  - TanStack Query for server state
- **Forms**: React Hook Form + Zod validation

### Directory Structure

```
src/
├── assets/           # Brand icons, custom icons, logos
├── components/       # Shared components
│   ├── ui/           # ShadcnUI base components (some customized for RTL)
│   ├── layout/       # Layout components (sidebar, header, nav)
│   └── ...           # Other shared components
├── context/          # React Context providers (theme, direction, font, layout, search)
├── features/         # Feature modules (organized by domain)
│   ├── auth/         # Authentication pages & components
│   ├── dashboard/    # Dashboard page
│   ├── tasks/        # Tasks management
│   ├── users/        # User management
│   └── settings/     # Settings pages
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── routes/           # TanStack Router route files
├── stores/           # Zustand stores (global state)
└── styles/           # Global styles
```

### Key Architectural Patterns

**1. Feature Module Pattern**
Each feature is self-contained with its own components, data schemas, and provider:
```
features/tasks/
├── components/       # Feature-specific components
├── data/            # Data schemas, mock data, types
└── index.tsx        # Main feature component
```

**2. Provider Pattern**
Features use dedicated providers for isolated state management:
- `TasksProvider`, `UsersProvider` wrap feature components
- Access state via React Context within feature boundaries

**3. Layout System**
- `AuthenticatedLayout` wraps authenticated routes
- Configurable sidebar variants: default, floating, inset
- Configurable layouts: default, compact, full
- RTL support via `DirectionProvider`
- Theme support (light/dark) via `ThemeProvider`

**4. Routing with TanStack Router**
- File-based routing in `src/routes/`
- Routes auto-generated to `routeTree.gen.ts`
- Route context includes `queryClient` for data fetching
- Layout routes use `<Outlet />` for nested rendering

**5. Data Fetching**
- TanStack Query handles server state
- Global error handling in QueryClient config (`main.tsx`):
  - 401 → redirect to sign-in
  - 500 → redirect to error page
  - Auto-retry disabled in dev, max 3 retries in prod
- Mutations use centralized error handling via `handleServerError`

**6. Global State**
- Zustand stores in `src/stores/`
- `useAuthStore` manages authentication state (user, access token)
- Cookies for persistence via custom `cookies.ts` utilities

### Path Aliases
- `@/` → `src/` (configured in tsconfig.json and vite.config.ts)

## Important Notes

### ShadcnUI Customizations
Some components have been modified for RTL support and other enhancements:

**Modified Components** (general updates):
- scroll-area, sonner, separator

**RTL Updated Components** (specific RTL changes):
- alert-dialog, calendar, command, dialog, dropdown-menu, select, table, sheet, sidebar, switch

⚠️ **When updating components**: Use `npx shadcn@latest add <component>` carefully. RTL-updated components can be safely updated if RTL is not needed. Modified components may require manual merging.

### RTL Support
- Managed by `DirectionProvider` context
- Direction state persisted via cookies
- Test with RTL languages (Arabic, Hebrew) to verify layout

### Theme System
- Light/dark mode via `ThemeProvider`
- System theme detection supported
- Custom theme configuration in `config-drawer.tsx`

### Development Workflow
1. Create new features in `src/features/<feature-name>/`
2. Add routes in `src/routes/` (file-based routing)
3. Use existing patterns: providers, data schemas, table components
4. Leverage shared components from `src/components/`
5. Always run `pnpm lint` and `pnpm format` before committing

### Authentication
- Mock auth flow available in `src/stores/auth-store.ts`
- Access token stored in cookies as JSON string
- Custom authentication implementation using Zustand + cookies

## Comment Policy
- ❌ Do not add any comments
- ❌ Do not add explanatory text
- ✅ Code should be clear and readable with self-documenting variable and function names
- ✅ Only add comments for extremely complex logic

### Performance Optimization Hooks
**Avoid premature optimization:**
- ❌ Do NOT use `useCallback` without specific performance reasons
- ❌ Do NOT use `useMemo` without specific performance reasons
- ✅ Only use them when there's a documented performance issue
- ✅ Prefer simple, readable code over optimization