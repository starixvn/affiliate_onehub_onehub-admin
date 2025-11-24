# Change: Remove PageBuilder Dashboard Filter Parameters

## Why

The PageBuilder Dashboard currently requires date range parameters and supports optional filters for search, status, country, and language. These parameters are not needed for the dashboard's purpose, which is to display all-time aggregate statistics. Removing these parameters simplifies the implementation and aligns the dashboard with its intended use case of showing global counts.

## What Changes

- Remove all filter parameters from the PageBuilder Dashboard endpoint
- Update stored procedure `OH_PageBuilder_Dashboard_Sel` to accept zero parameters
- Simplify backend query, criteria, and repository methods to be parameterless
- Update frontend API calls to not send any parameters
- Dashboard will return all-time totals: Total, Draft, Active, and Inactive page builder counts

## Impact

**Affected specs:**
- `pagebuilder-dashboard` (MODIFIED: remove parameter requirements)

**Affected code:**
- Backend: `src/ONEHub.Infrastructure/Repositories/Criterias/LandingPages/GetPageManagementDashboardCriteria.cs`
- Backend: `src/ONEHub.Domain/Params/PageManagementParam.cs`
- Backend: `src/ONEHub.Application/Features/LandingPages/PageManagement/Queries/GetPageManagementDashboardQuery.cs`
- Backend: `src/ONEHub.WebApi/Features/PageManagement/PageManagementEndPoint.cs`
- Backend: `src/ONEHub.WebApi/Features/PageManagement/PageManagementModels.cs`
- Backend: `src/ONEHub.Infrastructure/Repositories/PageManagementRepository.cs`
- Frontend: `client-app/src/features/landing-page-cms/page-management/api/client.ts`
- Frontend: `client-app/src/features/landing-page-cms/page-management/api/queries.ts`
- Frontend: `client-app/src/features/landing-page-cms/page-management/types/index.ts`
- Database: Stored procedure `OH_PageBuilder_Dashboard_Sel`

**Breaking Changes:**
- **BREAKING**: The endpoint `GET /api/page-management/summary` will no longer accept query parameters
- **BREAKING**: Frontend components must update API calls to remove filter parameters
