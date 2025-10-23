# ONEHub Admin - .NET 9 Migration

## Project Overview

Migration of ONEHub Affiliate Admin from .NET Framework 4.7.2 to .NET 9 with Clean Architecture.

**Status:** 68% Complete (47/57 services migrated)

**Location:** `D:\Nexdev\onehub-admin-net9\`

---

## ✅ What's Working

### Backend (.NET 9)
- ✅ **Authentication:** JWT-based auth with HS256 algorithm
- ✅ **Session Management:** Redis-based sessions
- ✅ **Database:** Dapper + Fanex.Data.ProxyClient with stored procedures
- ✅ **Logging:** Serilog with TCP/Logstash sink
- ✅ **Configuration:** All settings migrated from Web.config
- ✅ **Encryption:** DNAide.dll integrated (hardcoded path - needs improvement)

### Frontend (React 16)
- ✅ **Login Page:** Working with JWT authentication
- ✅ **Webpack Build:** Successfully configured and building
- ✅ **Static Files:** Properly served by ASP.NET Core
- ✅ **Anti-Forgery Migration:** Removed (JWT is CSRF-immune)

### Services Migrated (47 total)
- 46 data-access services (Affiliate, Customer, Domain, etc.)
- SessionService
- Login & Home functionality

---

## 🚀 Quick Start

### Prerequisites
- .NET 9 SDK
- Node.js 16+ (for webpack)
- Redis server (10.18.200.194:16379)
- SQL Server access

### Run the Application

```powershell
# Backend
cd D:\Nexdev\onehub-admin-net9\src\ONEHub.WebApi
dotnet run

# Frontend (if you need to rebuild)
cd D:\Nexdev\onehub-admin-net9\src\ONEHub.WebApi\wwwroot
npm run build:all:dev
```

**Access:**
- Login: https://localhost:7137/login.html
- Admin: https://localhost:7137/admin.html

---

## 📚 Essential Documentation

1. **WEBPACK_BUILD_SUCCESS.md** - Webpack configuration and build guide
2. **ANTI_FORGERY_TOKEN_COMPARISON.md** - Why we removed anti-forgery tokens
3. **CONFIGURATION_MIGRATION_COMPLETE.md** - Configuration reference
4. **WEEK4_IMPLEMENTATION_PLAN.md** - Implementation plan for remaining services
5. **CLAUDE.md** - Instructions for working with AI assistant

---

## 🏗️ Architecture

### Backend Structure
```
src/
├── ONEHub.Application/        # MediatR handlers (CQRS)
│   ├── Auth/                  # Login, Logout, Refresh Token
│   ├── Home/                  # Dashboard, Online List
│   ├── Affiliates/            # Affiliate management
│   └── [other features]/
├── ONEHub.Domain/             # Domain models, interfaces
├── ONEHub.Infrastructure/     # External services (Redis, logging)
└── ONEHub.WebApi/             # API controllers, Program.cs
    └── wwwroot/               # React frontend
        ├── source/            # React source code
        └── dist/              # Built bundles
```

### Frontend Structure
```
wwwroot/
├── source/
│   ├── js/
│   │   ├── modules/           # Utilities (axios, JWT, etc.)
│   │   └── pages/             # React pages (login, home, etc.)
│   └── style/                 # SASS stylesheets
├── dist/                      # Built files (served to browser)
└── webpack.config.js          # Build configuration
```

---

## 🔧 Configuration

### Key Settings (appsettings.Development.json)

```json
{
  "ConnectionStrings": {
    "DBReport": "Server=...",
    "DBAff": "Server=..."
  },
  "Serilog": {
    "WriteTo": [
      { "Name": "TCPSink" }  // Logstash integration
    ]
  },
  "VaultOptions": {
    "ServerUrl": "http://10.18.200.194:8200",
    "Token": "[vault-token]"
  },
  "fanex.caching.redis": {
    "Host": "10.18.200.194:16379",
    "Password": "[redis-password]"
  },
  "Jwt": {
    "SecretKey": "[jwt-secret]",
    "Issuer": "ONEHubAdmin",
    "Audience": "ONEHubAdminUsers"
  }
}
```

---

## 🧪 Testing

### Test Login

```bash
curl -X POST https://localhost:7137/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userName":"admin","password":"yourpassword"}'
```

**Expected Response:**
```json
{
  "accessToken": "eyJ...",
  "refreshToken": "...",
  "expiresIn": 3600,
  "userName": "admin"
}
```

---

## 📋 TODO (Remaining 10 services)

### High Priority
- [ ] Operation Services (Deal management)
- [ ] Report Services (Affiliate, CPA reports)

### Medium Priority
- [ ] Landing Page Services
- [ ] Media Gallery Services

### Low Priority
- [ ] Additional helper services

**See:** `WEEK4_IMPLEMENTATION_PLAN.md` for details

---

## ⚠️ Known Issues

1. **DNAide.dll:** Hardcoded path - needs to be moved to proper location
2. **Webpack Warnings:** SASS deprecation warnings (safe to ignore)
3. **React Version:** Still on React 16 (consider upgrade to React 18)

---

## 🔐 Authentication Flow

```
1. User enters credentials on /login.html
2. POST /api/auth/login → JWT tokens returned
3. Tokens stored in localStorage
4. All API calls include: Authorization: Bearer {token}
5. Token refresh: POST /api/auth/refresh-token
6. Session check: GET /api/auth/ping
```

**Note:** No anti-forgery tokens needed - JWT is CSRF-immune!

---

## 🛠️ Development Workflow

### Making Frontend Changes

1. Edit source files in `wwwroot/source/`
2. Rebuild: `npm run build:all:dev`
3. Refresh browser (clear cache if needed)

### Making Backend Changes

1. Edit C# files in `Application/`, `Domain/`, or `WebApi/`
2. Restart: `dotnet run`
3. Test endpoints

---

## 📞 Support

**Original Project:** `D:\Nexdev\onehub-admin\`  
**New Project:** `D:\Nexdev\onehub-admin-net9\`

For questions, refer to the documentation files or check the original implementation.

---

**Last Updated:** October 21, 2025  
**Version:** .NET 9.0  
**React Version:** 16.14.0  
**Build Status:** ✅ Passing (0 errors)
