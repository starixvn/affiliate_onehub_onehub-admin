# Change: Combine Page Management Dashboard and Data Grid into Single Stored Procedure

## Why

Currently, the Page Management feature uses two separate stored procedures (`OH_PageBuilder_ManageSel` for data grid and `OH_PageBuilder_Dashboard_Sel` for dashboard summary) and two separate API endpoints (`GET /api/page-management` and `GET /api/page-management/summary`). This creates unnecessary network overhead and code duplication. By combining these into a single stored procedure that returns multiple result sets, we can reduce API calls and simplify the architecture.

## What Changes

- **BREAKING**: Remove `OH_PageBuilder_Dashboard_Sel` stored procedure
- Modify `OH_PageBuilder_ManageSel` to return two result sets (data grid + dashboard summary)
- Create new `PagingDataWithDashboard<T, TDashboard>` generic class in Domain layer to hold both result sets with type safety
- Create new `FetchPagingDataWithDashboardAsync<T, TDashboard>` method in BaseRepository using `FetchMultipleAsync<T1, T2>`
- Update `IPageManagementRepository` to return combined data structure
- Update `GetLandingPageListQuery` handler to return both data and dashboard in single operation
- **BREAKING**: Remove `GET /api/page-management/summary` endpoint
- **BREAKING**: Remove `GetPageManagementDashboardQuery` and its handler
- Update frontend to receive dashboard data from list endpoint response
- Remove `GetPageManagementDashboardCriteria` class

## Impact

- **Affected specs**: `pagebuilder-dashboard`
- **Affected code**:
  - `src/ONEHub.Domain/Results/PagingData.cs` - Add new `PagingDataWithDashboard<T, TDashboard>` generic class
  - `src/ONEHub.Domain/Repositories/IPageManagementRepository.cs` - Update `GetLandingPageListAsync` signature
  - `src/ONEHub.Infrastructure/Repositories/BaseRepository.cs` - Add `FetchPagingDataWithDashboardAsync` method
  - `src/ONEHub.Infrastructure/Repositories/PageManagementRepository.cs` - Update implementation
  - `src/ONEHub.Infrastructure/Repositories/Criterias/LandingPages/GetLandingPageListCriteria.cs` - Updated to handle multiple result sets
  - `src/ONEHub.Application/Features/LandingPages/PageManagement/Queries/GetLandingPageListQuery.cs` - Update handler to return dashboard data
  - `src/ONEHub.WebApi/Features/PageManagement/PageManagementEndPoint.cs` - Remove summary endpoint
  - `src/ONEHub.WebApi/Features/PageManagement/PageManagementModel.cs` - Update response models
  - `client-app/src/features/page-management/` - Update frontend to consume combined endpoint
- **Database**: Stored procedure `OH_PageBuilder_ManageSel` must be modified to return second result set with dashboard aggregates
- **Breaking changes**: Frontend consuming `/api/page-management/summary` must migrate to receiving dashboard from `/api/page-management` response
