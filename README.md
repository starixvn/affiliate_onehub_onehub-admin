# ONEHub Admin - Backend API

.NET 9 backend with Clean Architecture for the ONEHub Affiliate Admin system.

**Tech Stack:** .NET 9, ASP.NET Core, MediatR (CQRS), Dapper, Redis, Serilog

[← Back to Main README](../../README.md)

---

## 📁 Project Structure

```
apps/api/
├── src/
│   ├── ONEHub.Domain/              # Core domain logic
│   │   ├── Entities/               # Domain entities
│   │   ├── Interfaces/             # Repository interfaces
│   │   ├── Constants/              # Domain constants
│   │   ├── Commands/               # CQRS command models
│   │   └── Criterias/              # Query criteria
│   ├── ONEHub.Application/         # Business logic (CQRS)
│   │   ├── Auth/                   # Authentication (Login, JWT, etc.)
│   │   ├── Home/                   # Dashboard features
│   │   ├── Affiliates/             # Affiliate management
│   │   ├── Campaigns/              # Campaign management
│   │   ├── LandingPages/           # Landing page builder
│   │   └── [other features]/
│   ├── ONEHub.Infrastructure/      # External concerns
│   │   ├── Services/               # Service implementations
│   │   ├── Data/                   # Database access (Dapper)
│   │   └── DependencyInjection.cs  # DI registration
│   └── ONEHub.WebApi/              # Presentation layer
│       ├── Controllers/            # API endpoints
│       ├── Program.cs              # Application startup
│       ├── appsettings.json        # Configuration
│       └── wwwroot/                # Static files (old frontend)
├── ONEHub.Admin.sln               # Visual Studio solution
├── Directory.Build.props           # Shared MSBuild properties
├── Directory.Packages.props        # Centralized package management
├── nuget.config                    # NuGet sources
├── Dockerfile                      # Docker containerization
└── project.json                    # Nx configuration
```

---

## 🚀 Quick Start

### Prerequisites

- **.NET 9 SDK** ([Download](https://dotnet.microsoft.com/download/dotnet/9.0))
- **SQL Server** (connection strings in appsettings)
- **Redis Server** (10.18.200.194:16379 or local)
- **Node.js 22+** (for Nx workspace)
- **pnpm** (package manager)

### Setup

```bash
# From repository root
pnpm install

# Restore NuGet packages
nx restore api
# or: cd apps/api && dotnet restore
```

### Run Development Server

```bash
# From repository root
nx serve api
# or: pnpm api:serve

# Direct dotnet
cd apps/api
dotnet run --project src/ONEHub.WebApi/ONEHub.WebApi.csproj
```

**Access:**
- API: https://localhost:7137
- Swagger UI: https://localhost:7137/swagger
- Health Check: https://localhost:7137/health

### Build

```bash
# From repository root
nx build api

# With configuration
nx build api --configuration=production

# Direct dotnet
cd apps/api
dotnet build ONEHub.Admin.sln -c Release
```

### Clean

```bash
nx clean api
# or: cd apps/api && dotnet clean
```

---

## 🏗️ Architecture

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│          ONEHub.WebApi              │  Presentation Layer
│  (Controllers, Middleware, Startup) │  - HTTP APIs
├─────────────────────────────────────┤  - Authentication/Authorization
│       ONEHub.Application            │  Application Layer
│    (Handlers, Validators, DTOs)     │  - Business logic (CQRS)
├─────────────────────────────────────┤  - Use cases
│         ONEHub.Domain               │  Domain Layer
│   (Entities, Interfaces, Rules)     │  - Core business models
├─────────────────────────────────────┤  - Domain logic
│      ONEHub.Infrastructure          │  Infrastructure Layer
│  (Data Access, External Services)   │  - Database, Redis, Logging
└─────────────────────────────────────┘  - Third-party integrations
```

### Key Patterns

- **CQRS**: Commands and Queries separated via MediatR
- **Repository Pattern**: Data access abstracted via interfaces
- **Dependency Injection**: ASP.NET Core DI container
- **Options Pattern**: Strongly-typed configuration

---

## 🔧 Configuration

### appsettings.json

Located at: `src/ONEHub.WebApi/appsettings.json`

```json
{
  "ConnectionStrings": {
    "DBReport": "Server=...;Database=...;",
    "DBAff": "Server=...;Database=...;"
  },
  "Jwt": {
    "SecretKey": "your-secret-key",
    "Issuer": "ONEHubAdmin",
    "Audience": "ONEHubAdminUsers",
    "AccessTokenExpiryMinutes": 60,
    "RefreshTokenExpiryDays": 7
  },
  "fanex.caching.redis": {
    "Host": "10.18.200.194:16379",
    "Password": "your-redis-password",
    "ApplicationName": "ONEHub.Admin"
  },
  "Serilog": {
    "WriteTo": [
      { "Name": "Console" },
      { "Name": "File", "Args": { "path": "logs/app-.log" } }
    ]
  }
}
```

### Environment-Specific Config

- `appsettings.Development.json` - Local development
- `appsettings.Staging.json` - Staging environment
- `appsettings.Production.json` - Production environment

---

## 🔐 Authentication

### JWT Flow

```
1. POST /api/auth/login
   → { userName, password }
   ← { accessToken, refreshToken, expiresIn }

2. Subsequent API calls
   → Header: Authorization: Bearer {accessToken}

3. Token refresh (before expiry)
   → POST /api/auth/refresh-token { refreshToken }
   ← { accessToken, refreshToken, expiresIn }

4. Logout
   → POST /api/auth/logout
```

### Cookie-Based Auth

For browser-based clients, JWT is also stored in HttpOnly cookie:
```csharp
Cookie: accessToken={jwt}
```

---

## 📊 Database

### Connection Management

- **Dapper** for data access (micro-ORM)
- **Stored Procedures** for complex queries
- **fanex.Data.ProxyClient** for database operations

### Migrations

Database migrations are managed externally (not EF Core migrations).

---

## 🧪 Testing

```bash
# Run tests
nx test api

# With coverage
cd apps/api
dotnet test --collect:"XPlat Code Coverage"
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh JWT
- `POST /api/auth/logout` - User logout
- `GET /api/auth/ping` - Session check

### Affiliates
- `GET /api/affiliates` - List affiliates
- `GET /api/affiliates/{id}` - Get affiliate details
- `PUT /api/affiliates/{id}` - Update affiliate

### Campaigns
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign

### Landing Pages
- `GET /api/landingpages` - List landing pages
- `POST /api/landingpages` - Create landing page
- `GET /api/landingpages/{id}` - Get page details
- `PUT /api/landingpages/{id}` - Update page

**Full API documentation:** https://localhost:7137/swagger

---

## 🐳 Docker

### Build Image

```bash
cd apps/api
docker build -t onehub-admin-api:latest .
```

### Run Container

```bash
docker run -d \
  -p 5000:5000 \
  -e ASPNETCORE_ENVIRONMENT=Production \
  -e ConnectionStrings__DBAff="..." \
  --name onehub-admin-api \
  onehub-admin-api:latest
```

---

## 📦 Dependencies

### Core Packages
- `Microsoft.AspNetCore.OpenApi` - OpenAPI/Swagger
- `Microsoft.AspNetCore.Authentication.JwtBearer` - JWT auth
- `Microsoft.Extensions.Caching.StackExchangeRedis` - Redis cache
- `MediatR` - CQRS pattern
- `FluentValidation` - Input validation
- `Dapper` - Data access
- `Serilog.AspNetCore` - Logging
- `SkiaSharp` - Image processing

See [Directory.Packages.props](Directory.Packages.props) for full list.

---

## 🔍 Troubleshooting

### Issue: "Cannot connect to database"
**Solution:** Check connection strings in `appsettings.json`

### Issue: "Redis connection failed"
**Solution:** Ensure Redis is running on configured host/port

### Issue: "Unauthorized (401)"
**Solution:** Check JWT configuration, ensure token is valid and not expired

### Issue: "DNAide.dll not found"
**Solution:** Check DNAide.dll path in `ONEHub.Infrastructure/Services`

---

## 📚 Additional Resources

- [.NET 9 Documentation](https://learn.microsoft.com/en-us/dotnet/core/whats-new/dotnet-9)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [MediatR Documentation](https://github.com/jbogard/MediatR)
- [Dapper Documentation](https://github.com/DapperLib/Dapper)

---

## 🔗 Related Documentation

- [Main README](../../README.md) - Monorepo overview
- [Frontend README](../web/README.md) - React frontend
- [NX_MIGRATION_GUIDE.md](../../NX_MIGRATION_GUIDE.md) - Nx setup guide

---

**Maintainer:** ONEHub Development Team
**Version:** .NET 9.0
**Last Updated:** October 24, 2025
