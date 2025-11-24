# Project Context

## Purpose

ONEHub Admin is a .NET 9 backend API built with Clean Architecture for an affiliate marketing admin system. It's a monorepo containing both:
- **Backend**: REST API with CQRS pattern, Result-based error handling, Redis caching, and JWT authentication
- **Frontend**: React 19 SPA with modern routing, state management, RTL support, and responsive design

**Key Goals:**
- Maintain strict separation of concerns via Clean Architecture
- Ensure type safety and maintainability with CQRS pattern
- Provide intuitive admin dashboard for campaign, user, and page management
- Support internationalization with RTL (Arabic/Hebrew) and LTR languages
- Enable SSO integration for enterprise authentication

## Tech Stack

### Backend
- **.NET 9** - Core framework
- **ASP.NET Core Minimal APIs** - Endpoint definition (NOT Controllers)
- **MediatR** - CQRS pattern implementation
- **Fanex.Data** - Database access layer with stored procedure mapping
- **Redis** - Distributed caching
- **Serilog** - Structured logging
- **JWT** - Authentication with access/refresh token pattern
- **SkiaSharp** - Image processing
- **NetArchTest.Rules** - Architecture testing
- **MiniValidator** - Request validation

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite 7** - Build tool with SWC for fast compilation
- **TanStack Router** - File-based routing with auto code-splitting
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS v4** - Styling framework
- **shadcn/ui** - Component library (some RTL-modified)
- **React Hook Form + Zod** - Form validation
- **Axios** - HTTP client with interceptors
- **pnpm** - Package manager (REQUIRED - never npm or yarn)

### Development Tools
- **Backend**: dotnet CLI, Visual Studio/Rider
- **Frontend**: pnpm, ESLint, Prettier, Knip

## Project Conventions

### Code Style

**Universal Rules:**
- ❌ NO COMMENTS - Code must be self-documenting with clear variable and function names
- ✅ Only add comments for extremely complex logic
- Keep source files under 250 lines
- Always output in English
- Avoid code duplication - check for similar patterns before adding new code
- Prefer simple solutions over complex ones
- Separate mock data from source code
- Eliminate redundant code

**Frontend Specific:**
- ❌ NO premature optimization - avoid `useCallback`/`useMemo` without documented performance issues
- Prefer simple, readable code over optimized code
- Always use pnpm (never npm or yarn)
- Test RTL behavior after modifying RTL-aware components

**Backend Specific:**
- Use Minimal APIs (NOT Controllers)
- Follow Clean Architecture layer boundaries strictly
- Never throw exceptions for business errors (use Result.Failure)

### Naming Conventions

**Backend:**
- Queries: `Get{Entity}{Operation}Query` (e.g., `GetCampaignListQuery`)
- Commands: `{Action}{Entity}Command` (e.g., `CreateCampaignCommand`)
- Handlers: `{Query/Command}Handler` (e.g., `GetCampaignListHandler`)
- Repositories: `I{Entity}Repository`, `{Entity}Repository`
- Criterias: `Get{Entity}{Operation}Criteria`
- DB Commands: `{Action}{Entity}Command` (Infrastructure layer)

**Frontend:**
- Components: PascalCase (e.g., `CampaignList`, `UserTable`)
- Files: kebab-case (e.g., `campaign-list.tsx`, `user-table.tsx`)
- Hooks: `use{Name}` (e.g., `useGetCampaigns`, `useCreateUser`)
- Query keys: Nested constants (e.g., `campaignKeys.list(params)`)

### Commit Messages

Follow Conventional Commits format:
- **Format**: `<type>(scope): Description`
- **Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
- **Scopes**: client, server, api, ui, config, deps, script
- **Subject**: 10-72 characters, sentence case, no period
- **Examples**:
  - `feat(api): Add campaign list endpoint`
  - `fix(client): Resolve RTL layout issue in sidebar`
  - `refactor(server): Simplify user repository query logic`

## Architecture Patterns

### Backend - Clean Architecture (4 Layers)

**Dependency Flow:**
```
WebApi → Application → Domain ← Infrastructure
```

**Domain (Core - No dependencies):**
- Entities (DTOs, domain models)
- Repository interfaces (e.g., `ICampaignRepository`)
- Params (parameter objects for repository methods)
- Results (`Result`, `Result<T>`)
- Errors (domain error definitions)
- Constants (`CacheKeys`, `Roles`, etc.)
- Settings (configuration models)

**Application (Business Logic - Depends on Domain only):**
- MediatR Queries (read operations)
- MediatR Commands (write operations)
- Query/Command Handlers (same file as query/command)
- Service interfaces (`ICacheProvider`, `ICurrentUserService`, `IJwtTokenService`)
- Base classes (`BaseCommand`, `BaseNonResultCommand`, `PagingQuery`)
- Pipeline behaviors (`UserContextBehavior` for auto user context injection)

**Infrastructure (External Concerns - Depends on Domain + Application):**
- Repository implementations
- Service implementations
- Database Commands (Fanex.Data `NonQueryCommand` for INSERT/UPDATE/DELETE)
- Database Criterias (Fanex.Data `CriteriaBase` for SELECT)
- `BaseRepository` with common CRUD methods

**WebApi (Presentation - Depends on all layers):**
- Minimal API endpoints (NOT Controllers)
- Request/Response DTOs
- Service installers (DI configuration via `IServiceInstaller`)
- Global exception handler
- Health checks
- Static file serving for frontend SPA

### Key Backend Patterns

**1. CQRS via MediatR:**
- ALL business operations use MediatR Queries (read) or Commands (write)
- Inject `IMediator` in endpoints, not repositories
- Handlers contain business logic and call repositories

**2. Result Pattern:**
- ALL operations return `Result` or `Result<T>`
- NEVER throw exceptions for business errors
- Use `Result.Success()` or `Result.Failure(error)`
- Frontend expects `{ errorCode, errorMessage, data }` structure

**3. Repository Pattern:**
- Domain defines interfaces (e.g., `ICampaignRepository`)
- Infrastructure implements repositories
- Repositories use Fanex.Data Criterias (SELECT) and Commands (INSERT/UPDATE/DELETE)

**4. User Context Auto-Injection:**
- Commands extending `BaseCommand` or `BaseNonResultCommand` get `UserId`, `Ip`, `Host` auto-populated
- `UserContextBehavior` pipeline injects context before handler execution

**5. Paging Pattern:**
- Query extends `PagingQuery<TResponse>`
- Criteria extends `PagingCriteria`
- Result uses `PagingData<T>` with Items, TotalItem, PageIndex, PageSize

**6. Installer Pattern:**
- Service registration via `IServiceInstaller` implementations
- Auto-discovered via reflection in `DependencyInjection.cs`

### Frontend Architecture

**Feature Module Pattern:**
```
features/{feature}/
├── api/
│   ├── client.ts        # API calls to backend
│   ├── queries.ts       # useQuery hooks (read operations)
│   └── commands.ts      # useMutation hooks (write operations)
├── components/          # Feature-specific components
├── data/                # Schemas, types, mock data
├── types/               # TypeScript type definitions
├── utils/               # Feature utilities
└── index.tsx            # Main feature component
```

**State Management:**
- **Server state**: TanStack Query (API data, caching, automatic refetching)
- **Client state**: Zustand stores (e.g., `auth-store.ts`)
- **Feature state**: React Context providers (e.g., `TasksProvider`, `UsersProvider`)

**Routing (TanStack Router):**
- File-based routing in `src/routes/`
- Routes auto-generated to `routeTree.gen.ts`
- Protected routes: `_authenticated/` layout with auth guard
- Public routes: `(auth)/` layout
- Nested rendering via `<Outlet />`

**Data Fetching:**
- TanStack Query for all server operations
- Query keys pattern for cache management
- Mutations with automatic cache invalidation via `queryClient.invalidateQueries()`
- Global error handling:
  - 401 → redirect to sign-in
  - 500 → redirect to error page
  - Auto-retry disabled in dev, max 3 retries in prod

**Layout System:**
- `AuthenticatedLayout` wraps authenticated routes
- Configurable sidebar variants: default, floating, inset
- Configurable layouts: default, compact, full
- RTL support via `DirectionProvider`
- Theme support (light/dark) via `ThemeProvider`

**Provider Pattern:**
- Features use dedicated providers for isolated state management
- Access state via React Context within feature boundaries
- Example: `TasksProvider`, `UsersProvider`

## Testing Strategy

### Backend Testing

**Architecture Tests (NetArchTest.Rules):**
- Located in `tests/ONEHub.Architecture.Tests/ArchitectureTests.cs`
- MUST pass before committing
- Enforces:
  1. Domain has NO dependencies on other projects
  2. Application depends ONLY on Domain
  3. Infrastructure has NO dependency on WebApi
  4. All handlers depend on Domain
  5. All endpoint classes depend on MediatR

**Unit Tests:**
- Run: `dotnet test`
- Code coverage: `dotnet test --collect:"XPlat Code Coverage"`

### Frontend Testing

**Code Quality:**
- ESLint for linting: `pnpm lint`
- Prettier for formatting: `pnpm format` or `pnpm format:check`
- Knip for unused code detection: `pnpm knip`
- TypeScript strict mode for type safety

**Manual Testing:**
- Test RTL behavior with Arabic/Hebrew languages
- Verify light/dark theme switching
- Test responsive design across devices
- Validate form validation and error states

## Git Workflow

### Branching Strategy
- **Main branch**: `main`
- **Feature branches**: Descriptive names (e.g., `243203-PageManagement-Rebase`)
- Create feature branches from `main`
- Merge back via pull requests

### Commit Process
1. Follow Conventional Commits format
2. Run tests before committing:
   - Backend: Ensure architecture tests pass
   - Frontend: `pnpm lint && pnpm format`
3. Keep commits atomic and focused
4. Write clear, descriptive commit messages

### Pre-commit Hooks
- If commit fails due to pre-commit hook changes, retry ONCE
- If hook modifies files, verify it's safe to amend
- Check authorship before amending: `git log -1 --format='%an %ae'`
- NEVER amend other developers' commits

### Pull Request Guidelines
- Ensure all tests pass
- Request code review
- Address review comments
- Squash commits if needed before merging

## Domain Context

### Business Domain

ONEHub Admin is an affiliate marketing administration system that manages:
- **Campaigns**: Marketing campaigns with status tracking
- **Users**: Admin users with role-based access control
- **Pages**: Content pages with management capabilities
- **Components**: UI components with summary views
- **Dashboard**: Analytics and overview data

### Key Entities

**Campaign:**
- CampaignId (int)
- CampaignName (string)
- Description (string, nullable)
- StatusId (int)

**User:**
- UserId (int)
- Username (string)
- Email (string)
- Roles (collection)
- Authentication tokens

**Page:**
- PageId (int)
- Page management entity with search/filter capabilities

**Component:**
- ComponentId (int)
- Summary entity for UI components

### Authentication Flow

**JWT-based with access/refresh tokens:**
1. User logs in via `/api/auth/login` or `/api/auth/sso`
2. Backend returns access token (short-lived) and refresh token (long-lived)
3. Frontend stores tokens in cookies
4. Access token included in Authorization header for API requests
5. On 401 error, frontend automatically refreshes token via `/api/auth/refresh-token`
6. Refresh fails → redirect to sign-in
7. Logout via `/api/auth/logout` clears tokens

**Endpoints:**
- `POST /api/auth/login` - Standard login
- `POST /api/auth/sso` - SSO integration login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout and clear tokens
- `GET /api/auth/profile` - Get current user profile

### Key Services

**Backend:**
- `ICurrentUserService` - Get current user from JWT claims
- `IJwtTokenService` - Token generation/validation
- `ICacheProvider` - Redis caching abstraction
- `I{Entity}Repository` - Data access per entity

**Frontend:**
- `authStore` - Zustand store for authentication state
- `apiClient` - Axios instance with interceptors
- Query/mutation hooks per feature

## Important Constraints

### Backend Constraints

**Mandatory Patterns:**
- ✅ MUST use Minimal APIs (NOT Controllers)
- ✅ MUST use MediatR for ALL business operations
- ✅ MUST return `Result` or `Result<T>` (never throw exceptions for business errors)
- ✅ MUST inject `IMediator` in endpoints (NOT repositories)
- ✅ MUST extend `BaseCommand`/`BaseNonResultCommand` for user context
- ✅ MUST validate requests with MiniValidator in endpoints
- ✅ MUST handle business validation in handlers
- ✅ MUST create Criterias for SELECT operations
- ✅ MUST create Commands for INSERT/UPDATE/DELETE operations
- ✅ MUST register repositories in `Infrastructure/DependencyInjection.cs`

**Forbidden Patterns:**
- ❌ DO NOT create Controllers
- ❌ DO NOT inject repositories directly in endpoints
- ❌ DO NOT throw exceptions for business errors
- ❌ DO NOT put business logic in endpoints
- ❌ DO NOT add dependencies from Domain to other layers
- ❌ DO NOT skip architecture tests
- ❌ DO NOT mix Application Commands with Infrastructure Commands

**Architecture Enforcement:**
- Architecture tests MUST pass before committing
- Layer dependencies are strictly enforced
- Domain layer has NO external dependencies

**Database Access:**
- All database operations via stored procedures
- Stored procedure names mapped in `SpNames.xml`
- Use Fanex.Data Criterias (SELECT) and Commands (INSERT/UPDATE/DELETE)
- Connection strings in `appsettings.json`

### Frontend Constraints

**Package Management:**
- ✅ MUST use pnpm (REQUIRED)
- ❌ NEVER use npm or yarn

**Performance:**
- ❌ NO premature optimization
- ❌ DO NOT use `useCallback`/`useMemo` without documented performance issues
- ✅ Prefer simple, readable code

**Component Updates:**
- RTL-modified shadcn components require careful updates
- Test RTL behavior after modifying: alert-dialog, calendar, command, dialog, dropdown-menu, select, table, sheet, sidebar, switch
- Modified components (general): scroll-area, sonner, separator

**Path Alias:**
- `@/` maps to `src/` (configured in tsconfig.json and vite.config.ts)

**State Management:**
- Use TanStack Query for server state
- Use Zustand for global client state (auth only)
- Use React Context for feature-specific state
- Always invalidate query cache after mutations

### Integration Constraints

**Backend Response Format:**
- MUST return `{ errorCode, errorMessage, data }` structure
- `errorCode: 0` = success
- `errorCode !== 0` = error (frontend treats as error)
- Always include proper error codes and messages

**Development Mode:**
- Backend: `https://localhost:7137`
- Frontend: `http://localhost:5173`
- Frontend proxies `/api` requests to backend via Vite proxy

**Production Mode:**
- Single .NET application serves both API and SPA
- Frontend builds to `client-app/dist/`
- Build script copies to `src/ONEHub.WebApi/wwwroot/`
- Backend serves SPA via `UseStaticFiles()` + `MapFallbackToFile("/index.html")`

**File Organization:**
- Keep files under 250 lines
- Separate mock data from source code
- Follow established directory structure strictly

## External Dependencies

### Backend Services

**Redis (Distributed Caching):**
- Purpose: Cache frequently accessed data
- Configuration: `appsettings.json` → `Redis.ConnectionString`, `Redis.ApplicationName`
- Used via: `ICacheProvider` service abstraction

**Sentry (Error Tracking):**
- Purpose: Monitor and track production errors
- Configuration: `appsettings.json` → `Sentry.Dsn`, `Sentry.Environment`
- Automatic error capture and reporting

**External Auth API (SSO Integration):**
- Purpose: Validate SSO authentication tokens
- Configuration: `appsettings.json` → `ExternalAuth.ValidationApiUrl`, `ExternalAuth.ProxyUrl`
- Used by: `/api/auth/sso` endpoint

**SQL Server Database:**
- Purpose: Primary data storage
- Access: Via Fanex.Data with stored procedures
- Configuration: `appsettings.json` → `ConnectionStrings` array
- Stored procedure mapping: `SpNames.xml`

### Frontend Services

**Backend API:**
- Base URL: `/api` (proxied in dev, direct in prod)
- Authentication: Bearer token from cookies
- Error handling: Automatic 401 token refresh, retry queue
- Business error handling: `errorCode !== 0` treated as error

**Authentication Service:**
- JWT token management with automatic refresh
- Access token: Short-lived, stored in cookies as JSON
- Refresh token: Long-lived, used for token renewal
- Automatic retry of failed requests after token refresh

### Build Dependencies

**Frontend → Backend Integration:**
- Frontend builds: `cd client-app && pnpm build`
- Build process: TypeScript check → Vite build → Copy to `wwwroot/`
- Output: `client-app/dist/` → `src/ONEHub.WebApi/wwwroot/`

**Development Setup:**
1. Start backend: `dotnet run --project src/ONEHub.WebApi/ONEHub.WebApi.csproj`
2. Start frontend: `cd client-app && pnpm dev`
3. Access frontend at `http://localhost:5173`

**Production Deployment:**
- Build frontend first
- Build backend (includes frontend in `wwwroot/`)
- Deploy single .NET application

### Configuration Files

**Backend:**
- `appsettings.json` - Main configuration
- `appsettings.Development.json` - Dev overrides
- `appsettings.Staging.json` - Staging overrides
- `appsettings.Production.json` - Production overrides
- `SpNames.xml` - Stored procedure name mapping

**Frontend:**
- `vite.config.ts` - Vite configuration with proxy setup
- `tsconfig.json` - TypeScript configuration with path aliases
- `.eslintrc.cjs` - ESLint rules
- `.prettierrc` - Prettier formatting rules

**Key Configuration Sections:**
- `Jwt` - Token configuration (SecretKey, Issuer, Audience, expiry times)
- `ExternalAuth` - SSO integration settings
- `Redis` - Cache connection and settings
- `Sentry` - Error tracking configuration
- `ConnectionStrings` - Database connections (Fanex.Data format)
- `StoredProcedurePath` - Path to SpNames.xml
- `Serilog` - Logging configuration

### Package Ecosystems

**Backend:**
- NuGet packages managed via .NET SDK
- Restore: `dotnet restore`
- Major dependencies: MediatR, Fanex.Data, StackExchange.Redis, Serilog

**Frontend:**
- npm packages managed via pnpm
- Install: `pnpm install`
- Major dependencies: React, TanStack Router/Query, Zustand, Tailwind, shadcn/ui
