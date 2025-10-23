# ONEHub Admin .NET 9 - Architecture Rules

**Date:** October 22, 2025  
**Version:** 1.0  
**Status:** Official Guidelines

---

## 🎯 Core Principle: ONE Pattern, ONE Way

**We use MediatR + Fanex.Data for ALL business operations.**

**NO MORE:**
- ❌ Services with business logic methods (like `ILandingPageService.GetCampaignInfoList()`)
- ❌ Hybrid approach (both Services + MediatR)
- ❌ Confusion about which pattern to use

**YES:**
- ✅ MediatR Queries/Commands for ALL operations
- ✅ Minimal utility services (File, Image, Session, Auth) - NO business logic
- ✅ Controllers inject `IMediator` + utility services only

---

## 📋 Table of Contents

1. [Layer Responsibilities](#layer-responsibilities)
2. [Naming Conventions](#naming-conventions)
3. [Query Pattern](#query-pattern)
4. [Command Pattern](#command-pattern)
5. [Service Rules](#service-rules)
6. [Controller Rules](#controller-rules)
7. [Domain Commands vs Application Commands](#domain-commands-vs-application-commands)
8. [When to Create What](#when-to-create-what)
9. [Code Examples](#code-examples)
10. [Checklist for New Features](#checklist-for-new-features)

---

## Layer Responsibilities

### 1. **Domain Layer** (`ONEHub.Domain`)
**Purpose:** Business entities, interfaces, constants

**Contains:**
- ✅ Entities (DTOs for results)
- ✅ Interfaces (ISessionService, IFileService, etc.)
- ✅ Commands (data contracts for `IDynamicRepository.ExecuteAsync`)
- ✅ Criterias (data contracts for `IDynamicRepository.GetAsync/FetchAsync`)
- ✅ Constants (Function names, ErrCode, etc.)
- ✅ Common (ResultInfo, EntityResult)

**Does NOT contain:**
- ❌ MediatR IRequest/IRequestHandler
- ❌ Business logic
- ❌ Validation logic (except in Command.IsValid())

**Example:**
```csharp
// Domain/Commands/LandingPages/UpdateAssetCommand.cs
public class UpdateAssetCommand : UploadAssetsCommand
{
    private const string SP_NAME = "Aff_LandingPage_AssetUploader_Upd";
    
    public int MediaId { get; set; }
    
    public override string GetSettingKey() => SP_NAME;
    public override bool IsValid() => ModuleId > 0 && MediaId > 0;
}
```

---

### 2. **Application Layer** (`ONEHub.Application`)
**Purpose:** Business logic, orchestration

**Contains:**
- ✅ MediatR Queries (IRequest\<T\>)
- ✅ MediatR Commands (IRequest\<T\>)
- ✅ Handlers (IRequestHandler)
- ✅ ALL business logic
- ✅ ALL validation logic
- ✅ DTOs (request/response models for controllers)

**Does NOT contain:**
- ❌ Direct SP execution (use Domain Commands/Criterias)
- ❌ Infrastructure concerns (file I/O, image processing - use services)

**Example:**
```csharp
// Application/LandingPages/AssetUploader/Commands/UpdateAssetCommand.cs
public record UpdateAssetCommand(
    IFormFile? File,
    int MediaId,
    string TargetCountryCode,
    ...) : IRequest<ResultInfo>;

public class UpdateAssetCommandHandler : IRequestHandler<UpdateAssetCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(...)
    {
        // 1. Validation
        var validationResult = _landingPageService.ValidateLanguageByTargetCountry(...);
        
        // 2. Business logic
        var result = await ProcessAssetUpdate(...);
        
        // 3. Create Domain Command (use alias!)
        var command = new UpdateCommand { ... };
        
        // 4. Execute
        var rowsAffected = await _repository.ExecuteAsync(command);
        
        return rowsAffected > 0 ? ResultInfo.Success : ResultInfo.GenerateError("...");
    }
}
```

---

### 3. **Infrastructure Layer** (`ONEHub.Infrastructure`)
**Purpose:** External concerns (file I/O, image processing, session, auth)

**Contains:**
- ✅ Utility services implementations (FileService, ImageService, SessionService, AuthService)
- ✅ File operations
- ✅ Image processing
- ✅ Session management
- ✅ JWT token generation
- ✅ External API calls

**Does NOT contain:**
- ❌ Business logic
- ❌ MediatR handlers
- ❌ Database operations (use IDynamicRepository in handlers)

**Allowed Services:**
1. **FileService** - File upload/delete/validation
2. **ImageService** - Image dimension extraction
3. **SessionService** - Session management (Redis)
4. **AuthService** - JWT, claims, authentication
5. **SystemFileService** - System file operations

**Example:**
```csharp
// Infrastructure/Services/FileService.cs
public class FileService : IFileService
{
    public async Task UploadFileAsync(IFormFile file, string path)
    {
        // File I/O operations only
    }
    
    public ResultInfo ValidateFile(string fileName, long fileSize, Stream stream)
    {
        // Infrastructure validation (file size, extension)
    }
}
```

---

### 4. **WebApi Layer** (`ONEHub.WebApi`)
**Purpose:** HTTP endpoints

**Contains:**
- ✅ Controllers
- ✅ Request/Response models
- ✅ HTTP concerns (authentication, authorization)

**Does NOT contain:**
- ❌ Business logic
- ❌ Direct repository calls
- ❌ Direct service calls (except utility services)

**Example:**
```csharp
// WebApi/Controllers/LandingPageController.cs
public class LandingPageController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ISessionService _sessionService;  // Utility only
    
    [HttpPost("list")]
    public async Task<IActionResult> GetList([FromBody] PageManagementRequest request)
    {
        var query = new GetPageManagementListQuery(criteria);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
```

---

## Naming Conventions

### Queries (Read Operations)

**Pattern:** `Get{Entity}{Operation}Query`

**Examples:**
- ✅ `GetPageManagementListQuery`
- ✅ `GetAssetDetailQuery`
- ✅ `GetCampaignInfoListQuery`
- ✅ `GetAllLanguagesInSystemQuery`
- ✅ `GetModuleListQuery`

**File Location:**
```
ONEHub.Application/
  └─ {Feature}/
      └─ Queries/
          └─ Get{Entity}{Operation}Query.cs
```

**Example:**
```
ONEHub.Application/
  └─ LandingPages/
      └─ LandingPageService/
          └─ Queries/
              ├─ GetCampaignInfoListQuery.cs
              ├─ GetModuleListQuery.cs
              └─ GetLanguageListQuery.cs
```

---

### Commands (Write Operations)

**Pattern:** `{Action}{Entity}Command`

**Examples:**
- ✅ `UpdateAssetCommand`
- ✅ `UploadAssetsCommand`
- ✅ `DeleteAssetsCommand`
- ✅ `InsertPageBuilderCommand`
- ✅ `ToggleLandingPageStatusCommand`

**File Location:**
```
ONEHub.Application/
  └─ {Feature}/
      └─ Commands/
          └─ {Action}{Entity}Command.cs
```

---

### Criterias (Domain Layer)

**Pattern:** `Get{Entity}{Detail/List}Criteria`

**Examples:**
- ✅ `GetPageManagementCriteria`
- ✅ `GetAssetDetailCriteria`
- ✅ `GetCampaignInfoCriteria`
- ✅ `UserPermissionCriteria`

**File Location:**
```
ONEHub.Domain/
  └─ Criterias/
      └─ {Category}/
          └─ {Entity}Criteria.cs
```

---

### Domain Commands (Data Layer)

**Pattern:** `{Action}{Entity}Command`

**Examples:**
- ✅ `UpdateAssetCommand`
- ✅ `InsertPageBuilderCommand`
- ✅ `DeleteAssetsCommand`

**File Location:**
```
ONEHub.Domain/
  └─ Commands/
      └─ {Category}/
          └─ {Action}{Entity}Command.cs
```

**IMPORTANT:** Domain Commands have same name as Application Commands - **ALWAYS use alias in handlers!**

```csharp
using UpdateCommand = ONEHub.Domain.Commands.LandingPages.UpdateAssetCommand;
```

---

## Query Pattern

### Rule: Use MediatR Query for ALL read operations

**Structure:**
1. **Query** (Application layer) - IRequest\<TResult\>
2. **Handler** (Application layer) - IRequestHandler
3. **Criteria** (Domain layer) - CriteriaBase
4. **Entity** (Domain layer) - Result DTO

### Example: GetCampaignInfoListQuery

**Step 1: Create Criteria (Domain)**
```csharp
// Domain/Criterias/LandingPages/GetCampaignInfoCriteria.cs
namespace ONEHub.Domain.Criterias.LandingPages;

public class GetCampaignInfoCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_LandingPage_Campaign_Sel";
    
    public override string GetSettingKey() => SP_NAME;
    public override bool IsValid() => true;
}
```

**Step 2: Create Entity (Domain) - if not exists**
```csharp
// Domain/Entities/Campaigns/CampaignInfo.cs
namespace ONEHub.Domain.Entities.Campaigns;

public class CampaignInfo
{
    public int CampaignId { get; set; }
    public string CampaignName { get; set; } = string.Empty;
    public int StatusId { get; set; }
}
```

**Step 3: Create Query + Handler (Application)**
```csharp
// Application/LandingPages/LandingPageService/Queries/GetCampaignInfoListQuery.cs
using MediatR;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Entities.Campaigns;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.LandingPages.LandingPageService.Queries;

public record GetCampaignInfoListQuery() : IRequest<IEnumerable<CampaignInfo>>;

public class GetCampaignInfoListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetCampaignInfoListQuery, IEnumerable<CampaignInfo>>
{
    public async Task<IEnumerable<CampaignInfo>> Handle(
        GetCampaignInfoListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<CampaignInfo>(new GetCampaignInfoCriteria());
        return results;
    }
}
```

**Step 4: Use in Controller**
```csharp
[HttpGet("campaigns")]
public async Task<IActionResult> GetCampaigns()
{
    var query = new GetCampaignInfoListQuery();
    var result = await _mediator.Send(query);
    return Ok(result);
}
```

---

## Command Pattern

### Rule: Use MediatR Command for ALL write operations

**Structure:**
1. **Command** (Application layer) - IRequest\<ResultInfo\> with ALL parameters
2. **Handler** (Application layer) - IRequestHandler with ALL business logic
3. **Domain Command** (Domain layer) - Data contract for repository (aliased!)

### Example: UpdateAssetCommand

**Step 1: Create Domain Command (if needed)**
```csharp
// Domain/Commands/LandingPages/UpdateAssetCommand.cs
namespace ONEHub.Domain.Commands.LandingPages;

public class UpdateAssetCommand : UploadAssetsCommand
{
    private const string SP_NAME = "Aff_LandingPage_AssetUploader_Upd";
    
    public int MediaId { get; set; }
    
    public override string GetSettingKey() => SP_NAME;
    public override bool IsValid() => ModuleId > 0 && MediaId > 0;
}
```

**Step 2: Create Application Command + Handler**
```csharp
// Application/LandingPages/AssetUploader/Commands/UpdateAssetCommand.cs
using MediatR;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;
using UpdateCommand = ONEHub.Domain.Commands.LandingPages.UpdateAssetCommand;  // ← ALIAS!

namespace ONEHub.Application.LandingPages.AssetUploader.Commands;

public record UpdateAssetCommand(
    IFormFile? File,
    int MediaId,
    int ModuleId,
    string TargetCountryCode,
    string LanguageCode,
    string InputFileName,
    string InputMediaName,
    int UserId,
    string Ip,
    string FunctionName) : IRequest<ResultInfo>;

public class UpdateAssetCommandHandler(
    IDynamicRepository repository,
    IFileService fileService,
    ILandingPageService landingPageService,  // For utilities only
    ILogger<UpdateAssetCommandHandler> logger)
    : IRequestHandler<UpdateAssetCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateAssetCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            // 1. Validation
            var validationResult = landingPageService.ValidateLanguageByTargetCountry(
                request.LanguageCode, request.TargetCountryCode);
            if (!validationResult.IsSuccessful)
                return validationResult;
            
            // 2. Business logic
            var result = await ProcessAssetUpdate(request);
            
            return result;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating asset");
            return ResultInfo.GenerateError("Error updating asset");
        }
    }
    
    private async Task<ResultInfo> ProcessAssetUpdate(UpdateAssetCommand request)
    {
        // 3. Create Domain Command (use alias!)
        var command = new UpdateCommand
        {
            MediaId = request.MediaId,
            ModuleId = request.ModuleId,
            Files = filesXml,
            UserId = request.UserId,
            Ip = request.Ip,
            FunctionName = request.FunctionName
        };
        
        // 4. Execute database operation
        var rowsAffected = await repository.ExecuteAsync(command);
        
        if (rowsAffected > 0)
        {
            // 5. Post-processing (file operations)
            fileService.DeleteFile(oldFilePath);
            await fileService.UploadFileAsync(request.File, path);
            return ResultInfo.Success;
        }
        
        return ResultInfo.GenerateError("Update asset failed");
    }
}
```

**Step 3: Use in Controller**
```csharp
[HttpPost("update")]
public async Task<IActionResult> UpdateAsset([FromForm] UpdateAssetRequest request)
{
    var command = new UpdateAssetCommand(
        request.File,
        request.MediaId,
        request.ModuleId,
        request.TargetCountryCode,
        request.LanguageCode,
        request.InputFileName,
        request.InputMediaName,
        _sessionService.UserId,
        HttpContext.Connection.RemoteIpAddress?.ToString() ?? "",
        Function.AssetUploader);
    
    var result = await _mediator.Send(command);
    return Ok(result);
}
```

---

## Service Rules

### ❌ NOT ALLOWED: Business Logic Services

**DO NOT create services like:**
```csharp
public interface ILandingPageService
{
    IEnumerable<CampaignInfo> GetCampaignInfoList();      // ❌ Use MediatR Query
    IEnumerable<ModuleInfo> GetModuleList();              // ❌ Use MediatR Query
    ResultInfo UpdatePageStatus(...);                     // ❌ Use MediatR Command
}
```

### ✅ ALLOWED: Utility Services

**Only create services for infrastructure concerns:**

1. **IFileService** - File operations
   ```csharp
   Task UploadFileAsync(IFormFile file, string path);
   void DeleteFile(string path);
   ResultInfo ValidateFile(string fileName, long fileSize, Stream stream);
   ```

2. **IImageService** - Image processing
   ```csharp
   string ExtractImageDimensions(Stream stream);
   ```

3. **ISessionService** - Session management
   ```csharp
   int UserId { get; }
   string SessionId { get; }
   List<ClaimsIdentity> ClaimIdentities { get; }
   ```

4. **IAuthService** - Authentication
   ```csharp
   List<Claim> GetClaims(int userId, List<UserPermission> permissions);
   ```

5. **ISystemFileService** - System file operations
   ```csharp
   void EnsureDirectoryExists(string path);
   ```

### Rule: Services MUST NOT contain:
- ❌ Database queries (use MediatR Query + Criteria)
- ❌ Database commands (use MediatR Command)
- ❌ Business validation (put in handler)
- ❌ Business logic (put in handler)

### Exception: Temporary Utility Methods

If a utility method is used by multiple handlers, keep it in a service temporarily:

```csharp
public interface ILandingPageUtilityService  // Temporary - will be refactored
{
    // Validation utility (used by multiple handlers)
    ResultInfo ValidateLanguageByTargetCountry(string languageCode, string targetCountryCode);
    
    // Path utility (used by multiple handlers)
    string GetAssetFolder(int moduleId, string targetCountryCode, string languageCode);
}
```

**Long-term goal:** Move to static helper classes or extension methods.

---

## Controller Rules

### Rule 1: Inject IMediator + Utility Services Only

**Good:**
```csharp
public class LandingPageController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ISessionService _sessionService;
    private readonly IConfiguration _configuration;
    
    public LandingPageController(
        IMediator mediator,
        ISessionService sessionService,
        IConfiguration configuration)
    {
        _mediator = mediator;
        _sessionService = sessionService;
        _configuration = configuration;
    }
}
```

**Bad:**
```csharp
public class LandingPageController : ControllerBase
{
    private readonly ILandingPageService _landingPageService;  // ❌ NO business logic services
    private readonly ICampaignService _campaignService;        // ❌ NO business logic services
}
```

### Rule 2: Controllers Should Be Thin

**Good:**
```csharp
[HttpPost("list")]
public async Task<IActionResult> GetList([FromBody] PageManagementRequest request)
{
    var criteria = new GetPageManagementCriteria
    {
        PageIndex = request.PageIndex,
        PageSize = request.PageSize,
        TargetCountryCodes = request.TargetCountryCodes
    };
    
    var query = new GetPageManagementListQuery(criteria);
    var result = await _mediator.Send(query);
    return Ok(result);
}
```

**Bad:**
```csharp
[HttpPost("list")]
public async Task<IActionResult> GetList([FromBody] PageManagementRequest request)
{
    // ❌ Business logic in controller
    if (string.IsNullOrEmpty(request.TargetCountryCodes))
        return BadRequest("Country is required");
    
    // ❌ Direct repository call
    var result = await _repository.FetchAsync<PageManagementDto>(criteria);
    
    return Ok(result);
}
```

---

## Domain Commands vs Application Commands

### The Confusion: Same Names!

**Problem:**
```
ONEHub.Domain/Commands/LandingPages/UpdateAssetCommand.cs
ONEHub.Application/LandingPages/AssetUploader/Commands/UpdateAssetCommand.cs
```

Both have the same name! Which one to use?

### The Solution: ALWAYS Use Alias in Handlers

**Rule:** In Application handlers, **ALWAYS alias Domain Commands**

**Pattern:**
```csharp
using {Alias}Command = ONEHub.Domain.Commands.{Category}.{Action}{Entity}Command;
```

**Examples:**
```csharp
using UpdateCommand = ONEHub.Domain.Commands.LandingPages.UpdateAssetCommand;
using InsertCommand = ONEHub.Domain.Commands.LandingPages.InsertPageBuilderCommand;
using DeleteCommand = ONEHub.Domain.Commands.LandingPages.DeleteAssetsCommand;
```

**Then use the alias in handler:**
```csharp
public class UpdateAssetCommandHandler : IRequestHandler<UpdateAssetCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(UpdateAssetCommand request, ...)
    {
        // Create Domain Command using alias
        var command = new UpdateCommand  // ← Uses alias, NOT UpdateAssetCommand
        {
            MediaId = request.MediaId,
            ModuleId = request.ModuleId
        };
        
        var rowsAffected = await _repository.ExecuteAsync(command);
        return rowsAffected > 0 ? ResultInfo.Success : ResultInfo.GenerateError("Failed");
    }
}
```

### Why Two Commands?

**Domain Command** (Simple, 10-15 lines):
- Data contract for `IDynamicRepository.ExecuteAsync()`
- Contains only database parameters
- Has SP name and validation
- Pure data, no business logic

**Application Command** (Rich, 200+ lines):
- MediatR request with ALL business parameters (includes IFormFile, etc.)
- Handler contains ALL business logic
- Validation, file operations, image processing
- Orchestrates multiple services

**Example:**

```csharp
// Domain Command - Simple data holder
public class UpdateAssetCommand : UploadAssetsCommand
{
    private const string SP_NAME = "Aff_LandingPage_AssetUploader_Upd";
    public int MediaId { get; set; }  // Only DB parameters
    public override string GetSettingKey() => SP_NAME;
    public override bool IsValid() => ModuleId > 0 && MediaId > 0;
}

// Application Command - Rich business model
public record UpdateAssetCommand(
    IFormFile? File,               // ← Not in DB
    int MediaId,
    int ModuleId,
    string TargetCountryCode,
    string LanguageCode,
    string InputFileName,          // ← Business parameter
    string InputMediaName,         // ← Business parameter
    int UserId,
    string Ip,
    string FunctionName) : IRequest<ResultInfo>;
```

---

## When to Create What

### Scenario 1: Simple Read Operation (No Parameters)

**Example:** Get all campaigns

**Create:**
1. ✅ Criteria (Domain)
2. ✅ Query + Handler (Application)

**Do NOT create:**
- ❌ Service method
- ❌ Complex DTOs (use entity directly)

---

### Scenario 2: Read Operation with Filters

**Example:** Get page management list with filters

**Create:**
1. ✅ Criteria with properties (Domain)
2. ✅ Query with criteria parameter + Handler (Application)
3. ✅ Request DTO (Application DTOs folder - for controller)

**Do NOT create:**
- ❌ Service method

---

### Scenario 3: Simple Write Operation

**Example:** Toggle status

**Create:**
1. ✅ Domain Command (if not exists)
2. ✅ Application Command + Handler
3. ✅ Request DTO (for controller)

**Handler should:**
- ✅ Create Domain Command
- ✅ Call `repository.ExecuteAsync()`
- ✅ Return ResultInfo

---

### Scenario 4: Complex Write Operation

**Example:** Upload asset (file + database + validation)

**Create:**
1. ✅ Domain Command
2. ✅ Application Command (with IFormFile, etc.)
3. ✅ Handler with full business logic:
   - Validation
   - File operations (use IFileService)
   - Image processing (use IImageService)
   - Database operation
   - Post-processing

---

### Scenario 5: Utility Operation (No Database)

**Example:** Validate file size, extract image dimensions

**Create:**
- ✅ Service method (IFileService, IImageService)

**Do NOT create:**
- ❌ MediatR Query/Command (no database involved)

---

## Code Examples

### Example 1: Convert Service Method to Query

**Before (Service):**
```csharp
public interface ILandingPageService
{
    IEnumerable<ModuleInfo> GetModuleList();
}

public class LandingPageService : ILandingPageService
{
    private readonly IDynamicRepository _repository;
    
    public IEnumerable<ModuleInfo> GetModuleList()
    {
        return _repository.FetchAsync<ModuleInfo>(new GetModuleCriteria()).Result;
    }
}
```

**After (MediatR):**
```csharp
// 1. Criteria (Domain)
public class GetModuleCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_LandingPage_Module_Sel";
    public override string GetSettingKey() => SP_NAME;
    public override bool IsValid() => true;
}

// 2. Query + Handler (Application)
public record GetModuleListQuery() : IRequest<IEnumerable<ModuleInfo>>;

public class GetModuleListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetModuleListQuery, IEnumerable<ModuleInfo>>
{
    public async Task<IEnumerable<ModuleInfo>> Handle(
        GetModuleListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<ModuleInfo>(new GetModuleCriteria());
        return results;
    }
}

// 3. Controller
[HttpGet("modules")]
public async Task<IActionResult> GetModules()
{
    var query = new GetModuleListQuery();
    var result = await _mediator.Send(query);
    return Ok(result);
}
```

---

### Example 2: Utility Method (Keep in Service)

**Validation utility used by multiple handlers:**

```csharp
// Interface (Domain)
public interface ILandingPageUtilityService
{
    ResultInfo ValidateLanguageByTargetCountry(string languageCode, string targetCountryCode);
}

// Implementation (Infrastructure)
public class LandingPageUtilityService : ILandingPageUtilityService
{
    private readonly IDynamicRepository _repository;
    
    public ResultInfo ValidateLanguageByTargetCountry(string languageCode, string targetCountryCode)
    {
        if (string.IsNullOrEmpty(languageCode) || string.IsNullOrEmpty(targetCountryCode))
            return ResultInfo.GenerateError("Invalid parameters");
        
        var languages = _repository.FetchAsync<Language>(new TargetCountryCriteria()).Result;
        var isValid = languages.Any(l =>
            l.LanguageCode == languageCode &&
            l.TargetCountryCode == targetCountryCode);
        
        return isValid ? ResultInfo.Success : ResultInfo.GenerateError("Invalid language for country");
    }
}

// Use in Handler
public class UpdateAssetCommandHandler : IRequestHandler<UpdateAssetCommand, ResultInfo>
{
    private readonly ILandingPageUtilityService _utilityService;
    
    public async Task<ResultInfo> Handle(...)
    {
        var validationResult = _utilityService.ValidateLanguageByTargetCountry(
            request.LanguageCode, request.TargetCountryCode);
        
        if (!validationResult.IsSuccessful)
            return validationResult;
        
        // Continue...
    }
}
```

---

## Checklist for New Features

### ✅ Before Creating Any Service Method

Ask yourself:
1. Is this a database query? → Use MediatR Query
2. Is this a database command? → Use MediatR Command
3. Is this business logic? → Put in MediatR Handler
4. Is this validation? → Put in MediatR Handler
5. Is this a file operation? → Use IFileService
6. Is this image processing? → Use IImageService
7. Is this truly a reusable utility? → Consider service, but prefer static helper

### ✅ Before Creating MediatR Query

1. Does Criteria exist in Domain? If not, create it
2. Does Entity exist in Domain? If not, create it
3. Query file location correct? `Application/{Feature}/Queries/`
4. Query name follows pattern? `Get{Entity}{Operation}Query`
5. Handler injecting only necessary services?

### ✅ Before Creating MediatR Command

1. Does Domain Command exist? If not, create it
2. Application Command has ALL business parameters?
3. Domain Command aliased in handler? `using {Alias}Command = ...`
4. Handler has proper error handling and logging?
5. Command file location correct? `Application/{Feature}/Commands/`
6. Command name follows pattern? `{Action}{Entity}Command`

### ✅ Before Updating Controller

1. Controller only injects IMediator + utility services?
2. No business logic in controller action?
3. Request validation done in handler (not controller)?
4. Using `await _mediator.Send()` for all operations?

---

## Anti-Patterns to Avoid

### ❌ Don't: Create service for every query

```csharp
// BAD
public interface ICampaignService
{
    IEnumerable<Campaign> GetCampaigns();
    Campaign GetCampaignById(int id);
    ResultInfo InsertCampaign(Campaign campaign);
    ResultInfo UpdateCampaign(Campaign campaign);
}
```

**Use MediatR instead!**

---

### ❌ Don't: Put business logic in controllers

```csharp
// BAD
[HttpPost("upload")]
public async Task<IActionResult> Upload([FromForm] UploadRequest request)
{
    // ❌ Validation in controller
    if (request.Files == null || request.Files.Count == 0)
        return BadRequest("Files are required");
    
    // ❌ Business logic in controller
    foreach (var file in request.Files)
    {
        var path = Path.Combine(uploadPath, file.FileName);
        using var stream = file.OpenReadStream();
        await File.WriteAllBytesAsync(path, stream.ToArray());
    }
    
    return Ok();
}
```

**Put all logic in MediatR Handler!**

---

### ❌ Don't: Forget to alias Domain Commands

```csharp
// BAD
using ONEHub.Domain.Commands.LandingPages;  // ❌ No alias

public class UpdateAssetCommandHandler : IRequestHandler<UpdateAssetCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(...)
    {
        // ❌ Which UpdateAssetCommand? Application or Domain?
        var command = new UpdateAssetCommand { ... };  // CONFUSING!
    }
}
```

**Always use alias:**
```csharp
// GOOD
using UpdateCommand = ONEHub.Domain.Commands.LandingPages.UpdateAssetCommand;

public class UpdateAssetCommandHandler : IRequestHandler<UpdateAssetCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(...)
    {
        var command = new UpdateCommand { ... };  // Clear!
    }
}
```

---

### ❌ Don't: Mix Service and MediatR in same feature

```csharp
// BAD
public class LandingPageController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILandingPageService _service;  // ❌ Hybrid!
    
    [HttpGet("list")]
    public async Task<IActionResult> GetList()
    {
        // Using MediatR
        var result = await _mediator.Send(new GetListQuery());
        return Ok(result);
    }
    
    [HttpGet("campaigns")]
    public IActionResult GetCampaigns()
    {
        // Using Service - INCONSISTENT!
        var result = _service.GetCampaignInfoList();
        return Ok(result);
    }
}
```

**Use MediatR for everything:**
```csharp
// GOOD
public class LandingPageController : ControllerBase
{
    private readonly IMediator _mediator;  // Only this!
    
    [HttpGet("list")]
    public async Task<IActionResult> GetList()
    {
        var result = await _mediator.Send(new GetListQuery());
        return Ok(result);
    }
    
    [HttpGet("campaigns")]
    public async Task<IActionResult> GetCampaigns()
    {
        var result = await _mediator.Send(new GetCampaignInfoListQuery());
        return Ok(result);
    }
}
```

---

## Migration Checklist

### Converting Existing Service to MediatR

1. ✅ Identify all service methods
2. ✅ For each method:
   - If returns data → Create Query + Handler
   - If modifies data → Create Command + Handler
   - If utility → Keep in service (temporarily)
3. ✅ Create Criterias/Domain Commands if needed
4. ✅ Update all controllers to use MediatR
5. ✅ Remove service interface and implementation
6. ✅ Remove service registration from DI
7. ✅ Test build (0 errors)

---

## Summary: The Golden Rules

1. **ONE Pattern:** MediatR for ALL business operations
2. **NO Services:** For business logic (use MediatR)
3. **YES Services:** Only for utilities (File, Image, Session, Auth)
4. **ALWAYS Alias:** Domain Commands in handlers
5. **Thin Controllers:** Only IMediator + utility services
6. **Rich Handlers:** All business logic, validation, orchestration
7. **Clear Names:** Follow naming conventions strictly
8. **Proper Location:** Files in correct layer and folder

---

## Questions?

If you're unsure:
1. Is it a database operation? → MediatR Query/Command
2. Is it business logic? → MediatR Handler
3. Is it file/image/session operation? → Utility Service
4. When in doubt? → Ask: "Would this method exist in multiple services?" If no, use MediatR!

---

**Last Updated:** October 22, 2025  
**Review:** Every 6 months or when adding major features

---

*This document is the single source of truth for ONEHub Admin architecture. Follow these rules to maintain consistency and avoid confusion.*

