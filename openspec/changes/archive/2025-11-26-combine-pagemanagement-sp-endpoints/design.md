# Design: Combined Page Management SP and Endpoint

## Context

The current Page Management implementation uses two separate stored procedures and API endpoints:
1. `OH_PageBuilder_ManageSel` (data grid) → `GET /api/page-management`
2. `OH_PageBuilder_Dashboard_Sel` (dashboard) → `GET /api/page-management/summary`

This results in two separate database calls and two HTTP requests from the frontend to load the page management view. The dashboard data is derived from the same underlying dataset (`#Data` temp table) as the paginated results, making the separation inefficient.

SQL Server supports returning multiple result sets from a single stored procedure, and Fanex.Data's `IDynamicRepository.FetchMultipleAsync<T1, T2>` can consume them. We can leverage this to combine both operations.

## Goals / Non-Goals

**Goals:**
- Reduce network overhead by combining two API calls into one
- Reduce database overhead by combining two stored procedures into one
- Maintain clean architecture and existing patterns (Result pattern, CQRS, Repository pattern)
- Preserve existing filtering and pagination behavior
- Keep frontend changes minimal and backward-compatible during transition

**Non-Goals:**
- Changing the data structure or business logic of dashboard calculations
- Modifying other endpoints or features
- Changing the frontend UI layout or user experience
- Altering the pagination behavior

## Decisions

### Decision 1: Create `PagingDataWithDashboard<T, TDashboard>` Generic Class

**What**: New generic class that extends pagination data with a dashboard property, supporting both data item type and dashboard type as generic parameters.

**Why**:
- Maintains type safety with generic paging items AND dashboard type
- Reusable pattern for future features that need dashboard + paging with different dashboard models
- Follows existing `PagingData<T>` pattern while adding dashboard flexibility
- Avoids hardcoding `PageManagementDashboard` type, making it truly generic

**Structure**:
```csharp
public class PagingDataWithDashboard<T, TDashboard> where TDashboard : new()
{
    public IEnumerable<T> Items { get; set; } = [];
    public int TotalItem { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
    public TDashboard Dashboard { get; set; } = new();
}
```

**Constraints**:
- `TDashboard : new()` - Ensures dashboard type has parameterless constructor for safe initialization

**Alternatives considered**:
- `PagingDataWithDashboard<T>` with hardcoded `PageManagementDashboard` - Not reusable for other dashboard types
- Using `PagingData<T>` with additional property in response DTO - Less type-safe at domain level
- Tuple return type `(PagingData<T>, TDashboard)` - Less explicit, harder to work with in handlers

### Decision 2: Add `FetchPagingDataWithDashboardAsync<T, TDashboard>` to BaseRepository

**What**: New protected method in `BaseRepository` that uses `FetchMultipleAsync<T, TDashboard>` to retrieve paging data and dashboard in one call.

**Why**:
- Centralizes the pattern for consuming multiple result sets
- Maintains consistency with existing `FetchPagingDataAsync` pattern
- Reusable for other features that need similar behavior
- Handles `PagingCriteria.TotalItem` output parameter correctly

**Signature**:
```csharp
protected virtual async Task<Result<PagingDataWithDashboard<T>>> FetchPagingDataWithDashboardAsync<T, TDashboard>(
    PagingCriteria criteria)
    where T : class
    where TDashboard : class
```

**Implementation approach**:
```csharp
var (data, dashboardData) = await dynamicRepository.FetchMultipleAsync<T, TDashboard>(criteria);
var result = new PagingDataWithDashboard<T, TDashboard>
{
    Items = [.. data],
    Dashboard = dashboardData.FirstOrDefault() ?? new TDashboard(),
    TotalItem = criteria.TotalItem,
    PageSize = criteria.PageSize,
    PageIndex = criteria.PageIndex
};
return Result<PagingDataWithDashboard<T, TDashboard>>.Success(result);
```

**Alternatives considered**:
- Implementing directly in `PageManagementRepository` - Would not be reusable for other repositories
- Creating separate `PagingDataWithDashboard` repository base class - Over-engineering for single use case

### Decision 3: Modify `OH_PageBuilder_ManageSel` Stored Procedure

**What**: Add a second SELECT statement after the main paging query that returns dashboard aggregates.

**SQL Addition** (after existing SELECT):
```sql
SELECT COUNT(*) AS TotalPageBuilders
      ,SUM(CASE WHEN p.StatusId = 0 THEN 1 ELSE 0 END) AS DraftPageBuilders
      ,SUM(CASE WHEN p.StatusId = 1 THEN 1 ELSE 0 END) AS ActivePageBuilders
      ,SUM(CASE WHEN p.StatusId = 2 THEN 1 ELSE 0 END) AS InactivePageBuilders
FROM #Data p
```

**Why**:
- Reuses existing `#Data` temp table that already contains filtered results
- No additional filtering logic needed - dashboard reflects same dataset as grid
- Minimal database change with maximum reuse
- Dashboard aggregates are calculated from already-filtered data

**Alternatives considered**:
- Separate CTEs or subqueries - More complex, less efficient than reusing `#Data` temp table
- Keeping separate stored procedures - Defeats the purpose of this change

### Decision 4: Remove Dashboard Query and Endpoint

**What**: Delete `GetPageManagementDashboardQuery`, its handler, and the `/api/page-management/summary` endpoint.

**Why**:
- Dashboard data now comes from list query - no separate query needed
- Reduces code duplication and maintenance burden
- Simplifies API surface area

**Migration path**:
- Frontend updates to consume dashboard from list response
- No backward compatibility needed (internal application, coordinated deployment)

**Alternatives considered**:
- Keeping both endpoints during transition - Unnecessary complexity for internal app
- Making summary endpoint redirect to list endpoint - Over-engineering

### Decision 5: Frontend Response Structure

**What**: Update `GetLandingPageListQuery` response to include dashboard data using `PagingDataWithDashboard<LandingPageResponse, PageManagementDashboardResponse>`.

**Response model**:
```csharp
// WebApi response wraps Result<PagingDataWithDashboard<LandingPageResponse, PageManagementDashboardResponse>>
{
  "errorCode": 0,
  "errorMessage": "",
  "data": {
    "items": [ /* LandingPageResponse[] */ ],
    "totalItem": 100,
    "pageIndex": 1,
    "pageSize": 20,
    "dashboard": {
      "total": 100,
      "draft": 25,
      "active": 60,
      "inactive": 15
    }
  }
}
```

**Why**:
- Keeps Result pattern consistent
- Dashboard is part of the query result, not metadata
- Type-safe dashboard model separate from items model
- Frontend extracts dashboard from same response as items

**Alternatives considered**:
- Separate top-level dashboard property in Result - Breaks existing Result<T> structure
- Metadata field in Result - Not semantically correct, dashboard is data not metadata

## Risks / Trade-offs

### Risk: Breaking Frontend During Deployment
- **Mitigation**: Deploy backend first with both endpoints, then deploy frontend update, then remove old endpoint in follow-up
- **Decision**: For this internal app with coordinated deployments, we'll do atomic update (simpler)

### Risk: Stored Procedure Change Impacts Other Callers
- **Mitigation**: Verify `OH_PageBuilder_ManageSel` is only called from `GetLandingPageListCriteria`
- **Mitigation**: Review SpNames.xml to ensure no other usages

### Trade-off: Generic Pattern vs Specific Implementation
- **Chosen**: Generic `PagingDataWithDashboard<T, TDashboard>` and `FetchPagingDataWithDashboardAsync<T, TDashboard>`
- **Trade-off**: More complex generics for future reusability vs simpler specific implementation
- **Rationale**: Pattern is likely to be reused (campaigns, components, users, etc. may want similar behavior with different dashboard types)
- **Benefit**: Fully type-safe - no casting or type assumptions, works with any dashboard model

### Trade-off: Dashboard Data Freshness
- **Current**: Dashboard always matches current filtered dataset
- **Impact**: Dashboard changes with pagination/filtering (desired behavior)
- **Verification**: Confirm this matches business requirements

## Migration Plan

### Phase 1: Backend Changes (Single PR)
1. Add `PagingDataWithDashboard<T>` to Domain
2. Add `FetchPagingDataWithDashboardAsync` to Infrastructure
3. Update repository interface and implementation
4. Update query handler
5. Remove dashboard query and handler
6. Update endpoint to remove summary route
7. Run architecture tests

### Phase 2: Database Changes
1. Modify `OH_PageBuilder_ManageSel` stored procedure to add dashboard SELECT
2. Test stored procedure returns both result sets correctly
3. Verify output parameter `@NRows` still populated correctly

### Phase 3: Frontend Changes (Single PR)
1. Update TypeScript types for list response
2. Remove separate dashboard API call
3. Extract dashboard from list response
4. Update components to use dashboard from list query

### Phase 4: Cleanup
1. Delete `GetPageManagementDashboardCriteria.cs`
2. Remove unused imports and references
3. Run `dotnet clean` and rebuild

### Rollback Plan
If issues occur:
1. Revert stored procedure to return single result set
2. Restore `OH_PageBuilder_Dashboard_Sel` stored procedure
3. Restore dashboard query and endpoint
4. Revert frontend changes

## Open Questions

1. **Q**: Should dashboard aggregates be calculated from filtered `#Data` or from all records?
   **A**: From filtered `#Data` - dashboard should reflect the current filtered view.

2. **Q**: Should we keep the old summary endpoint for a transition period?
   **A**: No - this is an internal application with coordinated deployments, atomic update is simpler.

3. **Q**: Should `PagingDataWithDashboard<T>` be generic in dashboard type?
   **A**: Yes - use `PagingDataWithDashboard<T, TDashboard>` with both type parameters for maximum reusability and type safety. This allows different features to use different dashboard models.

4. **Q**: What happens to export endpoint (`/api/page-management/export`)?
   **A**: Unchanged - it uses same `GetLandingPageListQuery` with `IsExportExcel=true`, will receive dashboard in response but can ignore it.

5. **Q**: Should `TDashboard` have a constraint?
   **A**: Yes - `where TDashboard : new()` ensures the dashboard type can be safely instantiated with default constructor if the second result set is empty.
