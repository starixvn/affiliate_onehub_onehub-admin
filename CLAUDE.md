# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ONEHub Admin is a **.NET 9 backend API** built with **Clean Architecture** for an affiliate admin system. Uses **CQRS via MediatR**, **Fanex.Data** for database access, **Redis** caching, **Minimal APIs**, and **Result pattern** for error handling.

**Tech Stack:** .NET 9, ASP.NET Core Minimal APIs, MediatR, Fanex.Data, Redis, Serilog, JWT, SkiaSharp

## Frontend Overview (client-app/)

This is a **monorepo** containing both backend and frontend. The frontend is a React 19 SPA in the `client-app/` directory.

**Tech Stack:** React 19, TypeScript, Vite 7, TanStack Router, TanStack Query, Zustand, Tailwind CSS v4, shadcn/ui

**Package Manager:** pnpm (required - NOT npm or yarn)

### Frontend Commands

```bash
# From client-app/ directory
pnpm dev                # Dev server (http://localhost:5173)
pnpm build              # Production build + copy to wwwroot
pnpm lint               # ESLint
pnpm format             # Prettier auto-format
```

**Detailed frontend documentation:** [client-app/CLAUDE.md](client-app/CLAUDE.md)

## Development Commands

### Build
```bash
dotnet build ONEHub.Admin.sln
dotnet build ONEHub.Admin.sln -c Release
```

### Run
```bash
dotnet run --project src/ONEHub.WebApi/ONEHub.WebApi.csproj
```
- API: `https://localhost:7137`
- Swagger: `https://localhost:7137/swagger`
- Health: `https://localhost:7137/health`

### Test
```bash
dotnet test
dotnet test --collect:"XPlat Code Coverage"
```

### Clean
```bash
dotnet clean
```

## Frontend-Backend Integration

### Development Setup

**Run both servers separately:**
1. Start backend: `dotnet run --project src/ONEHub.WebApi/ONEHub.WebApi.csproj` (https://localhost:7137)
2. Start frontend: `cd client-app && pnpm dev` (http://localhost:5173)
3. Frontend dev server proxies `/api` requests to backend via Vite proxy

**Access:**
- Frontend: http://localhost:5173
- Backend API: https://localhost:7137
- Swagger: https://localhost:7137/swagger

### Production Build

**Build process:**
```bash
cd client-app
pnpm build  # TypeScript check → Vite build → Copy to src/ONEHub.WebApi/wwwroot/
```

**Deployment:**
- Frontend builds to `client-app/dist/`
- Build script copies to `src/ONEHub.WebApi/wwwroot/`
- Backend serves SPA via `UseStaticFiles()` + `MapFallbackToFile("/index.html")`
- Single .NET application serves both API and frontend

### Full-Stack Development Workflow

1. **Backend**: Create MediatR Query/Command → Add Endpoint
2. **Frontend**: Create feature module → API client → TanStack Query hooks → UI components
3. **Integration**: Backend Result<T> structure → Frontend expects `{ errorCode, errorMessage, data }`

## Architecture - 4 Layers

```
ONEHub.WebApi         → Minimal API endpoints, request/response models
ONEHub.Application    → MediatR queries/commands, business logic
ONEHub.Domain         → Entities, repository interfaces, params, results, errors
ONEHub.Infrastructure → Repository implementations, services, DB commands/criterias
```

### Layer Responsibilities

**Domain** (Core - No dependencies)
- Entities (DTOs, domain models)
- Repository interfaces (IAuthRepository, ICampaignRepository)
- Params (parameter objects for repository methods)
- Results (Result, Result<T>)
- Errors (domain error definitions)
- Constants (CacheKeys, Roles, etc.)
- Settings (configuration models)

**Application** (Business Logic - Depends on Domain only)
- MediatR Queries (read operations)
- MediatR Commands (write operations)
- Query/Command Handlers
- Service interfaces (ICacheProvider, ICurrentUserService, IJwtTokenService)
- Base classes (BaseCommand, PagingQuery)
- Pipeline behaviors (UserContextBehavior)

**Infrastructure** (External Concerns - Depends on Domain + Application interfaces)
- Repository implementations
- Service implementations
- Database Commands (Fanex.Data NonQueryCommand)
- Database Criterias (Fanex.Data CriteriaBase)
- BaseRepository with common CRUD methods

**WebApi** (Presentation - Depends on all layers)
- Minimal API endpoints
- Request/Response DTOs
- Service installers (DI configuration)
- Global exception handler
- Health checks

### Dependency Flow (Enforced by Architecture Tests)
```
WebApi → Application → Domain ← Infrastructure
```

## CQRS Pattern (MediatR)

**ALL business operations use MediatR Queries or Commands.**

### Naming Conventions

**Queries (Read):** `Get{Entity}{Operation}Query`
- Examples: `GetCampaignListQuery`, `GetCampaignDashboardQuery`, `GetComponentSummaryQuery`

**Commands (Write):** `{Action}{Entity}Command`
- Examples: `CreateCampaignCommand`, `UpdateCampaignCommand`, `DeleteBatchCampaignCommand`

**Handlers:** `{Query/Command}Handler`
- Same file as query/command
- Examples: `GetCampaignListHandler`, `CreateCampaignHandler`

### Base Classes

**For Commands:**
```csharp
public abstract class BaseCommand<TResponse> : IRequest<Result<TResponse>>, IRequiresUserContext
{
    public string Ip { get; set; } = string.Empty;
    public string Host { get; set; } = string.Empty;
    public int UserId { get; set; }
}

public abstract class BaseNonResultCommand : IRequest<Result>, IRequiresUserContext
{
    public string Ip { get; set; } = string.Empty;
    public string Host { get; set; } = string.Empty;
    public int UserId { get; set; }
}
```

**For Queries with Paging:**
```csharp
public abstract class PagingQuery<TResponse> : BaseQuery<PagingData<TResponse>>
{
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string SortBy { get; set; } = string.Empty;
    public string SortDirection { get; set; } = "ASC";
}
```

### User Context Auto-Injection

Commands extending `BaseCommand` or `BaseNonResultCommand` get `UserId`, `Ip`, `Host` auto-populated by `UserContextBehavior` pipeline before handler execution.

## Result Pattern

**ALL operations return `Result` or `Result<T>` (never throw exceptions for business errors).**

```csharp
public class Result
{
    public int ErrorCode { get; }
    public string ErrorMessage { get; }
    public bool IsSuccess => ErrorCode == 0;
    public bool IsFailure => !IsSuccess;

    public static Result Success();
    public static Result Failure(Error error);
}

public class Result<T> : Result
{
    public T? Data { get; }

    public static Result<T> Success(T data);
    public static new Result<T> Failure(Error error);
}
```

**Usage in Handlers:**
```csharp
var result = await repository.GetCampaignListAsync(param);

if (result.IsFailure)
    return Result<PagingData<CampaignResponse>>.Failure(result.Error);

if (result.Data is null)
    return Result<PagingData<CampaignResponse>>.Failure(Error.NoData);

return Result<PagingData<CampaignResponse>>.Success(mappedData);
```

## Database Access (Fanex.Data)

### Repository Pattern

**Interface (Domain):**
```csharp
public interface ICampaignRepository
{
    Task<Result<PagingData<Campaign>>> GetCampaignListAsync(CampaignListParam param);
    Task<Result> CreateCampaignAsync(CreateCampaignParam param);
}
```

**Implementation (Infrastructure):**
```csharp
public class CampaignRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), ICampaignRepository
{
    public async Task<Result<PagingData<Campaign>>> GetCampaignListAsync(CampaignListParam param)
    {
        var criteria = new GetCampaignListCriteria
        {
            PageIndex = param.PageIndex,
            PageSize = param.PageSize,
            Search = param.Search,
            StatusIds = param.StatusIds
        };
        return await FetchPagingDataAsync<Campaign>(criteria);
    }
}
```

### Criterias (For SELECT Queries)

**Location:** `Infrastructure/Repositories/Criterias/`

```csharp
public class GetCampaignListCriteria : PagingCriteria
{
    public override string GetSettingKey() => "OH_Campaign_ManageSel"; // SP name
    public override bool IsValid() => true;

    public string? Search { get; set; }
    public string? StatusIds { get; set; }
    public bool IsExportExcel { get; set; }
}
```

### Commands (For INSERT/UPDATE/DELETE)

**Location:** `Infrastructure/Repositories/Commands/`

```csharp
public class CreateCampaignCommand : BaseCommand
{
    public string CampaignName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StatusId { get; set; }

    public override string GetSettingKey() => "OH_Campaign_Ins"; // SP name
    public override bool IsValid() => StatusId >= 0 && !string.IsNullOrWhiteSpace(CampaignName);
}
```

**Execution and Error Handling:**
```csharp
var command = new CreateCampaignCommand { /* properties */ };
await dynamicRepository.ExecuteAsync(command);

if (command.ErrCode != 0)
    return Result.Failure(new Error(command.ErrCode, command.ErrMsg));

return Result.Success();
```

### BaseRepository Helpers

- `FetchPagingDataAsync<T>(PagingCriteria)` - Query with paging
- `GetDataAsync<T>(CriteriaBase)` - Single entity query
- `ExecuteCommandAsync(BaseCommand)` - Execute stored procedure

### Paging Pattern

**Query (Application):** Extends `PagingQuery<TResponse>`

**Criteria (Infrastructure):** Extends `PagingCriteria` with `[SpParam(SqlParamName = "NRows")] int TotalItem` output

**Result (Domain):** `PagingData<T>` with Items, TotalItem, PageIndex, PageSize

## Minimal API Endpoints

### Endpoint Registration

**Location:** `WebApi/Features/{Feature}/{Feature}EndPoint.cs`

```csharp
public static class CampaignEndPoint
{
    public static IEndpointRouteBuilder RegisterCampaignEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/campaign").RequireAuthorization();

        group.MapGet("/", GetList);
        group.MapPost("/", Create);
        group.MapPut("/{id}", Update);
        group.MapDelete("/batch", DeleteBatch);

        return group;
    }

    private static async Task<Results<Ok<Result<PagingData<CampaignResponse>>>, ValidationProblem>> GetList(
        [AsParameters] GetCampaignListRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
            return TypedResults.ValidationProblem(errors);

        var query = new GetCampaignListQuery
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            Search = request.Search
        };

        var result = await mediator.Send(query);
        return TypedResults.Ok(result);
    }
}
```

**Register in Program.cs:**
```csharp
app.MapEndpoint(); // Auto-discovers all endpoint classes
```

### Request/Response Models

**Location:** `WebApi/Features/{Feature}/{Feature}Models.cs`

```csharp
public class GetCampaignListRequest
{
    [Range(1, int.MaxValue)]
    public int PageIndex { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 20;

    public string? Search { get; set; }
}

public class CampaignResponse
{
    public int CampaignId { get; set; }
    public string CampaignName { get; set; } = string.Empty;
    public int StatusId { get; set; }
}
```

## Frontend Architecture Patterns

### Feature Module Pattern

Each feature is self-contained in `client-app/src/features/{feature}/`:

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

### TanStack Query Pattern

**Queries (Read):**
```typescript
// features/campaign/api/queries.ts
export const campaignKeys = {
  all: ['campaigns'] as const,
  lists: () => [...campaignKeys.all, 'list'] as const,
  list: (params) => [...campaignKeys.lists(), params] as const,
}

export function useGetCampaigns(params?: GetCampaignsParams) {
  return useQuery({
    queryKey: campaignKeys.list(params),
    queryFn: () => campaignApi.getCampaigns(params),
    select: (data) => data.data,
  })
}
```

**Commands (Write):**
```typescript
// features/campaign/api/commands.ts
export function useCreateCampaign() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: campaignApi.createCampaign,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: campaignKeys.lists() })
    },
  })
}
```

### Routing with TanStack Router

File-based routing in `client-app/src/routes/`:
- `__root.tsx` - Root layout
- `_authenticated/` - Protected routes layout with auth guard
- `(auth)/` - Public auth routes (sign-in, etc.)

**Protected routes:**
```typescript
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location, context }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: '/sign-in', search: { redirect: location.href } })
    }
  },
})
```

### State Management

- **Server state:** TanStack Query (API data, caching, refetching)
- **Client state:** Zustand (`stores/auth-store.ts` for authentication)
- **Feature state:** React Context providers (e.g., `page-provider.tsx`)

### API Client (Axios)

**Location:** `client-app/src/lib/api/client.ts`

- Base URL: `/api` (proxied to backend in dev)
- Request interceptor: Add Bearer token from cookies
- Response interceptor: Handle 401 with automatic token refresh and retry queue
- Business error handling: `errorCode !== 0` treated as error

## Step-by-Step: Creating a New Feature

### Example: Add "GetCampaignList" Query

**1. Create Entity (Domain)**
```csharp
// Domain/Entities/Campaign.cs
public class Campaign
{
    public int CampaignId { get; set; }
    public string CampaignName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StatusId { get; set; }
}
```

**2. Create Param (Domain)**
```csharp
// Domain/Params/CampaignParam.cs
public class CampaignListParam : PagingParam
{
    public string? Search { get; set; }
    public string? StatusIds { get; set; }
}
```

**3. Create Repository Interface (Domain)**
```csharp
// Domain/Repositories/ICampaignRepository.cs
public interface ICampaignRepository
{
    Task<Result<PagingData<Campaign>>> GetCampaignListAsync(CampaignListParam param);
}
```

**4. Create Criteria (Infrastructure)**
```csharp
// Infrastructure/Repositories/Criterias/GetCampaignListCriteria.cs
public class GetCampaignListCriteria : PagingCriteria
{
    public override string GetSettingKey() => "OH_Campaign_ManageSel";
    public override bool IsValid() => true;

    public string? Search { get; set; }
    public string? StatusIds { get; set; }
}
```

**5. Implement Repository (Infrastructure)**
```csharp
// Infrastructure/Repositories/CampaignRepository.cs
public class CampaignRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), ICampaignRepository
{
    public async Task<Result<PagingData<Campaign>>> GetCampaignListAsync(CampaignListParam param)
    {
        var criteria = new GetCampaignListCriteria
        {
            PageIndex = param.PageIndex,
            PageSize = param.PageSize,
            Search = param.Search,
            StatusIds = param.StatusIds
        };
        return await FetchPagingDataAsync<Campaign>(criteria);
    }
}
```

**6. Create Query + Handler (Application)**
```csharp
// Application/Features/Campaign/Queries/GetCampaignListQuery.cs
public class GetCampaignListQuery : PagingQuery<CampaignResponse>
{
    public string? Search { get; set; }
    public string? StatusIds { get; set; }
}

public class GetCampaignListHandler(ICampaignRepository repository)
    : IRequestHandler<GetCampaignListQuery, Result<PagingData<CampaignResponse>>>
{
    public async Task<Result<PagingData<CampaignResponse>>> Handle(
        GetCampaignListQuery request,
        CancellationToken cancellationToken)
    {
        var param = new CampaignListParam
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            Search = request.Search,
            StatusIds = request.StatusIds
        };

        var result = await repository.GetCampaignListAsync(param);

        if (result.IsFailure || result.Data is null)
            return Result<PagingData<CampaignResponse>>.Failure(result.Error);

        var response = new PagingData<CampaignResponse>
        {
            Items = result.Data.Items.Select(c => new CampaignResponse
            {
                CampaignId = c.CampaignId,
                CampaignName = c.CampaignName,
                StatusId = c.StatusId
            }).ToList(),
            TotalItem = result.Data.TotalItem,
            PageIndex = result.Data.PageIndex,
            PageSize = result.Data.PageSize
        };

        return Result<PagingData<CampaignResponse>>.Success(response);
    }
}
```

**7. Create Endpoint (WebApi)**
```csharp
// WebApi/Features/Campaign/CampaignEndPoint.cs
public static class CampaignEndPoint
{
    public static IEndpointRouteBuilder RegisterCampaignEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var group = endpoints.MapGroup("/api/campaign").RequireAuthorization();
        group.MapGet("/", GetList);
        return group;
    }

    private static async Task<Results<Ok<Result<PagingData<CampaignResponse>>>, ValidationProblem>> GetList(
        [AsParameters] GetCampaignListRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
            return TypedResults.ValidationProblem(errors);

        var query = new GetCampaignListQuery
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            Search = request.Search,
            StatusIds = request.StatusIds
        };

        var result = await mediator.Send(query);
        return TypedResults.Ok(result);
    }
}

// WebApi/Features/Campaign/CampaignModels.cs
public class GetCampaignListRequest
{
    [Range(1, int.MaxValue)]
    public int PageIndex { get; set; } = 1;

    [Range(1, 100)]
    public int PageSize { get; set; } = 20;

    public string? Search { get; set; }
    public string? StatusIds { get; set; }
}

public class CampaignResponse
{
    public int CampaignId { get; set; }
    public string CampaignName { get; set; } = string.Empty;
    public int StatusId { get; set; }
}
```

**8. Register Repository (Infrastructure)**
```csharp
// Infrastructure/DependencyInjection.cs
services.AddSingleton<ICampaignRepository, CampaignRepository>();
```

### Example: Add "CreateCampaign" Command

**1. Create Param (Domain)**
```csharp
// Domain/Params/CampaignParam.cs
public class CreateCampaignParam
{
    public string CampaignName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StatusId { get; set; }
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
}
```

**2. Add to Repository Interface (Domain)**
```csharp
public interface ICampaignRepository
{
    Task<Result> CreateCampaignAsync(CreateCampaignParam param);
}
```

**3. Create Database Command (Infrastructure)**
```csharp
// Infrastructure/Repositories/Commands/CreateCampaignCommand.cs
public class CreateCampaignCommand : BaseCommand
{
    public string CampaignName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StatusId { get; set; }

    public override string GetSettingKey() => "OH_Campaign_Ins";
    public override bool IsValid() => StatusId >= 0 && !string.IsNullOrWhiteSpace(CampaignName);
}
```

**4. Implement Repository Method (Infrastructure)**
```csharp
public async Task<Result> CreateCampaignAsync(CreateCampaignParam param)
{
    var command = new CreateCampaignCommand
    {
        CampaignName = param.CampaignName,
        Description = param.Description,
        StatusId = param.StatusId
    };
    return await ExecuteCommandAsync(command);
}
```

**5. Create Command + Handler (Application)**
```csharp
// Application/Features/Campaign/Commands/CreateCampaignCommand.cs
public class CreateCampaignCommand : BaseNonResultCommand
{
    public string CampaignName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StatusId { get; set; }
}

public class CreateCampaignHandler(ICampaignRepository repository)
    : IRequestHandler<CreateCampaignCommand, Result>
{
    public async Task<Result> Handle(
        CreateCampaignCommand request,
        CancellationToken cancellationToken)
    {
        var param = new CreateCampaignParam
        {
            CampaignName = request.CampaignName,
            Description = request.Description,
            StatusId = request.StatusId,
            UserId = request.UserId,
            Ip = request.Ip
        };

        return await repository.CreateCampaignAsync(param);
    }
}
```

**6. Create Endpoint (WebApi)**
```csharp
group.MapPost("/", Create);

private static async Task<Results<Ok<Result>, ValidationProblem>> Create(
    [FromBody] CreateCampaignRequest request,
    IMediator mediator)
{
    if (!MiniValidator.TryValidate(request, out var errors))
        return TypedResults.ValidationProblem(errors);

    var command = new CreateCampaignCommand
    {
        CampaignName = request.CampaignName,
        Description = request.Description,
        StatusId = request.StatusId
    };

    var result = await mediator.Send(command);
    return TypedResults.Ok(result);
}
```

### Example: Full-Stack Integration (Backend → Frontend)

**Backend Endpoint returns Result<T>:**
```csharp
// WebApi/Features/Campaign/CampaignEndPoint.cs
private static async Task<Results<Ok<Result<PagingData<CampaignResponse>>>, ValidationProblem>> GetList(
    [AsParameters] GetCampaignListRequest request,
    IMediator mediator)
{
    var query = new GetCampaignListQuery { /* ... */ };
    var result = await mediator.Send(query);
    return TypedResults.Ok(result); // Returns { errorCode, errorMessage, data }
}
```

**Frontend API Client:**
```typescript
// features/campaign/api/client.ts
export const campaignApi = {
  getCampaigns: async (params?: GetCampaignsParams) => {
    const { data } = await apiClient.get<ApiResponse<PagingData<Campaign>>>('/campaign', { params })
    return data // { errorCode, errorMessage, data }
  }
}

// features/campaign/api/queries.ts
export function useGetCampaigns(params?: GetCampaignsParams) {
  return useQuery({
    queryKey: campaignKeys.list(params),
    queryFn: () => campaignApi.getCampaigns(params),
    select: (response) => response.data, // Extract data from Result<T>
  })
}

// features/campaign/index.tsx
export function CampaignList() {
  const { data, isLoading, error } = useGetCampaigns({ pageIndex: 1, pageSize: 20 })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading campaigns</div>

  return <div>{data?.items.map(campaign => <div key={campaign.campaignId}>{campaign.campaignName}</div>)}</div>
}
```

**Key Points:**
- Backend returns `Result<T>` with `{ errorCode, errorMessage, data }`
- Frontend axios client handles `errorCode !== 0` as errors
- TanStack Query hooks extract `data` from Result structure
- UI components receive clean typed data

## Configuration (appsettings.json)

**Key Sections:**
- `Jwt` - JWT token configuration (SecretKey, Issuer, Audience, AccessTokenExpiryMinutes, RefreshTokenExpiryMinutes)
- `ExternalAuth` - SSO integration (ValidationApiUrl, ProxyUrl)
- `Redis` - Distributed cache (ConnectionString, ApplicationName)
- `Sentry` - Error tracking (Dsn, Environment)
- `ConnectionStrings` - Fanex.Data format with Name, ConnectionString, ProviderName
- `StoredProcedurePath` - SP configuration file ("SpNames.xml")
- `Serilog` - Logging configuration

Environment overrides: `appsettings.{Development|Staging|Production}.json`

## DI Registration

### Installer Pattern

**Location:** `WebApi/Configurations/{Feature}ServiceInstaller.cs`

```csharp
public interface IServiceInstaller
{
    void Install(IServiceCollection services, IConfiguration configuration);
}

public class AuthenticationServiceInstaller : IServiceInstaller
{
    public void Install(IServiceCollection services, IConfiguration configuration)
    {
        var jwtSetting = configuration.GetSection(JwtSetting.SettingName).Get<JwtSetting>();
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(/* config */);
    }
}
```

Auto-discovered via reflection in `DependencyInjection.cs`.

### Layer Registration

```csharp
services
    .AddApplication()      // MediatR + Behaviors
    .AddInfrastructure(configuration); // Repositories + Services
```

## Testing

### Architecture Tests (NetArchTest.Rules)

**Location:** `tests/ONEHub.Architecture.Tests/ArchitectureTests.cs`

**Enforces:**
1. Domain has NO dependencies on other projects
2. Application depends ONLY on Domain
3. Infrastructure has NO dependency on WebApi
4. All handlers depend on Domain
5. All endpoint classes depend on MediatR

Tests MUST pass before committing.

## Code Style

### Comments
**Do not add any comments.** Code should be self-documenting with clear variable and function names. Only add comments for extremely complex logic.

### File Size
Keep source files under 250 lines. Break large files into smaller pieces.

### Commit Messages
Follow Conventional Commits format defined in `.cursor/rules/commit.mdc`:
- Format: `<type>(scope): Description`
- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`
- Scopes: `client`, `server`, `api`, `ui`, `config`, `deps`, `script`
- Subject: 10-72 characters, sentence case, no period
- Example: `feat(api): Add campaign list endpoint`

### Best Practices
- Always prefer simple solutions
- Avoid code duplication (check for similar code before adding)
- When fixing bugs, exhaust existing patterns before introducing new ones
- Keep code clean, eliminate redundant code
- Separate mock data from source code
- Always output in English
- Greet with "Hi ONEHub Developer!" in responses

## Critical Rules

### ✅ DO
- Use MediatR for ALL business operations
- Return Result/Result<T> from all operations
- Inject IMediator in endpoints (not repositories)
- Use Repository pattern (inject ICampaignRepository in handlers)
- Extend BaseCommand/BaseNonResultCommand for auto user context
- Use PagingQuery<T> for paged queries
- Validate requests with MiniValidator in endpoints
- Handle business validation in handlers
- Create Criterias in Infrastructure for SELECT
- Create Commands in Infrastructure for INSERT/UPDATE/DELETE
- Register endpoints via static RegisterXXXEndpoints method
- Use Minimal APIs (NOT Controllers)

### ❌ DO NOT
- Inject repositories directly in endpoints
- Throw exceptions for business errors (use Result.Failure)
- Put business logic in endpoints
- Create Controllers (use Minimal APIs)
- Forget to register repository in DependencyInjection.cs
- Mix Application Commands with Infrastructure Commands (they're different)
- Add dependencies from Domain to other layers
- Skip architecture tests

## File Organization

### Backend Structure

```
src/
├── ONEHub.Domain/
│   ├── Entities/{Entity}.cs
│   ├── Repositories/I{Entity}Repository.cs
│   ├── Params/{Entity}Param.cs
│   ├── Results/Result.cs
│   ├── Errors/{Feature}Error.cs
│   ├── Constants/{Feature}Constants.cs
│   └── Settings/{Feature}Setting.cs
├── ONEHub.Application/
│   ├── Features/{Feature}/
│   │   ├── Commands/{Action}{Entity}Command.cs (with Handler in same file)
│   │   └── Queries/Get{Entity}{Operation}Query.cs (with Handler in same file)
│   ├── Services/I{Service}.cs (interfaces only)
│   ├── Shared/Base*.cs (base classes)
│   └── Utils/{Feature}Utils.cs
├── ONEHub.Infrastructure/
│   ├── Repositories/
│   │   ├── {Entity}Repository.cs
│   │   ├── Commands/{Action}{Entity}Command.cs (Fanex.Data)
│   │   └── Criterias/Get{Entity}{Operation}Criteria.cs (Fanex.Data)
│   ├── Services/{Service}.cs (implementations)
│   └── DependencyInjection.cs
└── ONEHub.WebApi/
    ├── Features/{Feature}/
    │   ├── {Feature}EndPoint.cs (Minimal API)
    │   └── {Feature}Models.cs (Request/Response DTOs)
    ├── Configurations/{Feature}ServiceInstaller.cs
    ├── wwwroot/ (Frontend build output)
    └── Program.cs
```

### Frontend Structure

```
client-app/src/
├── features/{feature}/
│   ├── api/
│   │   ├── client.ts        # API calls
│   │   ├── queries.ts       # useQuery hooks
│   │   └── commands.ts      # useMutation hooks
│   ├── components/          # Feature-specific components
│   ├── data/                # Schemas, types, mock data
│   ├── types/               # TypeScript types
│   ├── utils/               # Feature utilities
│   └── index.tsx            # Main component
├── components/
│   ├── ui/                  # shadcn/ui components (some RTL-modified)
│   └── layout/              # Layout components
├── lib/
│   ├── api/client.ts        # Axios instance with interceptors
│   ├── auth/                # Auth utilities
│   └── utils.ts             # General utilities
├── routes/
│   ├── __root.tsx           # Root layout
│   ├── _authenticated/      # Protected routes
│   └── (auth)/              # Public auth routes
├── stores/
│   └── auth-store.ts        # Zustand auth store
├── locales/                 # i18n translation files
└── main.tsx                 # App entry point
```

## Authentication

JWT-based with cookie support. Access/refresh token pattern.

**Key Services:**
- `ICurrentUserService` - Get current user from JWT claims
- `IJwtTokenService` - Token generation/validation

**Endpoints:**
- `POST /api/auth/login`
- `POST /api/auth/sso`
- `POST /api/auth/refresh-token`
- `POST /api/auth/logout`

## Common Pitfalls

### Backend Pitfalls

1. **Confusing Application Commands vs Infrastructure Commands** - Both have similar names but different purposes. Application Commands are MediatR requests, Infrastructure Commands are Fanex.Data database commands.

2. **Forgetting to register repository** - Always add `services.AddSingleton<IXRepository, XRepository>()` in Infrastructure/DependencyInjection.cs

3. **Injecting repository in endpoint** - NEVER do this. Always inject IMediator and send Query/Command.

4. **Throwing exceptions for business errors** - Use Result.Failure instead.

5. **Creating Controllers** - This project uses Minimal APIs, not Controllers.

6. **Putting UserId/Ip in Query/Command manually** - Extend BaseCommand for auto-injection.

### Frontend Pitfalls

1. **Using npm or yarn instead of pnpm** - ALWAYS use pnpm. The project uses pnpm lockfile and workspace features.

2. **Modifying RTL-aware shadcn components** - Several UI components have been modified for RTL support. Check RTL behavior after changes.

3. **Using useCallback/useMemo without justification** - Avoid premature optimization. Only use when documented performance issues exist.

4. **Adding comments to self-documenting code** - Code should be clear without comments. Only add for extremely complex logic.

5. **Forgetting to invalidate query cache after mutations** - Always invalidate relevant queries in `onSuccess` of mutations.

6. **Not handling loading/error states** - TanStack Query provides `isLoading` and `error` states. Always handle them in UI.

### Integration Pitfalls

1. **Backend Result structure mismatch** - Backend must return `{ errorCode, errorMessage, data }` structure. Frontend axios client expects this format.

2. **Not handling errorCode !== 0** - Frontend treats `errorCode !== 0` as error. Ensure backend sets proper error codes.

3. **Missing CORS configuration** - In development, Vite proxy handles this. In production, ensure backend CORS is configured if needed.

## Additional Resources

- [client-app/CLAUDE.md](client-app/CLAUDE.md) - Detailed frontend documentation
- [README.md](README.md) - Project overview and setup
- `.cursor/rules/commit.mdc` - Commit message rules
- `.cursor/rules/common.mdc` - Common development rules
