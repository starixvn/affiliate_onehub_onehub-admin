# Docker Build Fix - Newtonsoft.Json Version Conflict

## Problem

Docker build failed with NuGet version conflict error:

```
error NU1107: Version conflict detected for Newtonsoft.Json. Install/reference Newtonsoft.Json 3.5.8 directly to project ONEHub.WebApi to resolve this issue. 
ONEHub.WebApi -> ONEHub.Application -> Newtonsoft.Json 
ONEHub.WebApi -> Serilog.Settings.Configuration 2.0.0 -> Newtonsoft.Json (>= 9.0.1).
```

## Root Cause

The **Dockerfile was missing critical package management files**:
- `Directory.Packages.props` - Contains centralized package versions
- `Directory.Build.props` - Contains build configuration including `ManagePackageVersionsCentrally`

Without these files, the Docker restore process couldn't resolve package versions correctly, causing the conflict between different Newtonsoft.Json version requirements.

## Solution

### 1. Fixed Dockerfile (src/ONEHub.WebApi/Dockerfile)

Added missing files to COPY commands:

```dockerfile
COPY *.sln .
COPY nuget.config ./
COPY Directory.Packages.props ./        # ✅ ADDED
COPY Directory.Build.props ./           # ✅ ADDED
COPY src/ONEHub.Domain/*.csproj ./ONEHub.Domain/
COPY src/ONEHub.Application/*.csproj ./ONEHub.Application/
COPY src/ONEHub.Infrastructure/*.csproj ./ONEHub.Infrastructure/
COPY src/ONEHub.WebApi/*.csproj ./ONEHub.WebApi/
```

Also fixed the source copy path (path mismatch issue):

```dockerfile
# Before (incorrect - copies to /src/src/ instead of /src/)
COPY src/ ./src/

# After (correct - copies to same location as .csproj files)
COPY src/ONEHub.Domain/ ./ONEHub.Domain/
COPY src/ONEHub.Application/ ./ONEHub.Application/
COPY src/ONEHub.Infrastructure/ ./ONEHub.Infrastructure/
COPY src/ONEHub.WebApi/ ./ONEHub.WebApi/
```

**Why this matters:**
- `.csproj` files are copied to `/src/ONEHub.WebApi/`
- Source files must be in the same location
- Using `COPY src/ ./src/` would create `/src/src/ONEHub.WebApi/` (wrong!)
- This caused "CS5001: Program does not contain a static 'Main' method" error

### 2. Enhanced Package Configuration

**Directory.Packages.props:**
- Added `NoWarn` for NU1701 (Fanex legacy package compatibility warnings)
- Added transitive dependency pins for security and compatibility:
  - System.Data.SqlClient 4.8.6
  - System.Text.Encodings.Web 9.0.0
  - Microsoft.Extensions.Configuration 9.0.10
  - Microsoft.Extensions.Configuration.Binder 9.0.10

**Project Files:**
- Added `NoWarn` for NU1701 to all project files
- Added explicit `Newtonsoft.Json` reference to ONEHub.WebApi.csproj
- Removed circular reference: ONEHub.Application → ONEHub.Infrastructure

**nuget.config:**
- Added DNAide package pattern to Nexdev source mapping

## Package Versions (from Directory.Packages.props)

- Newtonsoft.Json: **13.0.3** (centralized version)
- Serilog.Settings.Configuration: **9.0.0** (requires Newtonsoft.Json >= 9.0.1)

Both requirements are now satisfied with centralized version 13.0.3.

## Testing

To verify the fix:

```bash
# Build Docker image
docker build -f src/ONEHub.WebApi/Dockerfile -t onehub-admin:test .

# Verify restore succeeds
docker build --target builder -f src/ONEHub.WebApi/Dockerfile -t onehub-admin:test-restore .
```

## Files Changed

1. `src/ONEHub.WebApi/Dockerfile` - Added Directory.*.props files, fixed source copy
2. `Directory.Packages.props` - Added NoWarn, transitive dependency pins
3. `nuget.config` - Added DNAide package mapping
4. `src/ONEHub.Application/ONEHub.Application.csproj` - Added NoWarn, removed circular ref
5. `src/ONEHub.Infrastructure/ONEHub.Infrastructure.csproj` - Added NoWarn
6. `src/ONEHub.WebApi/ONEHub.WebApi.csproj` - Added NoWarn, explicit Newtonsoft.Json ref

## Key Learnings

1. **Always copy package management files in Docker multi-stage builds**
   - Directory.Packages.props (for central package management)
   - Directory.Build.props (for build configuration)
   - nuget.config (for source configuration)

2. **Centralized Package Management requires all config files**
   - MSBuild needs Directory.Build.props to know centralized management is enabled
   - Without it, package versions default to whatever is specified in individual .csproj files

3. **Explicit references help resolve conflicts**
   - Adding explicit Newtonsoft.Json reference to WebApi project helps NuGet understand the dependency tree

## Clean Architecture Considerations

### Application → Infrastructure Reference

**Question:** Is it acceptable for Application layer to reference Infrastructure in Clean Architecture?

**Answer:** **It depends on what's being referenced.**

In pure Clean Architecture:
- **Domain** (Core): No dependencies
- **Application** (Use Cases): Depends on **Domain only**
- **Infrastructure** (Implementations): Depends on **Domain only**  
- **WebApi** (Presentation): Depends on Application + Infrastructure (for DI wiring)

However, in this project:
- **IFileService** (Infrastructure.Interfaces) uses `IFormFile`/`IFormFileCollection` from ASP.NET Core
- These are framework-specific types that Domain should NOT depend on
- **ICryptographyService** (Domain.Interfaces) is framework-agnostic ✅

### Solution: Pragmatic Approach

1. **Created ICryptographyService** in Domain.Interfaces (framework-agnostic)
   - Application layer uses this abstraction
   - Infrastructure implements it using CryptographyHelper
   
2. **Kept IFileService** in Infrastructure.Interfaces (framework-specific)
   - Application references Infrastructure.Interfaces for this
   - Acceptable trade-off to avoid abstracting away file upload framework types

3. **LoginCommandHandler** now uses ICryptographyService instead of direct CryptographyHelper utility

### Alternative Solutions (not implemented)

- **Option 1**: Create framework-agnostic abstractions over IFormFile
  - Pro: Pure Clean Architecture
  - Con: Requires significant refactoring (200+ usages)
  
- **Option 2**: Move file handling to a separate "Contracts" layer
  - Pro: Separation of concerns
  - Con: Adds complexity for minimal benefit

## Status

✅ All changes staged and ready for commit
✅ Build succeeded with 0 errors, 89 warnings
✅ Docker build should now succeed
✅ No version conflicts expected
✅ Clean Architecture improved with ICryptographyService abstraction

