# ONEHub Admin - Frontend

Modern React 19 frontend for the ONEHub Affiliate Admin system.

**Tech Stack:** React 19, Vite 7, TanStack Router, TanStack Query, Tailwind CSS v4, Zustand

[← Back to Main README](../../README.md)

---

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── assets/                    # Static assets (images, fonts, etc.)
│   ├── components/                # Reusable UI components
│   │   └── ui/                    # shadcn/ui components
│   ├── config/                    # App configuration
│   ├── context/                   # React contexts
│   ├── features/                  # Feature modules
│   │   ├── auth/                  # Authentication feature
│   │   ├── dashboard/             # Dashboard feature
│   │   └── [other features]/
│   ├── hooks/                     # Custom React hooks
│   ├── lib/                       # Utility functions
│   ├── locales/                   # i18n translations
│   ├── routes/                    # TanStack Router routes
│   ├── stores/                    # Zustand state stores
│   ├── styles/                    # Global styles
│   ├── main.tsx                   # Application entry point
│   └── routeTree.gen.ts           # Generated route tree
├── public/                        # Public static files
├── package.json                   # Dependencies
├── vite.config.ts                 # Vite configuration
├── tsconfig.json                  # TypeScript configuration
├── tailwind.config.js             # Tailwind CSS configuration (if exists)
├── components.json                # shadcn/ui configuration
└── project.json                   # Nx configuration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 22+** LTS ([Download](https://nodejs.org/))
- **pnpm 9+** (Package manager)
- **.NET Backend** running on https://localhost:7137

### Setup

```bash
# From repository root
pnpm install
```

### Run Development Server

```bash
# From repository root
nx serve web
# or: nx dev web
# or: pnpm web:serve

# Direct (from apps/web)
cd apps/web
pnpm dev
```

**Access:** http://localhost:5173

### Build for Production

```bash
# From repository root
nx build web
# or: pnpm web:build

# Output: apps/web/dist/
```

### Preview Production Build

```bash
nx preview web
# or: pnpm web:preview
```

---

## 🎨 Tech Stack Details

### Core Libraries

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Fast build tool
- **TanStack Router** - Type-safe routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **TailwindCSS v4** - Utility-first CSS
- **shadcn/ui** - Accessible component library
- **Radix UI** - Headless UI primitives

### Development Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Knip** - Unused code detection
- **TypeScript ESLint** - TypeScript linting

---

## 🔧 Configuration

### API Proxy (Development)

Vite dev server proxies `/api` requests to the backend:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'https://localhost:7137',  // .NET backend
      changeOrigin: true,
      secure: false,
    },
  },
}
```

**Usage in code:**
```typescript
// Automatically proxied to https://localhost:7137/api/auth/login
await axios.post('/api/auth/login', { userName, password });
```

### Environment Variables

No `.env` file needed. API URL is configured in `vite.config.ts`.

For other environment-specific config, create `.env` files:

```bash
# .env.development
VITE_APP_NAME=ONEHub Admin (Dev)

# .env.production
VITE_APP_NAME=ONEHub Admin
```

Access in code:
```typescript
const appName = import.meta.env.VITE_APP_NAME;
```

---

## 🎯 Key Features

### Routing (TanStack Router)

File-based routing with automatic code splitting:

```
src/routes/
├── __root.tsx                    # Root layout
├── index.tsx                     # Home page (/)
├── login.tsx                     # Login page (/login)
└── dashboard/
    ├── _layout.tsx               # Dashboard layout
    ├── index.tsx                 # Dashboard home (/dashboard)
    └── affiliates.tsx            # Affiliates page (/dashboard/affiliates)
```

**Type-safe navigation:**
```typescript
import { useNavigate } from '@tanstack/react-router';

const navigate = useNavigate();
navigate({ to: '/dashboard' });
```

### Data Fetching (TanStack Query)

Server state management with caching:

```typescript
import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['affiliates'],
  queryFn: () => axios.get('/api/affiliates').then(res => res.data),
});
```

### State Management (Zustand)

Lightweight client state:

```typescript
// stores/useAuthStore.ts
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Usage
const { user, setUser } = useAuthStore();
```

### Styling (TailwindCSS v4)

Utility-first CSS with Vite plugin:

```tsx
<div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800">
  <h1 className="text-2xl font-bold">Dashboard</h1>
</div>
```

### UI Components (shadcn/ui)

Accessible, customizable components:

```tsx
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';

<Button variant="outline" size="lg">
  Click me
</Button>
```

**Add new components:**
```bash
cd apps/web
npx shadcn@latest add button
npx shadcn@latest add dialog
```

### Internationalization (i18next)

Multi-language support:

```typescript
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

<h1>{t('dashboard.welcome')}</h1>
```

Translations in `src/locales/`:
```
locales/
├── en/
│   └── common.json
└── vi/
    └── common.json
```

---

## 🧪 Development

### Linting

```bash
nx lint web
# or: cd apps/web && pnpm lint
```

### Formatting

```bash
nx format web
# or: cd apps/web && pnpm format

# Check only (no changes)
pnpm format:check
```

### Unused Code Detection

```bash
cd apps/web
pnpm knip
```

---

## 🏗️ Project Patterns

### Feature Module Structure

```
features/
└── dashboard/
    ├── components/              # Feature-specific components
    ├── hooks/                   # Feature-specific hooks
    ├── api/                     # API calls for this feature
    ├── types.ts                 # TypeScript types
    └── index.ts                 # Public exports
```

### API Integration

```typescript
// features/auth/api/login.ts
import axios from 'axios';

export const loginApi = async (userName: string, password: string) => {
  const { data } = await axios.post('/api/auth/login', { userName, password });
  return data;
};

// features/auth/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/login';

export const useLogin = () => {
  return useMutation({
    mutationFn: ({ userName, password }) => loginApi(userName, password),
    onSuccess: (data) => {
      // Handle success
    },
  });
};
```

### Component Organization

```typescript
// ✅ Good: Small, focused components
const UserAvatar = ({ user }) => (
  <Avatar>
    <AvatarImage src={user.avatar} />
    <AvatarFallback>{user.initials}</AvatarFallback>
  </Avatar>
);

// ✅ Good: Composition
const UserCard = ({ user }) => (
  <Card>
    <UserAvatar user={user} />
    <UserDetails user={user} />
  </Card>
);
```

---

## 📊 Performance

### Code Splitting

TanStack Router automatically splits routes:

```typescript
// Each route is lazy-loaded
const DashboardRoute = lazy(() => import('./routes/dashboard'));
```

### Bundle Analysis

```bash
cd apps/web
pnpm build
pnpm preview --open
```

Check `dist/` folder for bundle sizes.

---

## 🔒 Authentication

### JWT Token Handling

Tokens are managed by the backend via HttpOnly cookies.

For manual header-based auth:

```typescript
import axios from 'axios';

// Add token to all requests
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Protected Routes

```typescript
// routes/dashboard/_layout.tsx
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/dashboard/_layout')({
  beforeLoad: ({ context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/login' });
    }
  },
});
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to API"
**Solution:** Ensure backend is running on https://localhost:7137

### Issue: "Vite proxy error"
**Solution:** Check `vite.config.ts` proxy configuration

### Issue: "Module not found"
**Solution:** Run `pnpm install` in root directory

### Issue: "Type errors in IDE"
**Solution:**
```bash
cd apps/web
pnpm exec tsc --noEmit
```

### Issue: "Route not generating"
**Solution:** TanStack Router auto-generates routes. Restart dev server.

---

## 📚 Additional Resources

- [React 19 Docs](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [TanStack Router](https://tanstack.com/router)
- [TanStack Query](https://tanstack.com/query)
- [TailwindCSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

## 🔗 Related Documentation

- [Main README](../../README.md) - Monorepo overview
- [Backend README](../api/README.md) - .NET API
- [NX_MIGRATION_GUIDE.md](../../NX_MIGRATION_GUIDE.md) - Nx setup guide

---

**Maintainer:** ONEHub Development Team
**Version:** React 19 + Vite 7
**Last Updated:** October 24, 2025
